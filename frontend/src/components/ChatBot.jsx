import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatBubbleLeftRightIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function ChatBot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", { message: chatInput });
      const botMsg = { role: "assistant", content: response.data.reply };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      {!chatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 right-6 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 shadow-lg"
        >
          <p className="text-sm sm:text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            AI Health Assistant
          </p>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.15, rotate: [0, 5, -5, 0] }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl ring-4 ring-purple-400/30"
      >
        {chatOpen ? <XMarkIcon className="w-6 h-6 text-white" /> : <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />}
      </motion.button>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-80 sm:w-96 h-96 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/20 flex justify-between items-center">
              <h2 className="text-lg font-semibold">AI Health Assistant</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className={`p-2 sm:p-3 rounded-xl max-w-[80%] text-sm sm:text-base ${
                    msg.role === "user"
                      ? "ml-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "mr-auto bg-white/20 text-black"
                  }`}
                >
                  {msg.content}
                </motion.div>
              ))}
              {chatLoading && <p className="text-gray-400 animate-pulse text-sm">AI is typing...</p>}
            </div>

            <div className="p-3 border-t border-white/20 flex gap-2">
              <input
                type="text"
                placeholder="Ask anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/20 focus:outline-none text-sm sm:text-base"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleChatSubmit}
                disabled={chatLoading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg disabled:opacity-60 text-sm sm:text-base"
              >
                {chatLoading ? <ArrowPathIcon className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : "Send"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
