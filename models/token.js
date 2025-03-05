import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // Token expires after 1 hour
    },
    used: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model("Token", tokenSchema);