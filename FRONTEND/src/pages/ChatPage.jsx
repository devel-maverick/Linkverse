import React from 'react'
import { useChatStore } from '../store/useChatStore'
import BorderAnimatedContainer from '../components/BorderAnimatedContainer'
import ProfileHeader from "../components/ProfileHeader"
import ActiveTabSwitch from "../components/ActiveTabSwitch"
import ChatsList from "../components/ChatsList"
import ContactList from "../components/ContactList"
import ChatContainer from "../components/ChatContainer"
import NoConversation from "../components/NoConversation"

function ChatPage() {
  const {activeTab,selectedUser}=useChatStore()

  return (
    <div className='relative w-full max-w-6xl h-[750px]'>
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className='w-80 bg-white backdrop-blur-sm flex flex-col border-left-slate-500'>
        <ProfileHeader/>
        <ActiveTabSwitch/>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab==="chats"?<ChatsList/>:<ContactList/>}

        </div>

        </div>

        {/*RIGHT SIDE */}
        <div className='flex-1 flex flex-col bg-white backdrop-blur-sm'>
            {selectedUser?<ChatContainer/>:<NoConversation/>}

        </div>
      </BorderAnimatedContainer>
    </div>
    
  );
};

export default ChatPage;