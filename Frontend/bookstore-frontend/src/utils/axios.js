// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api", // backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
