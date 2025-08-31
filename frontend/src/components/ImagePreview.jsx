import { motion } from "framer-motion";

export default function ImagePreview({ preview }) {
  if (!preview) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full flex justify-center"
    >
      <img
        src={preview}
        alt="Preview"
        className="max-h-80 object-contain rounded-2xl border border-purple-500/40 shadow-2xl hover:scale-105 transition-transform duration-500"
      />
    </motion.div>
  );
}
