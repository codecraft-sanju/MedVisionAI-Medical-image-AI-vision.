import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function SpeechReader({ text }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleToggle = () => {
    if (!text) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // "hi-IN" for Hindi
      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="ml-3 flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-xs sm:text-sm shadow-md hover:opacity-90"
    >
      {isSpeaking ? (
        <>
          <Volume2 className="w-4 h-4" />
          Stop
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4" />
          Listen
        </>
      )}
    </button>
  );
}
