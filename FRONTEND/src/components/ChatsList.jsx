import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import UsersLoading from './UsersLoading'
import NoChatsFound from './NoChatsFound'
import { useAuthStore } from '../store/useAuthStore'
function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore()
  const { onlineUsers } = useAuthStore()
  useEffect(() => { getMyChatPartners() }, [getMyChatPartners])

  if (isUsersLoading) return <UsersLoading />
  if (chats.length === 0) return <NoChatsFound />
  return (
    <>
      {chats.map((chat) => (
        <div key={chat.id}
          className='p-3 flex items-center gap-3 cursor-pointer hover:bg-base-300 transition-colors border-b border-base-content/20 last:border-0'
          onClick={() => setSelectedUser(chat)}>
          <div className={`avatar ${onlineUsers.includes(String(chat.id)) ? "online" : "offline"}`}>
            <div className="size-12 rounded-full border border-base-content/10">
              <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className='flex justify-between items-baseline'>
              <h4 className="text-base-content font-medium truncate text-[17px]">{chat.fullName}</h4>
              {chat.lastMessage && (
                <span className={`text-xs ${chat.unreadCount > 0 ? "text-primary font-medium" : "text-base-content/50"}`}>
                  {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              )}
            </div>
            <div className='flex justify-between items-center'>
              <p className="text-base-content/60 text-sm truncate max-w-[85%]">
                {chat.lastMessage?.text
                  ? (chat.lastMessage.text.length > 30
                    ? chat.lastMessage.text.substring(0, 30) + '...'
                    : chat.lastMessage.text)
                  : "Click to start chatting"}
              </p>
              {chat.unreadCount > 0 && (
                <div className='bg-primary text-primary-content text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse'>
                  {chat.unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default ChatsList