import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';
import { initializeFirebase } from './firebase.js';
import authRoutes from './routes/auth.js';
import machinesRoutes from './routes/machines.js';
import partsRoutes from './routes/parts.js';
import ordersRoutes from './routes/orders.js';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

initializeFirebase();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/machines', authMiddleware, machinesRoutes);
app.use('/parts', authMiddleware, partsRoutes);
app.use('/orders', authMiddleware, ordersRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
