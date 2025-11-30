import { getBorrowsCollection } from "../config/index.js";
import { ObjectId } from "mongodb";

export function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function isOverdue(borrow) {
  return new Date() > new Date(borrow.dueDate);
}

const BorrowModel = {
  async create(userId, productId) {
    const Borrows = await getBorrowsCollection();
    const now = new Date();

    const data = {
      userId,
      productId,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      startDate: null,
      dueDate: null,
      extendUsed: false,
    };

    await Borrows.insertOne(data);
    return data;
  },

  async findByUser(userId) {
    const Borrows = await getBorrowsCollection();
    return Borrows.find({ userId }).sort({ createdAt: -1 }).toArray();
  },

  async findAll() {
    const Borrows = await getBorrowsCollection();
    return Borrows.find().sort({ createdAt: -1 }).toArray();
  },

  async findById(id) {
    const Borrows = await getBorrowsCollection();
    return Borrows.findOne({ _id: new ObjectId(id) });
  },

  async updateStatus(id, update) {
    const Borrows = await getBorrowsCollection();
    return Borrows.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } }
    );
  }
};

export default BorrowModel;
