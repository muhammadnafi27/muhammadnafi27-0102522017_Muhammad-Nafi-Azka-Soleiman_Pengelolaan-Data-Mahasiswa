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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
