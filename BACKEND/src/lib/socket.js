import {Server} from 'socket.io'
import http from 'http'
import express from 'express'
import { ENV } from './env.js'
import { socketAuthMiddleware } from '../middleware/socket.auth.middleware.js'

const app=express()
const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:[ENV.CLIENT_URL],
        credentials:true,
    }
})
io.use(socketAuthMiddleware)

// to check if user is online or not

export function getRecieverSocketId(userId){
    return userSocketMap[userId]
}
//for storing online users
const userSocketMap={}
 io.on("connection",(socket)=>{
    console.log("user connected",socket.user.fullName)
    const userId=socket.userId
    userSocketMap[userId]=socket.id
    //to send to very users
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    //removing from object
    socket.on("disconnect",()=>{
        console.log("user disconnect",socket.user.fullName)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
 })

 export {io,app,server}