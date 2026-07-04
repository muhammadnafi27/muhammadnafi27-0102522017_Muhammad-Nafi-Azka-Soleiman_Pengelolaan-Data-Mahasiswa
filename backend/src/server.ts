import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_NAME'];
for (const env of requiredEnv) {
  if (!process.env[env]) {
    console.error(`FATAL ERROR: Environment variable ${env} is not defined.`);
    process.exit(1);
  }
}

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const gracefulShutdown = () => {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
