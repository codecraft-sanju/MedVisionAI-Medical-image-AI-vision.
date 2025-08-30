import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

function ChatMessage({ role, content, isTyping }) {
  const isAI = role !== "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex ${isAI ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm sm:text-base shadow-xl transition-transform transform hover:scale-105 duration-300 ${
          isAI
            ? "bg-gradient-to-br from-gray-700 to-gray-600 text-gray-100 rounded-tl-none"
            : "bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-tr-none"
        }`}
      >
        {content}
        {isTyping && <span className="animate-pulse">▍</span>}
      </div>
    </motion.div>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [typedAdvice, setTypedAdvice] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatTyping, setChatTyping] = useState(false);

  const chatEndRef = useRef(null);
  const adviceEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const BASE_URL = import.meta?.env?.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    adviceEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [typedAdvice]);

  useEffect(() => {
    return () => clearInterval(typingIntervalRef.current);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setResult(null);
    setErrorMsg(null);
    setTypedAdvice("");
    setChatMessages([]);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.info("Select an image first ✨");
      return;
    }
    setLoading(true);
    setResult(null);
    setErrorMsg(null);
    setTypedAdvice("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post(`${BASE_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const prediction = data?.prediction || "No prediction available";
      const confidence = typeof data?.confidence === "number" ? data.confidence : 0;
      const advice = data?.advice || "No advice available";
      setResult({ prediction, confidence });
      toast.success("Prediction received!");
      const words = advice.split(" ");
      let index = 0;
      setTypedAdvice("");
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = setInterval(() => {
        if (index < words.length) {
          setTypedAdvice((prev) => prev + words[index] + " ");
          index++;
        } else {
          clearInterval(typingIntervalRef.current);
        }
      }, 30);
    } catch (error) {
      const msg = error?.response?.data?.detail || error?.message || "Server error";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async () => {
    const messageText = chatInput.trim();
    if (!messageText) return;
    const userMessage = { role: "user", content: messageText };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);
    setChatTyping(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/chat`, { message: messageText });
      const aiMessage = { role: "ai", content: data?.reply || "" };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error("Chat failed: " + (error?.response?.data?.detail || error.message));
    } finally {
      setChatTyping(false);
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (result?.prediction === "PCOS Detected") {
      const supportMessage = {
        role: "ai",
        content:
          "Hi! I’m here to support you. You’re not alone, and we can talk about ways to manage your health. How are you feeling today?",
      };
      setChatMessages([supportMessage]);
    }
  }, [result]);

  const confidencePct = Math.max(0, Math.min(100, Math.round((result?.confidence || 0) * 100)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-200 flex flex-col items-center p-4 sm:p-8"
    >
      <ToastContainer position="top-right" />
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-8 sm:mb-12 text-center tracking-tight animate-pulse"
      >
        PCOS Detection Dashboard
      </motion.h1>
      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-6 lg:gap-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-1 bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 max-h-[85vh] overflow-y-auto border border-purple-500/20"
        >
          <label className="flex flex-col items-center justify-center w-full p-6 sm:p-8 bg-gradient-to-br from-gray-700 to-gray-600 border-2 border-dashed border-purple-500 rounded-2xl cursor-pointer hover:border-purple-400 transition-all duration-300 hover:scale-105">
            <CloudArrowUpIcon className="w-16 h-16 text-purple-400 mb-4 animate-bounce" />
            <span className="text-gray-300 font-medium text-lg text-center">
              {file ? file.name : "Drag & drop or click to upload your file"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>

          {preview && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full flex justify-center">
              <img src={preview} alt="Preview" className="max-h-80 object-contain rounded-xl border border-purple-500 shadow-md hover:scale-105 transition-transform" />
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-transform duration-300 ${
              loading ? "bg-purple-600/50 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <ArrowPathIcon className="w-6 h-6 animate-spin" /> Processing...
              </div>
            ) : (
              "Predict Now"
            )}
          </motion.button>

          {errorMsg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 text-red-400 font-semibold animate-pulse">
              <XCircleIcon className="w-5 h-5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {result && (
            <>
              <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mt-6">
                <CheckCircleIcon className="w-10 h-10 text-purple-400 animate-bounce" />
                <h2 className="text-3xl font-extrabold text-purple-400">{result.prediction}</h2>
              </motion.div>
              <div className="mb-4">
                <span className="font-medium">Confidence:</span>
                <div className="w-full bg-gray-700 rounded-full h-5 mt-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidencePct}%` }}
                    transition={{ duration: 1 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-5 rounded-full"
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">{confidencePct}%</div>
              </div>
              {typedAdvice && (
                <div className="mt-4 flex flex-col">
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">Recommendations</h3>
                  <pre className="bg-gray-900/70 p-6 rounded-xl shadow-inner text-base overflow-y-auto max-h-96 border border-purple-500/10" ref={adviceEndRef}>
                    {typedAdvice}
                    {loading && <span className="animate-pulse">|</span>}
                  </pre>
                </div>
              )}
            </>
          )}
        </motion.div>

        {result && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-1 bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-4 max-h-[85vh] overflow-y-auto border border-pink-500/20"
          >
            <h3 className="text-2xl font-bold text-pink-400 mb-4">
              {result.prediction === "PCOS Detected" ? "Mental Health Support 💜" : "Chat with AI"}
            </h3>
            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
              {chatMessages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} isTyping={chatTyping && i === chatMessages.length - 1} />
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={result.prediction === "PCOS Detected" ? "Talk about how you feel..." : "Type a message..."}
                className="flex-1 p-3 rounded-xl bg-gray-700 text-gray-200 outline-none text-base shadow-inner border border-purple-500/20"
                onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleChatSubmit}
                disabled={chatLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 rounded-xl shadow-lg"
              >
                {chatLoading ? (
                  <ArrowPathIcon className="w-6 h-6 animate-spin" />
                ) : (
                  <PaperAirplaneIcon className="w-6 h-6 rotate-45" />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
