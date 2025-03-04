import jwt from "jsonwebtoken";
import { sendError } from "./response";
// import { sendError } from "../utils/response.js";

export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role }, // Ensure `_id` and `role` are part of the user object
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};


export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Assuming token is sent as Bearer <token>

    if (!token) {
        return sendError(res, 401, "Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token payload to `req.user`
        next();
    } catch (error) {
        sendError(res, 403, "Invalid or expired token.");
    }
};