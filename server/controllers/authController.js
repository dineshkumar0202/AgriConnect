import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) =>{
    try{
        const {username, email, password, role, phone} = req.body;
        const hashed = await bcrypt.hash(password, 8);
        const user = await User.create({username, email, password: hashed, role, phone});
        res.json({success: true, userId: user._id});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

export const login = async (req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({error: "Invalid credentials"});

        const valid = await bcrypt.compare(password, user.password);
        if(!valid) return res.status(400).json({error: 'Invalid credentials'});

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
        res.json({token, user:{id: user._id, username: user,username, role: user.role}});

    }catch(err){
        res.status(500).json({error: err.message});
    }
};
