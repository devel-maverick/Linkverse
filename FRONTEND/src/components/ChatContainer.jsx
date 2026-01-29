import React, { useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect } from 'react'
import NoChatHistory from "./NoChatHistory"
import MessagesLoadingContainer from './MessagesLoadingContainer'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'

function ChatContainer() {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessage, unsubscribeFromMessages } = useChatStore()
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null)

  useEffect(() => {
    getMessagesByUserId(selectedUser.id)
    subscribeToMessage()
    return () => unsubscribeFromMessages()
  }, [selectedUser, getMessagesByUserId, unsubscribeFromMessages, subscribeToMessage])

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])


  return (
    <>
      <div className="z-10 bg-base-200 border-b border-base-content/20">
        <ChatHeader />
      </div>

      <div className='flex-1 px-4 overflow-y-auto py-4 custom-scrollbar z-10'>
        {messages.length > 0 && !isMessagesLoading ? (
          <div className='flex flex-col space-y-2 max-w-[95%] mx-auto'>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.senderId.toString() === authUser.id.toString() ? "justify-end" : "justify-start"}`}>
                <div className={`relative px-3 py-1.5 max-w-lg rounded-lg shadow-sm text-sm ${msg.senderId.toString() === authUser.id.toString()
                  ? "bg-primary text-primary-content rounded-tr-none border border-primary-content/20"
                  : "bg-base-200 text-base-content rounded-tl-none border border-base-content/10"
                  }`}>

                  {msg.image && (<img src={msg.image} alt="shared" className='rounded-md max-w-[300px] max-h-[300px] object-cover mb-1' />)}
                  {msg.text && <p className='mr-12 text-[14.2px] leading-relaxed'>{msg.text}</p>}

                  <span className='absolute bottom-1 right-2 text-[10px] text-base-content/70'>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </span>

                </div>

              </div>
            ))}
            <div ref={messageEndRef} />

          </div>
        ) :

          isMessagesLoading ? <MessagesLoadingContainer /> : (<NoChatHistory name={selectedUser.fullName} />)}

      </div>
      <div className='bg-base-200 p-3 z-10'>
        <MessageInput />
      </div>
    </>
  )
}

export default ChatContainer