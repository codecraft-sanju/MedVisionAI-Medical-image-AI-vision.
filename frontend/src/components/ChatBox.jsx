import { motion } from "framer-motion";
import { PaperAirplaneIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import ChatMessage from "./ChatMessage";

export default function ChatBox({
  chatMessages,
  chatInput,
  setChatInput,
  handleChatSubmit,
  chatLoading,
  chatTyping,
  chatEndRef,
  placeholder
}) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex-1 bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-4 max-h-[85vh] overflow-y-auto border border-pink-500/20"
    >
      <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
        {placeholder.includes("feel") ? "Mental Health Support 💜" : "Chat with AI"}
      </h3>
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {chatMessages.map((msg, i) => (
          <ChatMessage
            key={i}
            role={msg.role}
            content={msg.content}
            isTyping={chatTyping && i === chatMessages.length - 1}
          />
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-3 rounded-xl bg-gray-700/70 text-gray-200 outline-none text-base shadow-inner border border-purple-500/30 focus:ring-2 focus:ring-pink-500"
          onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleChatSubmit}
          disabled={chatLoading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 rounded-xl shadow-lg hover:shadow-[0_0_15px_rgba(236,72,153,0.7)] transition-all"
        >
          {chatLoading ? (
            <ArrowPathIcon className="w-6 h-6 animate-spin" />
          ) : (
            <PaperAirplaneIcon className="w-6 h-6 rotate-45" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
