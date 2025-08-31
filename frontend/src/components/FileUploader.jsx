import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

export default function FileUploader({ file, onChange }) {
  return (
    <label className="flex flex-col items-center justify-center w-full p-8 bg-gray-800/50 backdrop-blur-xl border-2 border-dashed border-purple-500/40 rounded-2xl cursor-pointer hover:border-purple-400/70 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
      <CloudArrowUpIcon className="w-16 h-16 text-purple-400 mb-4 animate-bounce" />
      <span className="text-gray-300 font-medium text-lg text-center">
        {file ? file.name : "Drag & drop or click to upload your file"}
      </span>
      <input type="file" accept="image/*" className="hidden" onChange={onChange} />
    </label>
  );
}
