import express from "express";
import { createSuperadmin, loginSuperadmin, verifySuperadminLogin } from "../controllers/superAdminController.js";


const router = express.Router();

// Super Admin Routes
router.post("/create-super-admin", createSuperadmin);
router.post("/login-super-admin", loginSuperadmin);
router.post("/verify-super-admin-login", verifySuperadminLogin);

export default router;