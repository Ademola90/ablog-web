import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication token missing or incorrect format." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token expired." });
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token." });
    }
};

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Access Denied: Unauthorized Role." });
        }
        next();
    };
};