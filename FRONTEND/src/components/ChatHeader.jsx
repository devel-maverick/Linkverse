import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { XIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'

function ChatHeader() {
    const { selectedUser, setSelectedUser } = useChatStore()
    const { onlineUsers } = useAuthStore()
    const isOnline = onlineUsers.includes(String(selectedUser.id))
    return (
        <div className='flex justify-between items-center bg-base-200 border-b border-base-content/20 px-6 py-3 flex-1'>
            <div className='flex items-center space-x-3'>
                <div className={`avatar ${isOnline ? "online" : "offline"}`}>
                    <div className='w-10 h-10 rounded-full border border-base-content/10'>
                        <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullname} />
                    </div>
                </div>
                <div>
                    <h3 className='text-base-content font-medium'>
                        {selectedUser.fullName}
                    </h3>
                    <p className='text-base-content/60 text-xs'>
                        {isOnline ? "Online" : "Offline"}
                    </p>

                </div>
            </div>
            <button onClick={() => setSelectedUser(null)}>
                <XIcon className='w-5 h-5 text-base-content/60 hover:text-base-content transition-colors cursor-pointer' />
            </button>
        </div>
    )
}

export default ChatHeader