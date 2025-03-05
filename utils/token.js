import rs from "randomstring";
import Token from "../models/token.js"; // Import the Token model
import { User } from "../models/user.js"; // Import the User model

// Generate a unique OTP
const generateToken = async (user) => {
    try {
        const options = { charset: "numeric", length: 6 };
        let token;

        do {
            token = rs.generate(options);
        } while (await Token.findOne({ token, userId: user._id })); // Use userId instead of user

        return token;
    } catch (error) {
        console.error("Error during generateToken:", error);
        return null;
    }
};

// Create a new token (OTP)
export const createToken = async (userId, type, hours) => {
    try {
        const token = await generateToken({ _id: userId }); // Pass userId directly

        if (!token) {
            throw new Error("Failed to generate OTP");
        }

        // Delete existing tokens for the user and type
        await Token.deleteMany({ userId, type });

        // Create a new token
        const newToken = await Token.create({
            userId,
            type,
            token,
            expiresAt: Date.now() + hours * 60 * 60 * 1000, // Set expiry time
        });

        return { status: true, message: "Token Created", data: token };
    } catch (error) {
        console.error("Error during createToken:", error);
        return { status: false, message: "Token creation failed" };
    }
};

// Verify a token (OTP)
export const verifyToken = async (token, email, type) => {
    try {
        console.log("Verifying token for email:", email);

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.error("User not found for email:", email);
            return { status: false, message: "User not found.", data: null };
        }

        console.log("User found:", user);

        // Find the token for the user
        const foundToken = await Token.findOne({ userId: user._id, token, type });
        if (!foundToken) {
            console.error("Invalid token:", token);
            return { status: false, message: "Invalid token.", data: null };
        }

        // Check if the token has expired
        if (Date.now() > new Date(foundToken.expiresAt).getTime()) {
            console.error("Token expired:", foundToken.expiresAt);
            await Token.deleteOne({ _id: foundToken._id });
            return { status: false, message: "Token expired.", data: null };
        }

        // Mark the token as used
        foundToken.used = true;
        await foundToken.save();

        console.log("Token verified successfully:", foundToken);

        // Delete all tokens of this type for the user
        await Token.deleteMany({ userId: user._id, type });

        return { status: true, message: "Token verified.", data: user };
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return { status: false, message: error.message, data: null };
    }
};


// export const verifyToken = async (token, email, type) => {
//     try {
//         console.log("Verifying token for email:", email);

//         // Find the user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             console.error("User not found for email:", email);
//             return { status: false, message: "User not found.", data: null };
//         }

//         console.log("User found:", user);

//         // Find the token for the user
//         const foundToken = await Token.findOne({ userId: user._id, token, type });
//         if (!foundToken) {
//             console.error("Invalid token:", token);
//             return { status: false, message: "Invalid token.", data: null };
//         }

//         // Check if the token has expired
//         if (Date.now() > new Date(foundToken.expiresAt).getTime()) {
//             console.error("Token expired:", foundToken.expiresAt);
//             await Token.deleteOne({ _id: foundToken._id });
//             return { status: false, message: "Token expired.", data: null };
//         }

//         console.log("Token verified successfully:", foundToken);

//         // Delete all tokens of this type for the user
//         await Token.deleteMany({ userId: user._id, type });

//         return { status: true, message: "Token verified.", data: user };
//     } catch (error) {
//         console.error("Error verifying token:", error.message);
//         return { status: false, message: error.message, data: null };
//     }
// };