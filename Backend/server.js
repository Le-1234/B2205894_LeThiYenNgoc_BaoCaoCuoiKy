import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import userRoutes from './app/routes/user.route.js';
import productRoutes from './app/routes/product.route.js';
import loanRoutes from "./app/routes/loan.route.js";
import categoryRoutes from "./app/routes/category.route.js";

import path from 'path';

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/categories", categoryRoutes);

// Static images
app.use("/images", express.static("public/images"));

// Root
app.get('/', (req, res) => {
  res.send('API MyShop đang chạy!');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
