import { body } from "express-validator";

export const validateLogin = [
    body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Validation for Admin
 */
export const validateAdmin = [
    body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/\d/)
        .withMessage("Password must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password must contain at least one special character"),
    body("role")
        .isIn(["superadmin", "admin"])
        .withMessage("Role must be either 'superadmin' or 'admin'"),
];

/**
 * Validation for Creating Superadmin
 */
export const validateCreateSuperadmin = [
    body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/\d/)
        .withMessage("Password must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password must contain at least one special character"),
];
