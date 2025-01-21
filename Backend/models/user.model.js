import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minlength : [3 , "First name must be at least 2 characters"]
        
    },
    email : {
        type : String,
        required : true,
        unique : true,
        minlength : [8 , "Email must be at least 8 characters"],

    },
    password : {
        type : String,
        required : true,
        select : false, // default we dont send password now 
    },
    socketId : {
        type : String,
    }
})

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET_KEY , { expiresIn: process.env.JWT_EXPIRES_IN });
        console.log(token);
        return token;
    } catch (error) {
        console.log("error in generateAuthToken - " , error);
    }
}

userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password , this.password);
    } catch (error) {
        console.log("error in comparePassword - " , error);
    }
}

userSchema.statics.hashPassword = async function (password) {
    try {
        let hash = await bcrypt.hash(password , 10);
        return hash;
    } catch (error) {
        console.log("error in hashPassword - " , error);
    }
}

const User = mongoose.model("User" , userSchema);

export default User;