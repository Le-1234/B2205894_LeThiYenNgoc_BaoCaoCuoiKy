// file: src/services/auth.service.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" }
});

// Tự động gắn token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // -----------------------
  //  REGISTER
  // -----------------------
  async register(data) {
    try {
      const res = await api.post("/users/register", data);
      return res.data;
    } catch (err) {
      return err.response?.data || { success: false, message: "Lỗi server" };
    }
  },

  // -----------------------
  //  LOGIN
  // -----------------------
  async login(data) {
    try {
      const res = await api.post("/users/login", data);

      // Lưu token + user
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      return res.data;
    } catch (err) {
      return err.response?.data || { success: false, message: "Lỗi đăng nhập" };
    }
  },

  // -----------------------
  //  LOGOUT
  // -----------------------
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // -----------------------
  //  Lấy user hiện tại
  // -----------------------
  getCurrentUser() {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  },

  // -----------------------
  //  Kiểm tra login
  // -----------------------
  isLoggedIn() {
    return !!localStorage.getItem("token");
  }
};
