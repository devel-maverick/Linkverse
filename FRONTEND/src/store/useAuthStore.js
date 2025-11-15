import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
export const useAuthStore = create((set)=>({
    authUser:null,
    isCheckingAuth:true,
    isSigningUp:false,
    isLoggingIn:false,
    checkAuth: async()=>{
        try{
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data});
        }catch(err){
            set({authUser:null});

        }
        finally{
            set({isCheckingAuth:false});
        }
    },

    signup:async(data)=>{
        set({isSigningUp:true})
        try{
        const res=await axiosInstance.post("/auth/signup",data)
        set({authUser:res.data})
        toast.success("Account created successfully!")
        }catch(err){
            toast.error(err.response.data.message)
        }
        finally{
            set({isSigningUp:false})
        }
    },
    login:async(data)=>{
        set({isLoggingIn:true})
        try{
        const res=await axiosInstance.post("/auth/login",data)
        set({authUser:res.data})
        toast.success("Logged in successfully")
        }catch(err){
            toast.error(err.response.data.message)
        }
        finally{
            set({isLoggingIn:false})
        }
    },
    logout:async()=>{
        try{
        await axiosInstance.post("/auth/logout")
        set({authUser:null})
        toast.success("Logged Out successfully")
        }catch(err){
            toast.error(err.response.data.message)
        }
        finally{
            set({authUser:null})
        }

    }



}))
