import jwt from 'jsonwebtoken';
import {ENV} from './env.js';

export const generateToken=(userId,res)=>{
    const {JWT_SECRET}=ENV;
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token=jwt.sign({userId},JWT_SECRET,{
        expiresIn:'7d'
    });
    res.cookie('jwt',token,{
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite:ENV.NODE_ENV=="development" ?"None":"Strict",
    secure: true ,
    path: "/"
    })
    return token;
}