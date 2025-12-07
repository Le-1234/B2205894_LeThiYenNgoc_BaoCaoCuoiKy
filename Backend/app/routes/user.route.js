import express from "express";
import { registerUser, loginUser, getAllUsers, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/admin/all", getAllUsers);
router.delete("/admin/delete/:id", deleteUser);

export default router;
