// import User from "../models/User.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const createAdmin = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Ensure only super admin can create admin accounts
        if (req.user.role !== "superadmin") {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Only super admin can create admin accounts." });
        }

        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({ message: "Email already in use." });
        }

        // Create the admin account (password will be hashed by the schema's pre-save middleware)
        const newAdmin = new User({
            firstName,
            lastName,
            email,
            password, // Pass the plain password here
            role: "admin",
            emailVerified: true,
            createdBy: req.user.userId, // Track who created this admin
        });

        await newAdmin.save(); // The middleware will hash the password here
        res.status(StatusCodes.CREATED).json({ message: "Admin account created successfully." });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error creating admin account.", error: error.message });
    }
};

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the admin by email and role
        const admin = await User.findOne({ email, role: "admin" });
        if (!admin) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Admin not found." });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials." });
        }

        // Generate a JWT token for the admin
        const token = jwt.sign(
            { userId: admin._id, role: admin.role }, // Payload
            process.env.JWT_SECRET, // Secret key
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