import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function PredictionResult({ prediction, confidencePct }) {
  return (
    <>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 mt-6"
      >
        <CheckCircleIcon className="w-10 h-10 text-purple-400 animate-bounce" />
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {prediction}
        </h2>
      </motion.div>
      <div className="mb-4">
        <span className="font-medium">Confidence:</span>
        <div className="w-full bg-gray-700/60 rounded-full h-5 mt-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidencePct}%` }}
            transition={{ duration: 1 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-5 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]"
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">{confidencePct}%</div>
      </div>
    </>
  );
}
