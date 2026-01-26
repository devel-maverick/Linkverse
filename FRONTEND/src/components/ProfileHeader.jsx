import React, { useState, useRef } from 'react';
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from "../store/useChatStore";
const mouseClickSound = new Audio("/sounds/mouse-click.mp3")
function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      const base64Image = reader.result
      setSelectedImg(base64Image)
      await updateProfile({ profilePic: base64Image })
    }
  };

  return (
    <div className='p-6 border-b border-base-content/20'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='avatar online'>
            <button
              className='size-14 rounded-full overflow-hidden relative group border border-base-content/10'
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User Image"
                className='size-full object-cover'
              />

              <div className='absolute inset-0 bg-base-300/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
                <span className='text-base-content text-xs'>Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className='hidden'
            />
          </div>
          <div>
            <h3 className='text-base-content font-medium text-base max-w-[180px] truncate'>
              {authUser.fullName}
            </h3>
            <p className='text-base-content/60 text-xs'>Online</p>
          </div>
        </div>

        <div className='flex gap-4 items-center'>
          <button
            className='text-base-content/60 hover:text-base-content transition-colors'
            onClick={logout}
          >
            <LogOutIcon className='size-5' />
          </button>
          <button
            className='text-base-content/60 hover:text-base-content transition-colors'
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch(err => console.log("Audio failed:", err));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className='size-5' />
            ) : (
              <VolumeOffIcon className='size-5' />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProfileHeader;
