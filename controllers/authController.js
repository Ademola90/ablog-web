import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/email.js";
import { createToken, verifyToken } from "../utils/token.js";
import { User } from "../models/user.js";

// Signup a new user
export const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({ message: "User already exists." });
        }

        console.log("Password before hashing:", password); // Debugging

        // Create a new user (let the schema handle password hashing)
        const newUser = new User({ firstName, lastName, email, password });

        // Save the user
        await newUser.save();

        console.log("User saved successfully. Generating OTP...");

        // Generate and save an OTP
        const tokenResponse = await createToken(newUser._id, "verifyEmail", 1);
        if (!tokenResponse.status) {
            console.error("Error generating OTP:", tokenResponse.message);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error generating OTP." });
        }

        console.log("OTP generated successfully. Sending email...");

        // Send the OTP via email
        const emailResponse = await sendOTPEmail(email, tokenResponse.data);
        if (!emailResponse.status) {
            console.error("Error sending OTP email:", emailResponse.message);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error sending OTP email." });
        }

        console.log("OTP email sent successfully.");

        return res.status(StatusCodes.CREATED).json({ message: "Signup successful. Please verify your email." });
    } catch (error) {
        console.error("Signup failed:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Signup failed.", error: error.message });
    }
};




// Verify OTP
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Verify the OTP
        const tokenResponse = await verifyToken(otp, email, "verifyEmail");

        if (!tokenResponse.status) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: tokenResponse.message });
        }

        // Mark the user as verified
        const user = tokenResponse.data;
        user.isVerified = true;
        await user.save();

        res.status(StatusCodes.OK).json({ message: "Email verified successfully." });
    } catch (error) {
        console.error("OTP verification failed:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "OTP verification failed.", error: error.message });
    }
};

// Resend OTP
export const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found." });
        }

        // Generate and send a new OTP
        const tokenResponse = await createToken(user._id, "verifyEmail", 1);
        if (tokenResponse.status) {
            await sendOTPEmail(email, tokenResponse.data);
            return res.status(StatusCodes.OK).json({ message: "OTP resent successfully." });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error generating OTP." });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to resend OTP.", error: error.message });
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.error("User not found for email:", email);
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials." });
        }

        console.log("User found:", user);

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isPasswordValid);

        if (!isPasswordValid) {
            console.error("Invalid password for email:", email);
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials." });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Please verify your email first." });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(StatusCodes.OK).json({ message: "Login successful.", token });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Login failed.", error: error.message });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found." });
        }

        // Generate and send a password reset OTP
        const tokenResponse = await createToken(user._id, "resetPassword", 1);
        if (tokenResponse.status) {
            await sendOTPEmail(email, tokenResponse.data);
            return res.status(StatusCodes.OK).json({ message: "Password reset OTP sent." });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error generating OTP." });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to send OTP.", error: error.message });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Verify the OTP
        const tokenResponse = await verifyToken(otp, email, "resetPassword");
        if (!tokenResponse.status) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: tokenResponse.message });
        }

        // Update the user's password
        const user = tokenResponse.data;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Delete the OTP token
        await Token.deleteOne({ token: otp, type: "resetPassword" });

        res.status(StatusCodes.OK).json({
            message: "Password reset successfully. You can now log in with the new password.",
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Failed to reset password",
            error: error.message,
        });
    }
};