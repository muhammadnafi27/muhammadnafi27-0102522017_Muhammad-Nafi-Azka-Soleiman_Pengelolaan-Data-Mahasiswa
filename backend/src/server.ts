import app from './app';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is missing.");
  process.exit(1);
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
