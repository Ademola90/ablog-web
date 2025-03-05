import express from "express";
import authRoutes from "./auth.route.js";
import adminRoutes from "./admin.route.js";
import superAdminRoutes from "./superadmin.route.js";

const router = express.Router();

// Use all routes
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/superadmin", superAdminRoutes);

export default router;