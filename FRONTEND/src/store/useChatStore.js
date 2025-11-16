import {create} from 'zustand'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
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
}))