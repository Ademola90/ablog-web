import express from "express";
import { createAdmin, loginAdmin } from "../controllers/adminController.js";
import { authenticateJWT, authorizeRoles } from "../middlewares/authorize.js";

const router = express.Router();

// Admin Routes
router.post("/create-admin", authenticateJWT, authorizeRoles("superadmin"), createAdmin);
router.post("/login-admin", loginAdmin);

export default router;