// //middlewares/jwtDecode.js
// import jwt from "jsonwebtoken";
// import { sendResponse, sendError } from "../utils/response.js";
// import User from "../models/user.js";

// export const jwtDecode = async (req, res, next) => {
//     if (!req.headers.authorization) {
//         return sendError(res, 401, "Authorization header is required");
//     }

//     const [type, token] = req.headers.authorization.split(" ");
//     if (type !== "Bearer" || !token) {
//         return sendError(res, 400, "Invalid token type");
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);

//         if (!user) {
//             return sendError(res, 404, "User not found");
//         }

//         req.user = user; // Attach user info to the request
//         next();
//     } catch (error) {
//         sendError(res, 401, "Invalid token");
//     }
// };
