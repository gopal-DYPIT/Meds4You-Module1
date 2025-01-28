import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import {authenticateToken} from './middlewares/authMiddleware.js';
import userRoutes from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
// import prescriptionRoutes from './routes/prescriptionRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to the database
connectDB();

// Use the authentication route (for login or token generation)
app.use('/api/auth', authRoute);

// Apply the authMiddleware for routes requiring authentication
// These routes will be protected, and a valid JWT is required to access them
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', authenticateToken, orderRoutes); 
app.use('/api/cart', authenticateToken, cartRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// app.use('/api/prescriptions', authMiddleware, prescriptionRoutes);

app.get('/', (req, res) => {
  res.send("Backend Running Successfully");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
