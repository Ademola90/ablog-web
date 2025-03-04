import { generateToken } from "../utils/token.js";

export const createSuperadmin = async (req, res) => {
    try {
        const existingSuperadmin = await User.findOne({ role: "superadmin" });

        if (existingSuperadmin) {
            return sendError(res, 400, "Superadmin already exists");
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, 400, "Email and password are required");
        }

        const superadmin = await User.create({
            email: email.toLowerCase(),
            password,
            role: "superadmin",
        });

        // Generate token
        const token = generateToken(superadmin);

        sendResponse(res, 201, "Superadmin created successfully", {
            id: superadmin._id,
            email: superadmin.email,
            role: superadmin.role,
            token,
        });
    } catch (error) {
        sendError(res, 500, "Internal Server Error");
    }
};
