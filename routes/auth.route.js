//routes/auth.route.js

import express from "express";
import {
    authLogin,
    sendVerificationOTP,
    verifyEmail,
    resendVerificationOTP,
} from "../controllers/authController.js";
// import { validateLogin } from "../middlewares/Validation.js";
import { handleValidationErrors } from "../middlewares/errorHandle.js";
import { validateLogin } from "../middlewares/validation.js";

const router = express.Router();

router.route("/login").post(validateLogin, handleValidationErrors, authLogin);
router.route("/verify/send").post(sendVerificationOTP);
router.route("/verify").post(verifyEmail);
router.route("/verify/resend").post(resendVerificationOTP);

export default router;
