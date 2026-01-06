import React from 'react'
import { useChatStore } from '../store/useChatStore'

function ActiveTabSwitch() {
  const {activeTab,setActiveTab}=useChatStore()
  return (
    <div className='tabs tabs-boxed bg-transparent p-2 m-2'>
     <button onClick={()=>setActiveTab("chats")
     }
     className={`tab ${activeTab==="chats"? "bg-blue-500 text-black":"text-black"}`}
     >Chats</button>
     <button onClick={()=>setActiveTab("contacts")}
     className= {`tab ${activeTab==="contacts"? "bg-blue-500 text-black":"text-black"}`}>Contacts</button>
    </div>
  )
}

export default ActiveTabSwitch