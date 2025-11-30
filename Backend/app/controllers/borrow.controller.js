// app/controllers/borrow.controller.js
import BorrowModel, { addDays } from "../models/borrow.model.js";
import { getUsersCollection, getProductsCollection } from "../config/index.js";
import { ObjectId } from "mongodb";

async function attachNames(borrows) {
  const Users = await getUsersCollection();
  const Products = await getProductsCollection();

  const userIds = [...new Set(borrows.map(b => ObjectId.createFromHexString(b.userId)))];
  const productIds = [...new Set(borrows.map(b => ObjectId.createFromHexString(b.productId)))];

  const users = await Users.find({ _id: { $in: userIds } }).toArray();
  const products = await Products.find({ _id: { $in: productIds } }).toArray();

  return borrows.map(b => ({
    ...b,
    username: users.find(u => String(u._id) === String(b.userId))?.username || "Không rõ",
    title: products.find(p => String(p._id) === String(b.productId))?.title || "Không rõ"
  }));
}

export default {
  // ----------------------
  // USER REQUEST BORROW
  // ----------------------
  async requestBorrow(req, res) {
    try {
      const { productId } = req.body;

      if (!productId)
        return res.status(400).json({ success: false, message: "Thiếu productId" });

      const existing = (await BorrowModel.findByUser(req.user.id)).find(
        b =>
          String(b.productId) === String(productId) &&
          ["pending", "approved", "extended"].includes(b.status)
      );

      if (existing)
        return res.status(400).json({
          success: false,
          message: "Bạn đã gửi yêu cầu hoặc đang mượn sách này"
        });

      const created = await BorrowModel.create(req.user.id, productId);
      return res.json({ success: true, data: created });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
  },

  // ----------------------
  // USER VIEW HISTORY
  // ----------------------
  async getMyBorrows(req, res) {
    try {
      const list = await BorrowModel.findByUser(req.user.id);
      const populated = await attachNames(list);
      return res.json({ success: true, data: populated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
  },

  // ----------------------
  // ADMIN GET ALL
  // ----------------------
  async adminGetAll(req, res) {
    try {
      if (req.user.role !== "admin")
        return res.status(403).json({ success: false, message: "Không có quyền" });

      const list = await BorrowModel.findAll();
      const populated = await attachNames(list);

      return res.json({ success: true, data: populated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
  },

  // ----------------------
  // ADMIN APPROVE BORROW
  // ----------------------
  async approve(req, res) {
    try {
      if (req.user.role !== "admin")
        return res.status(403).json({ success: false, message: "Không có quyền" });

      const id = req.params.id;
      const borrow = await BorrowModel.findById(id);

      if (!borrow)
        return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu" });

      if (borrow.status !== "pending")
        return res.status(400).json({
          success: false,
          message: `Không thể duyệt yêu cầu ở trạng thái ${borrow.status}`
        });

      // giảm quantity
      const Products = await getProductsCollection();
      const product = await Products.findOne({ _id: ObjectId.createFromHexString(borrow.productId) });

      if (!product)
        return res.status(404).json({ success: false, message: "Sách không tồn tại" });

      if (product.quantity <= 0)
        return res.status(400).json({ success: false, message: "Sách đã hết" });

      await Products.updateOne({ _id: product._id }, { $inc: { quantity: -1 } });

      const now = new Date();
      const due = addDays(7);

      await BorrowModel.updateStatus(id, {
        status: "approved",
        startDate: now,
        approvedAt: now,
        dueDate: due
      });

      const updated = await BorrowModel.findById(id);
      const populated = await attachNames([updated]);

      return res.json({ success: true, data: populated[0] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
  },

  // ----------------------
  // ADMIN REJECT
  // ----------------------
  async reject(req, res) {
    try {
      if (req.user.role !== "admin")
        return res.status(403).json({ success: false, message: "Không có quyền" });

      const id = req.params.id;
      const borrow = await BorrowModel.findById(id);

      if (!borrow)
        return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu" });

      if (borrow.status !== "pending")
        return res.status(400).json({
          success: false,
          message: `Không thể từ chối khi trạng thái ${borrow.status}`
        });

      await BorrowModel.updateStatus(id, { status: "rejected" });

      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
  },

  // ----------------------
  // USER EXTEND 1 TIME
  // ----------------------
  async extend(req, res) {
    try {
      const id = req.params.id;

      const borrow = await BorrowModel.findById(id);
      if (!borrow)
        return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu" });

      if (borrow.userId !== req.user.id)
        return res.status(403).json({ success: false, message: "Không có quyền" });

      if (borrow.status !== "approved")
        return res.status(400).json({
          success: false,
          message: "Chỉ được gia hạn khi đang mượn"
        });

      if (borrow.extendUsed)
        return res.status(400).json({ success: false, message: "Chỉ được gia hạn 1 lần" });

      const newDue = addDays(7, borrow.dueDate ? new Date(borrow.dueDate) : new Date());

      await BorrowModel.updateStatus(id, {
        status: "extended",
        extendUsed: true,
        dueDate: newDue
      });

      const updated = await BorrowModel.findById(id);
      const populated = await attachNames([updated]);

      return res.json({ success: true, data: populated[0] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
  },

  // ----------------------
  // RETURN BOOK
  // ----------------------
  async returnBorrow(req, res) {
    try {
      const id = req.params.id;
      const borrow = await BorrowModel.findById(id);

      if (!borrow)
        return res.status(404).json({ success: false });

      if (borrow.userId !== req.user.id && req.user.role !== "admin")
        return res.status(403).json({ success: false });

      if (!["approved", "extended"].includes(borrow.status))
        return res.status(400).json({ success: false });

      // tăng quantity
      const Products = await getProductsCollection();
      await Products.updateOne(
        { _id: ObjectId.createFromHexString(borrow.productId) },
        { $inc: { quantity: 1 } }
      );

      await BorrowModel.updateStatus(id, {
        status: "returned",
        returnedAt: new Date()
      });

      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
  },

  // ----------------------
  // CANCEL PENDING
  // ----------------------
  async cancel(req, res) {
    try {
      const id = req.params.id;
      const borrow = await BorrowModel.findById(id);

      if (!borrow) return res.status(404).json({ success: false });

      // user cancel
      if (req.user.role !== "admin") {
        if (borrow.userId !== req.user.id)
          return res.status(403).json({ success: false });

        if (borrow.status !== "pending")
          return res.status(400).json({ success: false });

        await BorrowModel.updateStatus(id, { status: "canceled" });
        return res.json({ success: true });
      }

      // admin force cancel
      await BorrowModel.updateStatus(id, { status: "canceled" });
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
  }
};
