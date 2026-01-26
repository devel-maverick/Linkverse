import React from 'react'
import { useChatStore } from '../store/useChatStore'
import ProfileHeader from "../components/ProfileHeader"
import ActiveTabSwitch from "../components/ActiveTabSwitch"
import ChatsList from "../components/ChatsList"
import ContactList from "../components/ContactList"
import ChatContainer from "../components/ChatContainer"
import NoConversation from "../components/NoConversation"

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore()

  return (
    <div className='w-full h-full bg-base-100 text-base-content overflow-hidden flex'>
      <div className='w-[400px] flex flex-col border-r border-base-content/20 bg-base-200'>
        <ProfileHeader />
        <ActiveTabSwitch />
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>
      <div className='flex-1 flex flex-col bg-base-100 relative'>
        {selectedUser ? <ChatContainer /> : <NoConversation />}
      </div>
    </div>
  );
};

export default ChatPage;

