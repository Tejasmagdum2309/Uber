import User from "../models/user.model.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blackListToken.js";
import Captain from "../models/captain.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        console.log("before auth token : - " , req.cookies.token , " - " , req.headers.authorization);
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false,message: "Unauthorized" });
        }

        const isBlackListed = await BlacklistToken.findOne({ token });

        if (isBlackListed) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
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

const authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
     
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await BlacklistToken.findOne({ token: token });

    console.log(isBlacklisted);

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded =  jwt.verify(token, process.env.JWT_SECRET_KEY);
        const captain = await Captain.findById(decoded._id)
        req.captain = captain;

       next() ;
    } catch (err) {
        console.log(err);

        res.status(401).json({ message: 'Unauthorized' });
    }
}

export { authMiddleware , authCaptain }