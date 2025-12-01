// models/category.model.js
import { ObjectId } from "mongodb";
import { getCategoriesCollection } from "../config/index.js";

export const CategoryModel = {
  // Lấy tất cả categories
  async findAll() {
    const col = await getCategoriesCollection();
    return col.find().toArray();
  },

  // Tìm 1 category theo id
  async findById(id) {
    const col = await getCategoriesCollection();
    return col.findOne({ _id: new ObjectId(id) });
  },

  // Tạo category mới
  async create(data) {
    const col = await getCategoriesCollection();
    const result = await col.insertOne({
      name: data.name,
    });
    return result;
  },

  // Cập nhật category
  async update(id, data) {
    const col = await getCategoriesCollection();
    return col.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  },

  // Xóa category
  async delete(id) {
    const col = await getCategoriesCollection();
    return col.deleteOne({ _id: new ObjectId(id) });
  }
};
