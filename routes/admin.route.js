//routes/admin.routes.js
import express from "express";
import {
    createAdmin,
    getAllAdmins,
    getAdmin,
    updateAdmin,
    deleteAdmin,
} from "../controllers/adminController.js";
import { jwtDecode } from "../middlewares/jwtDecode.js";
import { verifyRole } from "../middlewares/roleMiddleware.js";
import { handleValidationErrors } from "../middlewares/errorHandle.js";
import { validateAdmin } from "../middlewares/validation.js";

const router = express.Router();

router
    .route("/create")
    .post(
        jwtDecode,
        verifyRole(["superadmin"]),
        handleValidationErrors,
        createAdmin
    );

router
    .route("/")
    .get(jwtDecode, verifyRole(["superadmin", "admin"]), getAllAdmins);

router
    .route("/:id")
    .get(jwtDecode, verifyRole(["superadmin", "admin"]), getAdmin)
    .put(jwtDecode, verifyRole(["superadmin"]), updateAdmin)
    .delete(jwtDecode, verifyRole(["superadmin"]), deleteAdmin);

export default router;
