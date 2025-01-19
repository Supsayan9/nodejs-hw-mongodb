import fs from 'fs';
import path from 'path';
import { OAuth2Client } from 'google-auth-library';
import { env } from './env.js';
import { GOOGLE } from '../constants/index.js';
import createHttpError from 'http-errors';

let googleConfig;
try {
  const googleConfigPath = path.join(process.cwd(), 'google.json');

  if (!fs.existsSync(googleConfigPath)) {
    throw new Error('google.json file not found');
  }

  googleConfig = JSON.parse(fs.readFileSync(googleConfigPath, 'utf8'));
} catch (error) {
  throw new Error('Failed to read or parse google.json: ' + error.message);
}

const client = new OAuth2Client({
  clientId: env(GOOGLE.CLIENT_ID) || googleConfig.web.client_id,
  clientSecret: env(GOOGLE.CLIENT_SECRET) || googleConfig.web.client_secret,
  redirectUri: googleConfig.web.redirect_uris[0],
});

export const generateOAuthURL = () => {
  return client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
};

export const validateCode = async (code) => {
  try {
    const response = await client.getToken(code);

    if (!response.tokens.id_token) {
      throw createHttpError(401, 'Unauthorized: No ID token returned');
    }

    const ticket = await client.verifyIdToken({
      idToken: response.tokens.id_token,
    });

    return ticket.getPayload();
  } catch (error) {
    throw createHttpError(401, 'Token validation failed: ' + error.message);
  }
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';

  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }

  return fullName;
};
