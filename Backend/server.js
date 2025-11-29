// file: server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import userRoutes from './app/routes/user.route.js';
import productRoutes from './app/routes/product.route.js';
import path from 'path';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

//images
app.use("/images", express.static("public/images"));

// Root
app.get('/', (req, res) => {
  res.send('API MyShop đang chạy!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
