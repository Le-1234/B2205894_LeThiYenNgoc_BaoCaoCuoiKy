import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db;

export const connectDB = async () => {
  if (db) return db;

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db();
    console.log("✅ MongoDB connected");
    return db;
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  }
};
