import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const NoChatHistory = ({ name }) => {
  const { sendMessage } = useChatStore();

  const handleQuickMessage = async (text) => {
    try {
      await sendMessage({ text });
    } catch (error) {
      console.error("Failed to send quick message:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-transparent">
      <div className="w-16 h-16 bg-base-content/10 rounded-full flex items-center justify-center mb-5">
        <MessageCircleIcon className="size-8 text-base-content" />
      </div>
      <h3 className="text-lg font-medium text-base-content mb-3">
        Start your conversation with {name}
      </h3>
      <div className="flex flex-col space-y-3 max-w-md mb-5">
        <p className="text-base-content/70 text-sm">
          This is the beginning of your conversation. Send a message to start chatting!
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleQuickMessage("👋 Hello!")}
          className="btn btn-ghost border border-base-content/20 text-base-content hover:bg-base-200"
        >
          👋 Say Hello
        </button>
        <button
          onClick={() => handleQuickMessage("🤝 How are you?")}
          className="btn btn-ghost border border-base-content/20 text-base-content hover:bg-base-200"
        >
          🤝 How are you?
        </button>
      </div>
    </div>
  );
};

export default NoChatHistory;