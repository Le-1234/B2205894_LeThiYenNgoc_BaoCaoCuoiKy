import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db = null;

export const connectDB = async () => {
  if (db) return db;

  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("MongoDB connected!");
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export const getUsersCollection = async () => {
  const database = await connectDB();
  return database.collection("users");
};
