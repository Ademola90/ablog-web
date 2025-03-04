import Admin from "../models/admin.js";
import { sendError, sendResponse } from "../utils/response.js";
import { generateToken } from "../utils/token.js";

export const createAdmin = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return sendError(res, 400, "Email, password, and role are required");
        }

        const newAdmin = await Admin.create({
            email: email.toLowerCase(),
            password,
            role,
        });

        // Generate token
        const token = generateToken(newAdmin);

        sendResponse(res, 201, "Admin created successfully", {
            admin: newAdmin,
            token,
        });
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};

export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        sendResponse(res, 200, "Admins retrieved successfully", admins);
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};

export const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return sendError(res, 404, "Admin not found");
        }

        sendResponse(res, 200, "Admin retrieved successfully", admin);
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};

export const updateAdmin = async (req, res) => {
    try {
        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedAdmin) {
            return sendError(res, 404, "Admin not found");
        }

        sendResponse(res, 200, "Admin updated successfully", updatedAdmin);
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);

        if (!admin) {
            return sendError(res, 404, "Admin not found");
        }

        sendResponse(res, 200, "Admin deleted successfully", admin);
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};
