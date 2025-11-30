import api from "../utils/axios";

export default {
  requestBorrow(productId) {
    return api.post("/borrow/request", { productId });
  },

  getMyBorrows() {
    return api.get("/borrow/my");
  },

  extendBorrow(id) {
    return api.put(`/borrow/extend/${id}`);
  },

  returnBorrow(id) {
    return api.put(`/borrow/return/${id}`);
  },

  cancelBorrow(id) {
    return api.put(`/borrow/cancel/${id}`);
  },

  adminGetAll() {
    return api.get("/borrow/admin/all");
  },

  approve(id) {
    return api.put(`/borrow/admin/approve/${id}`);
  },

  reject(id) {
    return api.put(`/borrow/admin/reject/${id}`);
  }
};
