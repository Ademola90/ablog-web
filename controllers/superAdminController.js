import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { createToken, verifyToken } from "../utils/token.js";
import jwt from "jsonwebtoken"; // Import JWT library

export const createSuperadmin = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingSuperAdmin = await User.findOne({ role: "superadmin" });
        if (existingSuperAdmin) {
            return res.status(StatusCodes.CONFLICT).json({ message: "Super admin already exists." });
        }

        const newSuperAdmin = new User({
            firstName,
            lastName,
            email,
            password, // Pass the plain password here
            role: "superadmin",
            emailVerified: true,
        });

        await newSuperAdmin.save(); // The middleware will hash the password here
        res.status(StatusCodes.CREATED).json({ message: "Super admin created successfully." });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error creating super admin.", error: error.message });
    }
};

export const loginSuperadmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the super admin by email and role
        const superAdmin = await User.findOne({ email, role: "superadmin" });
        if (!superAdmin) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Super admin not found." });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials." });
        }

        // Generate a JWT token for the super admin
        const token = jwt.sign(
            { userId: superAdmin._id, role: superAdmin.role }, // Payload
            process.env.JWT_SECRET, // Secret key (store this in environment variables)
            { expiresIn: "1h" } // Token expiry time
        );

        // Return the token in the response
        res.status(StatusCodes.OK).json({
            message: "Login successful.",
            token: token, // This is the JWT token
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error during login.", error: error.message });
    }
};

export const verifySuperadminLogin = async (req, res) => {
    const { email, token } = req.body;

    try {
        // Verify the token (OTP)
        const verificationResponse = await verifyToken(token, email, "login");
        if (!verificationResponse.status) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: verificationResponse.message });
        }

        // If the token is valid, return a success response
        res.status(StatusCodes.OK).json({
            message: "OTP verified successfully.",
            user: verificationResponse.data,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error verifying OTP.", error: error.message });
    }
};