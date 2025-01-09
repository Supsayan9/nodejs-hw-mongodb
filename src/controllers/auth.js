import { ONE_DAY } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const session = await loginUser(req.body);

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.json({
      status: 201,
      message: 'Successfully logged in a user!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshSessionController = async (req, res) => {
  try {
    const session = await refreshSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    await logoutUser({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestResetEmailController = async (req, res) => {
  try {
    await requestResetToken(req.body.email);
    res.json({
      message: 'Reset password email was successfully sent!',
      status: 200,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    await resetPassword(req.body);
    res.json({
      message: 'Password was successfully reset!',
      status: 200,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
