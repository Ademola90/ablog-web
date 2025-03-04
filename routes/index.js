//routes/index.js
import express from "express";
import adminRoutes from "../routes/admin.route.js";
import authRoutes from "../routes/auth.route.js";
import superAdminRoutes from "../routes/superadmin.route.js";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/superadmin", superAdminRoutes);

export default router;
