import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import captainRoutes from "./routes/captain.routes.js"

import bodyParser from "body-parser";

connectDB();

export const app = express();

// Using body-parser
app.use(bodyParser.json());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(cookieParser());


// app.get("/", (req, res) => {
//     res.send("Hello World!");
// })

app.use("/api/users" , userRoutes);
app.use("/api/captain",captainRoutes)
