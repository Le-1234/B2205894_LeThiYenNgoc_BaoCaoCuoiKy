import axios from "@/utils/axios.js";

const productService = {
  getAll: async () => {
    const res = await axios.get("/products");
    console.log("API RESPONSE:", res.data);   // <== Thêm log thử
    return res.data.data;                     // <== Nếu backend không có data -> undefined
  },

  getById: async (id) => {
    const res = await axios.get(`/products/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await axios.post("/products", data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`/products/${id}`, data);
    return res.data.data;
  },

  delete: async (id) => {
    const res = await axios.delete(`/products/${id}`);
    return res.data.success;
  },

  // Thêm phương thức tìm kiếm sản phẩm
  searchProducts: async (keyword) => {
    try {
      const res = await axios.get(`/products/search`, {
        params: { keyword }  // Truyền từ khóa vào query params
      });
      return res.data.data;  // Trả về danh sách sản phẩm tìm được
    } catch (error) {
      console.error("Search products error:", error);
      throw error;  // Đảm bảo ném lỗi nếu có lỗi
    }
  }
};

export default productService;
