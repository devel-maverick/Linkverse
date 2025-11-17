import prisma from "../lib/db.js"
import cloudinary from '../lib/cloudinary.js';
import { getRecieverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";
export const getAllContacts =async (req, res) => {
   try{
    const loggedinUserId=req.user.id;
    const filteredUsers=await prisma.user.findMany({
        where:{
            id:{not:loggedinUserId}
        },
        omit: { password: true }
    })
    res.status(200).json(filteredUsers)

   }catch(err){
    console.log('err in getAllContacts:',err)
    res.status(500).json({message:'Server Error'})

   } 

}
export const getMessagesbyUserId=async (req,res)=>{
    try{
        const myId=req.user.id;
        const userToChatId=Number(req.params.id)
        const messages=await prisma.message.findMany({
            where:{
                OR:[
                    {senderId:myId,receiverId:userToChatId},
                    {senderId:userToChatId,receiverId:myId}
                ]
    }})
        res.status(200).json(messages)
    }catch(err){
       console.log('err in getMessagesbyUserId:',err)
         res.status(500).json({message:'Server Error'})
    }
}
export const sendMessage=async (req,res)=>{
    try{
        const {text,image}=req.body;
        const senderId=Number(req.user.id);
        const receiverId = Number(req.params.id);
            //  If no text and no image
            if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
            }

            //  Cannot message yourself
            if (senderId === receiverId) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
            }

            //  Check if receiver exists in Prisma
        const receiverExists = await prisma.user.findUnique({
            where: { id: receiverId }
            });

            if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
            }

        let imageUrl;
        if(image){
            const uploaded=await cloudinary.uploader.upload(image)
            imageUrl=uploaded.secure_url
        }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
        image: imageUrl
      }
    });
        // todo: send message in real time if user is online using sockets
        const receiverSocketId=getRecieverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.status(201).json(newMessage)


    }catch(err){
         console.error("SEND MESSAGE ERROR:", err);
  res.status(500).json({ message: "Error sending message", error: err.message });
    }
}
export const getChatPartners=async (req,res)=>{
    try{
        const loggedinUserId=Number(req.user.id);
        const messages=await prisma.message.findMany({
            where:{
                OR:[
                    {senderId:loggedinUserId},
                    {receiverId:loggedinUserId}]
                }})
        const chatPartnerIds=[
            ...new Set(messages.map(msq=>msq.senderId===loggedinUserId?msq.receiverId:msq.senderId))]
                const chatPartners = await prisma.user.findMany({
                where: { id: { in: chatPartnerIds } },
                omit: { password: true }
                });
        res.status(200).json(chatPartners)
    }catch(err){
        console.log('err in getChatPartners:',err)
        res.status(500).json({message:'Server Error'})
    }
}