import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import router from "./routes/index.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Start the server only after the database connection is established
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Routes
        app.use("/api/v1", router);

        // Error Handling Middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ success: false, message: "Something went wrong!" });
        });

        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.error("Failed to start the server:", error.message);
        process.exit(1); // Exit the process if the database connection fails
    }
};

// Start the server
startServer();