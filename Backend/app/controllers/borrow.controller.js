import BorrowModel, { addDays, isOverdue } from "../models/borrow.model.js";

export default {
  // User gửi request mượn
  async requestBorrow(req, res) {
    try {
      const { productId } = req.body;

      const data = await BorrowModel.create(req.user.id, productId);

      return res.json({ success: true, data });
    } catch (err) {
      console.log("Borrow request error:", err);
      res.status(500).json({ success: false, message: "Lỗi server" });
    }
  },

  // User xem lịch sử
  async getMyBorrows(req, res) {
    const list = await BorrowModel.findByUser(req.user.id);

    return res.json({ success: true, data: list });
  },

  // Admin xem tất cả
  async adminGetAll(req, res) {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Không có quyền" });
    }

    const list = await BorrowModel.findAll();
    res.json({ success: true, data: list });
  },

  // Admin duyệt
  async approve(req, res) {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false });
    }

    await BorrowModel.updateStatus(req.params.id, {
      status: "approved",
      startDate: new Date(),
      dueDate: addDays(7)
    });

    res.json({ success: true });
  },

  // Admin từ chối
  async reject(req, res) {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false });
    }

    await BorrowModel.updateStatus(req.params.id, { status: "rejected" });
    res.json({ success: true });
  },

  // Gia hạn 1 lần tối đa 7 ngày
  async extend(req, res) {
    const borrow = await BorrowModel.findById(req.params.id);

    if (!borrow) return res.status(404).json({ success: false });

    if (borrow.extendUsed)
      return res.json({ success: false, message: "Bạn đã gia hạn 1 lần" });

    await BorrowModel.updateStatus(borrow._id, {
      extendUsed: true,
      dueDate: addDays(7)
    });

    res.json({ success: true });
  },

  // Trả sách
  async returnBorrow(req, res) {
    await BorrowModel.updateStatus(req.params.id, { status: "returned" });
    res.json({ success: true });
  },

  // Hủy yêu cầu
  async cancel(req, res) {
    await BorrowModel.updateStatus(req.params.id, { status: "canceled" });
    res.json({ success: true });
  }
};
