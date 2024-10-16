import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';


dotenv.config(); // we are not passing path becoz we have made ".env" just inside the backend folder.

mongoose.connect(process.env.CONN_STR)
.then(()=>{
    console.log("successfully conencted to mongoDB");
})
.catch((err)=>{
    console.log(err);
});

const app = express();

const _dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://notemaking-frontend.vercel.app', // Frontend URL
    credentials: true, // Allow credentials like cookies
}));

import authRouter from './routes/auth.route.js';
import noteRouter from './routes/note.route.js';

app.use("/api/auth",authRouter);
app.use("/api/note",noteRouter);

app.use(express.static(path.join(_dirname,"/frontend/dist")));
app.get('*',(_,res)=>{
    res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"));
})

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("server is running on port 3000");
});

// error handling : global error handling.
app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    return res.status(statusCode).json({
        success : "failed",
        statusCode, 
        message,
    });
});
