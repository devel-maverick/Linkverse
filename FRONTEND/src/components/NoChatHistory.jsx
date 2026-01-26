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
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-[#efeae2]/50">
      <div className="w-16 h-16 bg-[#00a884]/10 rounded-full flex items-center justify-center mb-5">
        <MessageCircleIcon className="size-8 text-[#00a884]" />
      </div>
      <h3 className="text-lg font-medium text-[#111b21] mb-3">
        Start your conversation with {name}
      </h3>
      <div className="flex flex-col space-y-3 max-w-md mb-5">
        <p className="text-[#54656f] text-sm">
          This is the beginning of your conversation. Send a message to start chatting!
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleQuickMessage("👋 Hello!")}
          className="px-4 py-2 text-sm font-medium text-[#00a884] bg-[#d9fdd3] rounded-full hover:bg-[#cbfdc3] transition-colors border border-transparent shadow-sm"
        >
          👋 Say Hello
        </button>
        <button
          onClick={() => handleQuickMessage("🤝 How are you?")}
          className="px-4 py-2 text-sm font-medium text-[#00a884] bg-[#d9fdd3] rounded-full hover:bg-[#cbfdc3] transition-colors border border-transparent shadow-sm"
        >
          🤝 How are you?
        </button>
      </div>
    </div>
  );
};

export default NoChatHistory;