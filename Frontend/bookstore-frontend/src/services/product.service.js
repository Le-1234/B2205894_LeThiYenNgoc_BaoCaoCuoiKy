import axios from "@/utils/axios.js";

const productService = {
  getAll: async () => {
    const res = await axios.get("/products");
    console.log("API RESPONSE:", res.data);   // <== thêm log thử
    return res.data.data;                     // <== nếu backend không có data -> undefined
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
  }
};

export default productService;
