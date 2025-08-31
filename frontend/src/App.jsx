import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudArrowUpIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// 👇 SpeechReader import
import SpeechReader from "./components/SpeechReader";

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [advice, setAdvice] = useState("");
  const [typedAdvice, setTypedAdvice] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const fileInputRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    if (advice) {
      let index = 0;
      setTypedAdvice("");
      const interval = setInterval(() => {
        setTypedAdvice((prev) => prev + advice[index]);
        index++;
        if (index >= advice.length) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }
  }, [advice]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUploadAndPredict = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setPrediction(null);
    setAdvice("");
    setTypedAdvice("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPrediction(response.data.prediction);
      setConfidence(response.data.confidence);
      setAdvice(response.data.advice);
    } catch (err) {
      console.error(err);
      setPrediction("Error in prediction");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: chatInput,
      });
      const botMsg = { role: "assistant", content: response.data.reply };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6 sm:mb-8 text-center">
        PCOS Detection & Recommendations
      </h1>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl lg:h-[75vh]">
        
        {/* Upload Section */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col justify-between bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl"
        >
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-48 sm:max-h-64 object-cover rounded-xl border border-white/20"
              />
            ) : (
              <div className="w-full h-40 sm:h-64 flex items-center justify-center border-2 border-dashed border-white/20 rounded-xl">
                <p className="text-gray-400 text-sm sm:text-base">Upload Ultrasound Image</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => fileInputRef.current.click()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg text-sm sm:text-base"
            >
              <div className="flex items-center justify-center gap-2">
                <CloudArrowUpIcon className="w-5 h-5" />
                Upload
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleUploadAndPredict}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg disabled:opacity-60 text-sm sm:text-base"
            >
              {loading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Predict"
              )}
            </motion.button>
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {/* Sample Images Section */}
          <div className="mt-6">
            <p className="text-gray-300 text-sm mb-2">Or try sample images:</p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <img
                  key={num}
                  src={`/ultrasonic${num}.jpg`}
                  alt={`Sample ${num}`}
                  onClick={() => {
                    fetch(`/ultrasonic${num}.jpg`)
                      .then((res) => res.blob())
                      .then((blob) => {
                        const file = new File([blob], `ultrasonic${num}.jpg`, { type: blob.type });
                        setSelectedFile(file);
                        setPreview(URL.createObjectURL(blob));
                      });
                  }}
                  className="w-full h-16 sm:h-20 object-cover rounded-lg border border-white/20 cursor-pointer hover:opacity-80"
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Prediction & Recommendations */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl overflow-y-auto"
        >
          {/* Result Title + Listen Button */}
        
<div className="flex items-center justify-between mb-4">
  <h2 className="text-lg sm:text-xl font-semibold">Result</h2>
  {typedAdvice && <SpeechReader text={typedAdvice} />}
</div>


          {prediction && (
            <div className="space-y-4">
              <p
                className={`text-xl sm:text-2xl font-bold ${
                  prediction.includes("Detected")
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {prediction}
              </p>
              {confidence !== null && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-300">Confidence:</p>
                  <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
                    <div
                      className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      style={{ width: `${(confidence * 100).toFixed(2)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs sm:text-sm mt-1">
                    {(confidence * 100).toFixed(2)}%
                  </p>
                </div>
              )}

              {typedAdvice && (
                <div className="mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Recommendations</h3>
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                    {typedAdvice}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Floating Chatbot Label */}
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

      {/* Floating Chatbot Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl"
      >
        {chatOpen ? (
          <XMarkIcon className="w-6 h-6 text-white" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-80 sm:w-96 h-96 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-white/20 flex justify-between items-center">
              <h2 className="text-lg font-semibold">AI Health Assistant</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 sm:p-3 rounded-xl max-w-[80%] text-sm sm:text-base ${
                    msg.role === "user"
                      ? "ml-auto bg-gradient-to-r from-purple-600 to-indigo-600"
                      : "mr-auto bg-white/20"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {chatLoading && (
                <p className="text-gray-400 animate-pulse text-sm">AI is typing...</p>
              )}
            </div>

            {/* Input */}
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
                {chatLoading ? (
                  <ArrowPathIcon className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  "Send"
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
