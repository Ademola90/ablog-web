import User from "../models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { sendEmail } from "../utils/email.js";
import { generateOTP, saveOTP, validateOTP } from "../utils/otp.js";
import { sendError, sendResponse } from "../utils/response.js";

// 1. Signup
export const signup = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return sendError(res, 400, "Email, password, and role are required");
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return sendError(res, 400, "Email already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
        });

        const token = generateToken(newUser);

        sendResponse(res, 201, "Signup successful", { token });
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};

// 2. Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, 400, "Email and password are required");
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return sendError(res, 401, "Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendError(res, 401, "Invalid credentials");
        }

        const token = generateToken(user);

        sendResponse(res, 200, "Login successful", { token });
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};

// 3. Send OTP
export const sendVerificationOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return sendError(res, 400, "Email is required");
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return sendError(res, 404, "User not found");
        }

        const otp = generateOTP();
        await saveOTP(email, otp);

        await sendEmail(email, "Verification OTP", `Your OTP is: ${otp}`);

        sendResponse(res, 200, "OTP sent successfully");
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};

// 4. Verify OTP
export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return sendError(res, 400, "Email and OTP are required");
        }

        const isValid = await validateOTP(email, otp);
        if (!isValid) {
            return sendError(res, 400, "Invalid or expired OTP");
        }

        await User.findOneAndUpdate({ email: email.toLowerCase() }, { isVerified: true });

        sendResponse(res, 200, "Email verified successfully");
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};

// 5. Resend OTP
export const resendVerificationOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return sendError(res, 400, "Email is required");
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return sendError(res, 404, "User not found");
        }

        const otp = generateOTP();
        await saveOTP(email, otp);

        await sendEmail(email, "Verification OTP", `Your new OTP is: ${otp}`);

        sendResponse(res, 200, "OTP resent successfully");
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};

// 6. Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return sendError(res, 404, "User not found");
        }

        sendResponse(res, 200, "User deleted successfully");
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};

// 7. Update User
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) {
            return sendError(res, 404, "User not found");
        }

        sendResponse(res, 200, "User updated successfully", updatedUser);
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};

// 8. Get Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        sendResponse(res, 200, "Users retrieved successfully", users);
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return sendError(res, 404, "User not found");
        }

        sendResponse(res, 200, "User retrieved successfully", user);
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};


export const authLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return sendError(res, 404, "User not found");
        }

        // Validate the password (use bcrypt if hashed passwords are implemented)
        const isPasswordValid = await user.comparePassword(password); // Assuming you have this method in your model
        if (!isPasswordValid) {
            return sendError(res, 401, "Invalid credentials");
        }

        // Generate token
        const token = generateToken(user);

        sendResponse(res, 200, "Login successful", { token });
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};