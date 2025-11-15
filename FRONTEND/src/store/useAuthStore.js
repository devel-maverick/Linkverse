import { create } from "zustand";
export const useAuthStore = create((set)=>({

    authUser:{name:"John Doe",id:1,age:25},
    isloading:false,
    login:()=>{
        console.log("login")
        set({isloading:true});
    }
}))
