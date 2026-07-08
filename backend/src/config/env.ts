import 'dotenv/config';

export const ENV = {
  PORT: process.env.PORT || '3000',
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'db_mahasiswa',
  DB_PORT: process.env.DB_PORT || '3306',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '2h',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
};

// Validate critical environment variables
if (!ENV.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is missing.");
  process.exit(1);
}
