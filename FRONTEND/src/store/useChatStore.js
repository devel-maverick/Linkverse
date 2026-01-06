import {create} from 'zustand'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore=create((set,get)=>({
    allContacts:[],
    chats:[],
    messages:[],
    activeTab:"chat",
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled"))===true
    ,
    toggleSound:()=>{
        const newSoundState = !get().isSoundEnabled;
        localStorage.setItem("isSoundEnabbled",!get().isSoundEnabled)
        set({isSoundEnabled:newSoundState})
    },
    setActiveTab:(tab)=>{
        set({activeTab:tab})
    },
    setSelectedUser:(selectedUser)=>{
        set({selectedUser})
    },
    getAllContacts:async()=>{
        set({isUsersLoading:true})
        try{
            const res=await axiosInstance.get("/messages/contacts")
            set({allContacts:res.data})

        }
        catch(err){
            toast.error(error.response.data.message)

        }finally{
            set({isUsersLoading:false})
        }







    },
    getMyChatPartners:async()=>{
        set({isUsersLoading:true})
        try{
            const res=await axiosInstance.get("/messages/chats")
            set({chats:res.data})
        }
        catch(err){
            toast.error(error.response.data.message)

        }finally{
            set({isUsersLoading:false})
        }



    },
    getMessagesByUserId:async(userId)=>{
        set({isMessagesLoading:true})
        try{
            const res=await axiosInstance.get(`/messages/${userId}`)
            set({messages:res.data})
        }catch(err){
            toast.error(error.response?.data?.message|| "something went wrong")

        }finally{
            set({isMessagesLoading:false})

        }
        
    },
    sendMessage:async(messageData)=>{
        const {selectedUser,messages}=get()
        const {authUser} =useAuthStore.getState()
        // const tempId=`temp-${Date.now()}`
        const optimisticMessage={
            senderId:authUser._id,
            recieverId:selectedUser._id,
            text:messageData.text,
            image:messageData.image,
            createdAt:new Date().toISOString(),
            isOptimistic:true

        };
        set({ messages: [...messages, optimisticMessage] });
        try{
            const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
            set({messages:messages.concat(res.data)})
        }catch(err){
            set({messages:messages})
            toast.error(error.response?.data?.message || "something went wrong")

        }
    },
    subscribeToMessage:()=>{
        const {selectedUser,isSoundEnabled}=get()
        if (!selectedUser) return;
        const socket=useAuthStore.getState().socket;
        socket.on("newMessage",(newMessage)=>{
            const isMessageSentFromSelectedUser=newMessage.senderId===selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;
            const currentMessages=get().messages
            set({messages:[...currentMessages,newMessage]})
            if(isSoundEnabled){
                const notificationSound = new Audio("/sounds/notification.mp3");
                notificationSound.currentTime=0
                notificationSound.play().catch((e)=>console.log("Audio Failed:",e))
            }
        })

    },
    unsubscribeFromMessages:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage")

    }


}))