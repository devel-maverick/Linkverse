import React, { useState } from 'react'
import { useRef } from 'react'
import keyBoardSound from '../hooks/keyBoardSound'
import { useChatStore } from '../store/useChatStore'
import { ImageIcon, SendIcon, XIcon } from 'lucide-react'

function MessageInput() {
  const { playRandom } = keyBoardSound()
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const { sendMessage, isSoundEnabled } = useChatStore()
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandom()
    sendMessage({
      text: text.trim(),
      image: imagePreview
    })
    setText("")
    setImagePreview("")
    if (fileInputRef.current) fileInputRef.current.value = "";

  }
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="px-4 py-3 bg-base-200 flex items-center space-x-2">
      {imagePreview && (
        <div className="absolute bottom-20 left-4 z-20">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border-4 border-base-300 shadow-lg"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-base-content text-base-100 flex items-center justify-center hover:bg-base-content/80 shadow-sm"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex-1 flex items-center space-x-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-2 hover:bg-base-content/10 rounded-full transition-colors ${imagePreview ? "text-primary" : "text-base-content/50"
            }`}
        >
          <ImageIcon className="w-6 h-6" />
        </button>

        <div className="flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              isSoundEnabled && playRandom();
            }}
            className="w-full bg-base-100 border-0 rounded-lg py-2.5 px-4 text-base-content placeholder-base-content/50 focus:outline-none focus:ring-0 text-[15px]"
            placeholder="Type a message"
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="p-3 bg-primary text-primary-content rounded-full shadow-sm hover:bg-primary/80 transition-all disabled:opacity-50 disabled:cursor-default"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput