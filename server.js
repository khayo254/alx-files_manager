import express from 'express';
import { config } from 'dotenv';
import routes from './routes/index.js'; // Import router as default

config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Parse JSON request bodies
app.use(express.json());

// Load routes from the routes/index.js file
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
