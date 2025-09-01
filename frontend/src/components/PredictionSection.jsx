import { motion } from "framer-motion";
import SpeechReader from "./SpeechReader";

export default function PredictionSection({ prediction, confidence, typedAdvice }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="flex flex-col bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl overflow-y-auto transition-transform duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Result</h2>
        {typedAdvice && <SpeechReader text={typedAdvice} />}
      </div>

      {prediction && (
        <div className="space-y-4">
          <p
            className={`text-xl sm:text-2xl font-bold ${
              prediction.includes("Detected") ? "text-red-400" : "text-green-400"
            }`}
          >
            {prediction}
          </p>

          {confidence !== null && (
            <div>
              <p className="text-xs sm:text-sm text-gray-300">Confidence:</p>
              <div className="w-full bg-white/20 rounded-full h-3 sm:h-4">
                <motion.div
                  className="h-3 sm:h-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(confidence * 100).toFixed(2)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-xs sm:text-sm mt-1">{(confidence * 100).toFixed(2)}%</p>
            </div>
          )}

          {typedAdvice && (
            <div className="mt-6">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Recommendations</h3>
              <motion.p
                className="text-gray-300 whitespace-pre-line leading-relaxed text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {typedAdvice}
              </motion.p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
