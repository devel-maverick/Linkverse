import jwt from 'jsonwebtoken'
import { ENV } from '../lib/env.js'
import prisma from "../lib/db.js"
export const socketAuthMiddleware=async(socket,next)=>{
    try{
        const token=socket.handshake.headers.cookie
            ?.split("; ")
            .find((row)=>row.startsWith("jwt="))
            ?.split("=")[1];
        if(!token){
            console.log("socket connection reject no token")
            return next(new Error("unauthorized-no token"))
        }
        const decoded=jwt.verify(token,ENV.JWT_SECRET)
        if(!decoded){
            console.log("socket connection reject invalid token")
            return next(new Error("unauthorized invalid token"))
        }
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                profilePic: true,
            }
        });

        if (!user){
            console.log("socket connection reject no user found")
            return next(new Error("user not found"))
        }
        socket.user=user;
        socket.userId=user.id.toString()
        console.log(`socket authentication for user:${user.fullName}`)
        next()
    }catch(err){
        console.log("error in socket auth:",err.message)
        next(new Error("unauthorized-auth failed"))

    }
}