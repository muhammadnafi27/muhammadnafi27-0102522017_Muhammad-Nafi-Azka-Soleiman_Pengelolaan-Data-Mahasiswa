import { ENV } from './config/env';
import app from './app';

const port = ENV.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
