import { CategoryModel } from "../models/category.model.js";

export const CategoryController = {
  async getAll(req, res) {
    try {
      const items = await CategoryModel.findAll();
      return res.json(items);
    } catch (err) {
      res.status(500).json({ error: "Lấy danh mục thất bại." });
    }
  },

  async getOne(req, res) {
    try {
      const item = await CategoryModel.findById(req.params.id);
      if (!item) return res.status(404).json({ error: "Không tìm thấy." });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: "Lỗi server." });
    }
  },

  async create(req, res) {
    try {
      const result = await CategoryModel.create(req.body);
      res.json({ message: "Tạo danh mục thành công.", id: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: "Lỗi khi tạo danh mục." });
    }
  },

  async update(req, res) {
    try {
      await CategoryModel.update(req.params.id, req.body);
      res.json({ message: "Cập nhật danh mục thành công." });
    } catch (err) {
      res.status(500).json({ error: "Lỗi khi cập nhật." });
    }
  },

  async remove(req, res) {
    try {
      await CategoryModel.delete(req.params.id);
      res.json({ message: "Xóa danh mục thành công." });
    } catch (err) {
      res.status(500).json({ error: "Lỗi khi xóa." });
    }
  }
};
