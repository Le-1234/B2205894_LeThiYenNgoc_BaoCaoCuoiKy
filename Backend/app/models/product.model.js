import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'myshop'; 

let db = null;

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

