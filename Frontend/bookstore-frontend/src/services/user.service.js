import axios from "axios";
const API_URL = "http://localhost:3000/api/users";

class UserService {
  adminGetAll() {
    return axios.get(`${API_URL}/admin/all`);
  }

  adminDelete(id) {
    return axios.delete(`${API_URL}/admin/delete/${id}`);
  }
}

export default new UserService();
