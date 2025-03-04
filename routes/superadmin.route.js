//routes/superadmin.route.js
import express from "express";
import { jwtDecode } from "../middlewares/jwtDecode.js";
import { verifyRole } from "../middlewares/roleMiddleware.js";
import { createSuperadmin } from "../controllers/superAdminController.js";
import { validateCreateSuperadmin } from "../middlewares/validation.js";
import { handleValidationErrors } from "../middlewares/errorHandle.js";

const router = express.Router();

router
    .route("/create-superadmin")
    .post(
        jwtDecode,
        verifyRole(["superadmin"]),
        validateCreateSuperadmin,
        handleValidationErrors,
        createSuperadmin
    );

export default router;
