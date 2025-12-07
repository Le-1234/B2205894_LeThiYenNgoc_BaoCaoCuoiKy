import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myshop";

const client = new MongoClient(uri);

let db;

export async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      console.log("MongoDB connected");

      db = client.db(); 
    } catch (err) {
      console.error("MongoDB connect error:", err);
      throw err;
    }
  }
  return db;
}

export async function getloansCollection() {
  const database = await connectDB();
  return database.collection("loans");
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
