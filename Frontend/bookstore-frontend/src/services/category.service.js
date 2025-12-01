import api from "../utils/axios";

class CategoryService {
  getAll() {
    return api.get("/categories");
  }
}

export default new CategoryService();
