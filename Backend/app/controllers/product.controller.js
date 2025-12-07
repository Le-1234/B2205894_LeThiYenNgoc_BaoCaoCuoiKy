import { getProductsCollection } from "../models/product.model.js";

// LẤY TẤT CẢ PRODUCT
export const getAllProducts = async (req, res) => {
  try {
    const collection = await getProductsCollection();
    const products = await collection.find({}).toArray();  

    return res.json({
      success: true,
      data: products   
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// LẤY THEO ID
export const getProductById = async (req, res) => {
  try {
    const collection = await getProductsCollection();
    const { ObjectId } = await import("mongodb");

    const product = await collection.findOne({ _id: new ObjectId(req.params.id) });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    return res.json({
      success: true,
      data: product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// TẠO PRODUCT
export const createProduct = async (req, res) => {
  try {
    const collection = await getProductsCollection();
    const newProduct = req.body;

    const result = await collection.insertOne(newProduct);

    return res.json({
      success: true,
      data: { _id: result.insertedId, ...newProduct },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const collection = await getProductsCollection();
    const { ObjectId } = await import("mongodb");

    await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    const updatedItem = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });

    return res.json({
      success: true,
      data: updatedItem,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  try {
    const collection = await getProductsCollection();
    const { ObjectId } = await import("mongodb");

    await collection.deleteOne({ _id: new ObjectId(req.params.id) });

    return res.json({
      success: true,
      message: "Xóa thành công",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
