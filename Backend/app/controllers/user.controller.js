// file: app/controllers/user.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUsersCollection } from '../models/user.model.js';
import { ObjectId } from "mongodb";

// -------------------- REGISTER --------------------
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const userCollection = await getUsersCollection();
  const existingUser = await userCollection.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email hoặc tên đăng nhập đã tồn tại'
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    username,
    email,
    password: hashedPassword,
    role: 'user',
    createdAt: new Date()
  };

  try {
    await userCollection.insertOne(newUser);

    // 🔥 QUAN TRỌNG: trả về success để frontend biết
    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!'
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi đăng ký, vui lòng thử lại',
      error: err
    });
  }
};

// -------------------- LOGIN --------------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const userCollection = await getUsersCollection();
  const user = await userCollection.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Email không tồn tại'
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Sai mật khẩu'
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "SECRET_KEY",
    { expiresIn: "7d" }
  );

  return res.json({
    success: true,
    message: "Đăng nhập thành công",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};

// ========== GET ALL USERS ==========
export const getAllUsers = async (req, res) => {
  try {
    const users = await (await getUsersCollection())
      .find({}, { projection: { password: 0 } }) // Ẩn password
      .toArray();

    return res.json({
      success: true,
      data: users
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Lỗi lấy danh sách user",
      error: err
    });
  }
};

// ========== DELETE USER ==========
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await (await getUsersCollection()).deleteOne({ _id: new ObjectId(id) });

    return res.json({
      success: true,
      message: "Xóa user thành công"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Xóa user thất bại",
      error: err
    });
  }
};
