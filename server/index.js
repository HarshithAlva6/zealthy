import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import { initializeDatabase } from './config/database.js';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  process.env.NEXT_ALLOWED_ORIGINS,
  'http://localhost:3000'
];
// Middleware
app.use(cors({
  origin: allowedOrigins, 
  credentials: true,              
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).send('Not found');  
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();