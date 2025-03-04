import rs from "randomstring";
import Token from "../models/token.js";

const generateToken = async (user) => {
    try {
        const options = { charset: "numeric", length: 6 };
        let token;

        do {
            token = rs.generate(options);
        } while (await Token.findOne({ token, user: user._id }));

        return token;
    } catch (error) {
        console.error("Error during generateToken:", error);
        return null;
    }
};

export const createToken = async (user, type, hours) => {
    try {
        const token = await generateToken(user);

        if (!token) {
            throw new Error("Failed to generate OTP");
        }

        await Token.deleteMany({ user: user._id, type });

        const newToken = await Token.create({
            user: user._id,
            type,
            token,
            expiresAt: Date.now() + hours * 60 * 60 * 1000,
        });

        return { status: true, message: "Token Created", data: token };
    } catch (error) {
        console.error("Error during createToken:", error);
        return { status: false, message: "Token creation failed" };
    }
};
