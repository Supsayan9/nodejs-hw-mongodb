import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import dotenv from 'dotenv';

dotenv.config();

const bootstrap = async () => {
  try {
    console.log('Initializing application...');

    await initMongoConnection();
    console.log('Database connection established successfully.');

    setupServer();
    console.log('Server is running...');
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
};

bootstrap();
