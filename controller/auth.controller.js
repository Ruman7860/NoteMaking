import User from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// SIGNUP
export const signup = async (req,res,next) => {
    const {username,email,password} = req.body;

    const isValidUser = await User.findOne({email});

    if(isValidUser){
        return next(errorHandler(400,"User already exist"));
    }

    const hashPassword = bcrypt.hashSync(password,10);


    const newUser = new User({
        username,
        email,
        password : hashPassword,
    });

    try {
        await newUser.save();
        res.status(201).json({
            status : "Success",
            message : "User created successfully"
        })
    } catch (error) {
        next(error);
    }
}

// SIGNIN
export const signin = async (req,res,next) => {
    const {email,password} = req.body;

    try{
        const validUser = await User.findOne({email});
    
        if(!validUser){
            next(errorHandler("404","User not found"));
        }

        const validPassword = bcrypt.compareSync(password,validUser.password);

        if(!validPassword){
            return next(errorHandler("401","Wrong Credentials"));
        }

        const token = jwt.sign({id : validUser._id} , process.env.JWT_SECRET);

        // console.log(validUser._doc);

        const {password: pass, ...data} = validUser._doc;

        res.cookie("access_token",token,{httpOnly : true}).status(200).json({
            success : true,
            message : "Login successfully",
            data,
        })
    }
    catch(err){
        next(err);
    }
}

// SIGNOUT
export const signout = async (req,res,next) => {
    try {
        res.clearCookie("access_token");
        res.status(200).json({
            success : true,
            message : "User signout successfully"
        })
    } catch (error) {
        next(error);
    }
}