import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017'; // Địa chỉ MongoDB
const dbName = 'myshop'; // Tên database

let db = null;

// Kết nối đến MongoDB chỉ một lần duy nhất và lưu trữ kết nối
const connectToDatabase = async () => {
  if (!db) {
    try {
      const client = await MongoClient.connect(url, { useUnifiedTopology: true });
      db = client.db(dbName);
      console.log('Kết nối tới MongoDB thành công!');
    } catch (error) {
      console.error('Lỗi khi kết nối MongoDB:', error);
      throw error;
    }
  }
  return db;
};

// Hàm để lấy collection 'products'
export const getProductsCollection = async () => {
  const database = await connectToDatabase();  // Đảm bảo kết nối trước khi lấy collection
  return database.collection('products');
};

