import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import { createUser } from "../services/user.services.js";

const registerUser = async (req , res) => {
    
    try {
        
        console.log(req.body);

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }

        const {email,password,firstName} = req.body;

        if(!email || !password || !firstName){
            throw new Error("All fields are required");
        }
        
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({message : "User already exists"});
        }
        
        const hashPassword = await User.hashPassword(password);
        
        user = await createUser({firstName , email , password : hashPassword});
        console.log('new created user : ' , user);
        // const token = await user.generateAuthToken();
        
        // if(!token){
        //     throw new Error("Token not generated");
        // }

        // console.log('token : ' , token);
        
        res.status(201).json({success : true ,message : "User created successfully "});
    }
    catch (error) {
        console.log("error in registerUser - " , error);
        return res.status(500).json({message : "Server error"});
    }
}       

const loginUser = async (req , res) => {
    
    try {
        const {email , password} = req.body;

        let user = await User.findOne({email}).select("+password");

        if(!user){
            return res.status(401).json({message : "Invalid Email or Password"});
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({message : "Invalid Email or Password"});
        }

        const token = await user.generateAuthToken();

        const cookieOptions = {
            httpOnly: true, // Prevent access via JavaScript
            // secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            sameSite: 'Strict', // Prevent CSRF
            // expires: new Date(Date.now() +  30 * 1000), // 30sec day from now on set cookise direct on browser get deleted

        };
    

        return res.status(200)
                  .cookie('token', token, cookieOptions)
                  .json({success : true, message : "Login successful "});
}
catch (error) {
    console.log("error in loginUser - " , error);
    return res.status(500).json({message : "Server error"});
}   

}

const userProfile = async (req , res) => {
    try {

        const user = await User.findById(req.user._id);
        console.log("user in profile : " , user);
        if(!user){
            return res.status(404).json({success : false , message : "User not found"});
        }
        return res.status(200).json({success : true , message : "User found" ,user});
    } catch (error) {
        console.log("error in userProfile - " , error);
        return res.status(500).json({message : "Server error"});
    }   
}

export { registerUser ,
         loginUser , 
         userProfile ,

};