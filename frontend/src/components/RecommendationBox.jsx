import { useRef, useEffect } from "react";

export default function RecommendationBox({ advice, loading }) {
  const adviceEndRef = useRef(null);
  useEffect(() => {
    adviceEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [advice]);

  if (!advice) return null;
  return (
    <div className="mt-4 flex flex-col">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
        Recommendations
      </h3>
      <pre
        className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-inner text-base overflow-y-auto max-h-96 border border-purple-500/20 text-gray-200 leading-relaxed"
        ref={adviceEndRef}
      >
        {advice}
        {loading && <span className="animate-pulse">|</span>}
      </pre>
    </div>
  );
}
