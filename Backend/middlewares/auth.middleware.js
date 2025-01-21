import User from "../models/user.model.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        console.log("before auth token : - " , req.cookies.token , " - " , req.headers.authorization);
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false,message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        console.log("decoded : " , decoded);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch (error) {    
        console.log("error in authMiddleware - " , error);
            return res.status(401).json({ success: false, message: "Unauthorized" });
    }

}

export default authMiddleware