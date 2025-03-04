import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import router from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
