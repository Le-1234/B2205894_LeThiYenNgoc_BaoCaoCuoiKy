// app/controllers/product.controller.js
import { ObjectId } from "mongodb";
import { getProductsCollection } from "../config/index.js";

export const getProducts = async (req, res) => {
  try {
    const collection = await getProductsCollection();
    const products = await collection.find().toArray();

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};


export const getProductById = async (req, res) => {
  try {
    const col = await getProductsCollection();
    const product = await col.findOne({ _id: new ObjectId(req.params.id) });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const col = await getProductsCollection();

    const newProduct = {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      year: req.body.year
    };

    const result = await col.insertOne(newProduct);

    res.json({ _id: result.insertedId, ...newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const col = await getProductsCollection();

    await col.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    const updated = await col.findOne({ _id: new ObjectId(req.params.id) });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const col = await getProductsCollection();
    await col.deleteOne({ _id: new ObjectId(req.params.id) });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
