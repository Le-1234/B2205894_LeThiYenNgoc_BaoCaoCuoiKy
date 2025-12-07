// app/models/loan.model.js
import { getloansCollection } from "../config/index.js";
import { ObjectId } from "mongodb";

export function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function isOverdue(loan) {
  if (!loan || !loan.dueDate) return false;
  return new Date() > new Date(loan.dueDate);
}

const loanModel = {
  async create(userId, productId) {
    const loans = await getloansCollection();
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
      approvedBy: null,
      approvedAt: null,
      adminNote: null,
    };

    const result = await loans.insertOne(data);
    return { _id: result.insertedId, ...data };
  },

  async findByUser(userId) {
    const loans = await getloansCollection();
    return loans.find({ userId }).sort({ createdAt: -1 }).toArray();
  },

  async findAll(filter = {}) {
    const loans = await getloansCollection();
    return loans.find(filter).sort({ createdAt: -1 }).toArray();
  },

  async findById(id) {
    const loans = await getloansCollection();
    if (!ObjectId.isValid(id)) return null;
    return loans.findOne({ _id: new ObjectId(id) });
  },

  async updateStatus(id, update) {
    const loans = await getloansCollection();
    if (!ObjectId.isValid(id)) return null;
    return loans.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } }
    );
  },

  async findByIdAndUpdate(id, update) {
    await this.updateStatus(id, update);
    return this.findById(id);
  },

  async markOverdueForExpired() {
    const loans = await getloansCollection();
    const now = new Date();
    const res = await loans.updateMany(
      {
        status: { $in: ["approved", "extended"] },
        dueDate: { $lt: now }
      },
      {
        $set: { status: "overdue", updatedAt: new Date() }
      }
    );
    return res;
  }
};

export default loanModel;
