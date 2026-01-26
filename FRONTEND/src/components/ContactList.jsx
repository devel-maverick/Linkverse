import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import UsersLoading from './UsersLoading'
import { useAuthStore } from '../store/useAuthStore'
function ContactList() {
  const { isUserLoading, allContacts, setSelectedUser, getAllContacts } = useChatStore()
  const { onlineUsers } = useAuthStore()
  useEffect(() => { getAllContacts() }, [getAllContacts])
  if (isUserLoading) return <UsersLoading />

  return (
    <>
      {allContacts.map((contact) => (
        <div key={contact.id}
          className='p-3 flex items-center gap-3 cursor-pointer hover:bg-base-300 transition-colors border-b border-base-content/20 last:border-0'
          onClick={() => setSelectedUser(contact)}>
          <div className={`avatar ${onlineUsers.includes(String(contact.id)) ? "online" : "offline"}`}>
            <div className="size-12 rounded-full border border-base-content/10">
              <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base-content font-medium truncate text-[17px]">{contact.fullName}</h4>
            <p className="text-base-content/60 text-sm truncate">Click to start chatting</p>
          </div>
        </div>
      ))}</>
  )
}

export default ContactList