import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    data: { type: Object, default: null },
});

export default mongoose.model("Token", tokenSchema);
