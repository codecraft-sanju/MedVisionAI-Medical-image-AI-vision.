import { useRef } from "react";
import { motion } from "framer-motion";
import { CloudArrowUpIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function UploadSection({
  selectedFile,
  setSelectedFile,
  preview,
  setPreview,
  loading,
  handleUploadAndPredict,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSampleClick = (num) => {
    fetch(`/ultrasonic${num}.jpg`)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `ultrasonic${num}.jpg`, { type: blob.type });
        setSelectedFile(file);
        setPreview(URL.createObjectURL(blob));
      });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="flex flex-col justify-between bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl transition-transform duration-300"
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-full max-h-64 sm:max-h-72 object-cover rounded-2xl border border-white/20 shadow-lg"
          />
        ) : (
          <div className="group relative w-full h-64 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center hover:border-purple-400 transition-colors duration-300">
            <p className="text-gray-400 group-hover:text-purple-400 text-sm sm:text-base">
              Upload Ultrasound
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => fileInputRef.current.click()}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg text-sm sm:text-base relative overflow-hidden"
        >
          <CloudArrowUpIcon className="w-5 h-5 mx-auto" />
          Upload
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleUploadAndPredict}
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg disabled:opacity-60 text-sm sm:text-base relative overflow-hidden"
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

      <div className="mt-6">
        <p className="text-gray-300 text-sm mb-2">Or try sample images:</p>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((num) => (
            <motion.img
              key={num}
              src={`/ultrasonic${num}.jpg`}
              alt={`Sample ${num}`}
              onClick={() => handleSampleClick(num)}
              className="w-full h-20 sm:h-24 object-cover rounded-lg border border-white/20 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
