// const Captain = require('../models/captain.model');
// const captainService = require('../services/captain.service');
// const BlacklistToken = require('../models/blackListToken.model');
// const { validationResult } = require('express-validator');

import Captain from "../models/captain.model.js";
import  BlacklistToken from "../models/blackListToken.js";
import { buildCheckFunction, validationResult } from "express-validator";
import createCaptain from "../services/captian.services.js";
import jwt from 'jsonwebtoken';

const registerCaptain = async (req, res) => {
    
    try {
        console.log(req.body);
          const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await Captain.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await Captain.hashPassword(password);

    await createCaptain({
        firstName: firstName,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });
    
    res.status(201).json({ message: 'Captain registered successfully', success: true });
    } catch (error) {
        console.log("error in registerCaptain - " , error);
        return res.status(500).json({ message: 'Internal server error' });
    }
  
}
const loginCaptain = async (req, res) => {
    try {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await Captain.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = await captain.generateAuthToken();

    const cookieOptions = {
        httpOnly: true, // Prevent access via JavaScript
        // secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'Strict', // Prevent CSRF
        // expires: new Date(Date.now() +  30 * 1000), // 30sec day from now on set cookise direct on browser get deleted

    };


    return res.status(200)
    .cookie('token', token, cookieOptions)
    .json({success : true, message : "Login successful "});}
    catch (error) {
        console.log("error in loginCaptain - " , error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getCaptainProfile = async (req, res) => {
    

    res.status(200).json({ captain: req.captain });
}

const logoutCaptain = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    let decode = jwt.decode(token);

    // Calculate the remaining time (in seconds)
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const remainingTTL = decode.exp - now;

    console.log('remainingTTL -->' , remainingTTL);

    await BlacklistToken.create({ token , createdAt: new Date(Date.now() + remainingTTL * 1000), // Adjust `createdAt` to match the remaining time
    });

    await BlacklistToken.create({ token: 'example-token3' });
    
    // const tokens = await BlacklistToken.find();
    // console.log("tokens : ",tokens);

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}

export {
    registerCaptain,
    loginCaptain,
    getCaptainProfile,
    logoutCaptain
}