import { motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function PredictButton({ onClick, loading }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={loading}
      className={`relative w-full py-4 rounded-xl font-bold text-lg shadow-lg overflow-hidden transition-all ${
        loading
          ? "bg-purple-600/50 cursor-not-allowed"
          : "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]"
      }`}
    >
      <span className="relative z-10">
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <ArrowPathIcon className="w-6 h-6 animate-spin" /> Processing...
          </div>
        ) : (
          "Predict Now"
        )}
      </span>
      {!loading && (
        <span className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 animate-gradient-x" />
      )}
    </motion.button>
  );
}
