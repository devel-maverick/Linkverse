import React, { useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect } from 'react'
import NoChatHistory from "./NoChatHistory"
import MessagesLoadingContainer from './MessagesLoadingContainer'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
function ChatContainer() {
  const {selectedUser,getMessagesByUserId,messages,isMessagesLoading,subscribeToMessage,unsubscribeFromMessages}=useChatStore()
  const {authUser}=useAuthStore()
  const messageEndRef=useRef(null)
  useEffect(()=>{
    getMessagesByUserId(selectedUser._id)
    subscribeToMessage()
    return ()=>unsubscribeFromMessages()
  },[selectedUser,getMessagesByUserId,unsubscribeFromMessages,subscribeToMessage])
  useEffect(()=>{
    if (messageEndRef.current){
      messageEndRef.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])


  return (
    <>
    <ChatHeader/>
    <div className='flex-1 px-6 overflow-y-auto py-8'>
      {messages.length>0 && !isMessagesLoading?(
       <div className='max-w-3xl mx-auto space-y-6'>
        {messages.map(msg=>(
          <div key={msg._id} className={`chat ${msg.senderId===authUser._id?"chat-end":"chat-start"}`}>
            <div className={`chat-bubble relative ${
              msg.senderId===authUser._id? "bg-blue-500 text-white":"bg-cyan-500/10 text-black"
            }`}>

              {msg.image && (<img src={msg.image} alt="shared" className='rounded-lg h-48 object cover'/>)}
              {msg.text && <p className='mt-2'>{msg.text}</p>}
              <p className='text-xs mt-1 opacity--75 flex items-center gap-1'>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>

            </div>

          </div>
        ))}
        <div  ref={messageEndRef} />

       </div>
      ):

      
      isMessagesLoading?<MessagesLoadingContainer/>:(<NoChatHistory name={selectedUser.fullName}/> )}

    </div>
    <MessageInput/>
    </>
  )
}

export default ChatContainer