import express from "express";
import {body} from 'express-validator'
const router = express.Router();
import { registerUser , loginUser , userProfile } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

router.post("/register" ,  [
    body("email").isEmail().withMessage("Invalid email"),
    body("firstName").isLength({ min: 3 }).withMessage("First name must be at least 3 characters"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
],
 registerUser );

router.post("/login" , [
     body("email").isEmail().withMessage("Invalid email"),
     body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
]  
,loginUser);

router.get("/profile" , authMiddleware ,userProfile);


export default router;