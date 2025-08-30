import { useState, useRef, useEffect } from "react";
import {
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";

// ChatMessage Component - Moved into a single file for the application
function ChatMessage({ role, content = "", isTyping }) {
  return (
    <div
      className={`p-2 sm:p-3 rounded-xl text-sm sm:text-base ${
        role === "user" ? "bg-purple-600 self-end" : "bg-gray-700 self-start"
      }`}
    >
      {content || (isTyping ? "..." : "")}
      {isTyping && <span className="animate-pulse">|</span>}
    </div>
  );
}