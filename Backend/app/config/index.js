// app/config/index.js

import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myshop";

// Chỉ tạo 1 MongoClient duy nhất
const client = new MongoClient(uri);

let db;

// Kết nối vào DB chỉ 1 lần
export async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      console.log("MongoDB connected");

      // Nếu URI có tên DB thì MongoDB tự parse ra
      db = client.db(); 
    } catch (err) {
      console.error("MongoDB connect error:", err);
      throw err;
    }
  }
  return db;
}

// Collections (Lazy loading)
export async function getBorrowsCollection() {
  const database = await connectDB();
  return database.collection("borrows");
}

export async function getProductsCollection() {
  const database = await connectDB();
  return database.collection("products");
}

export async function getUsersCollection() {
  const database = await connectDB();
  return database.collection("users");
}

export async function getCategoriesCollection() {
  const database = await connectDB();
  return database.collection("categories");
}

export default client;
