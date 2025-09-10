import mongoose from "mongoose";

const connectDB = async () => {
    const { MONGO_URI } = process.env;

    if (!MONGO_URI) {
        console.error("Error: MONGO_URI not set in environment variables");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};

export default connectDB;
