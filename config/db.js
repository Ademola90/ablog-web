import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
};


// import mongose from "mongoose";

// export const connectDB = async () => {
//     try {
//         await mongose.connect(process.env.MONGO_DB_URI);
//         console.log("MongoDB connected successfully");
//     } catch (error) {
//         console.log("Error connecting to MongoDB", error);
//         process.exit(1);
//     }
// };
