import api from "../utils/axios";

export default {
  requestloan(productId) {
    return api.post("/loan/request", { productId });
  },

  getMyloans() {
    return api.get("/loan/my");
  },

  extendloan(id) {
    return api.put(`/loan/extend/${id}`);
  },

  returnloan(id) {
    return api.put(`/loan/return/${id}`);
  },

  cancelloan(id) {
    return api.put(`/loan/cancel/${id}`);
  },

  adminGetAll() {
    return api.get("/loan/admin/all");
  },

  approve(id) {
    return api.put(`/loan/admin/approve/${id}`);
  },

  reject(id) {
    return api.put(`/loan/admin/reject/${id}`);
  }
};
