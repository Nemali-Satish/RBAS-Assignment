import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.route.js"
import userRoutes from './routes/user.route.js';
import courseRoutes from './routes/course.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

connectDB();

const allowedOrigins = [
    "http://localhost:5174",
    "https://rbas-system.onrender.com",
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
    },
    credentials: true
}));


app.use(express.json());


//Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

app.listen(PORT, () => {
    console.log(`🖨️ --Server is running on port ${PORT}`);
})