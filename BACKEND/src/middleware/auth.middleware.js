import jwt from 'jsonwebtoken';
import prisma from '../lib/db.js';
import { ENV } from '../lib/env.js';
export const protectRoute = async(req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if (!token){
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: 'Not authorized, invalid token' });
        }
        const user = await prisma.user.findUnique(
            { where:
             { id: decoded.userId } 
            });
        if (!user){
            return res.status(401).json({ message: 'user not found' });
        }
        req.user=user
        next()


    }catch(err){
        console.log('err in protectRoute middleware:',err)
        return res.status(401).json({ message: 'Internal server error' });
    }
}