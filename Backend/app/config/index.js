import { MongoClient } from "mongodb";

const url = "mongodb://127.0.0.1:27017"; 
const dbName = "myshop";

let db = null;

export const connectToDatabase = async () => {
  try {
    if (db) return db;

    const client = new MongoClient(url, {});

    await client.connect(); // BẮT BUỘC await
    db = client.db(dbName);

    console.log("MongoDB connected!");
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

export const getProductsCollection = async () => {
  const database = await connectToDatabase();
  return database.collection("products");
};
