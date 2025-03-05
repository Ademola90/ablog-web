import express from "express";
import {
    signup,
    verifyOTP,
    resendOTP,
    login,
    forgotPassword,
    resetPassword,
} from "../controllers/authController.js";
import { signupValidation } from "../validation/validation.js";

const router = express.Router();

// Auth Routes
router.post("/signup", signupValidation, signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;