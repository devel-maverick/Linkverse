import prisma from "../lib/db.js"
import cloudinary from '../lib/cloudinary.js';
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
        let imageUrl;
        if(image){
            const uploaded=await cloudinary.uploader.upload(image)
            imageUrl=uploaded.secure_url
        }
    // ⏱ DB WRITE TEST STARTS HERE
    console.time("createMessage");

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
        image: imageUrl
      }
    });

    console.timeEnd("createMessage");
        // todo: send message in real time if user is online using sockets
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