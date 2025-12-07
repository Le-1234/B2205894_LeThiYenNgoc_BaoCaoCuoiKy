import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import controller from "../controllers/loan.controller.js";

const router = Router();

// USER
router.post("/request", verifyToken, controller.requestloan);
router.get("/my", verifyToken, controller.getMyloans);
router.put("/extend/:id", verifyToken, controller.extend);
router.put("/return/:id", verifyToken, controller.returnloan);
router.put("/cancel/:id", verifyToken, controller.cancel);

// ADMIN
router.get("/admin/all", verifyToken, controller.adminGetAll);
router.put("/admin/approve/:id", verifyToken, controller.approve);
router.put("/admin/reject/:id", verifyToken, controller.reject);

export default router;
