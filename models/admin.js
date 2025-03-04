import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["superadmin", "admin"],
            default: "admin",
        },
    },
    { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
