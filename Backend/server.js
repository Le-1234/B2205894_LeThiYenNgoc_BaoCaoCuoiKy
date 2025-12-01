// file: server.js
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import userRoutes from './app/routes/user.route.js';
import productRoutes from './app/routes/product.route.js';
import borrowRoutes from "./app/routes/borrow.route.js";
import categoryRouter from "./app/routes/category.route.js";

import path from 'path';

const app = express();

app.use(cors());

// ❗ CHỈ GIỮ DUY NHẤT express.json
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/categories", categoryRouter);

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
