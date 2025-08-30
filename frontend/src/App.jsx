import { useState } from "react";
import axios from "axios";
import {
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(response.data);
    } catch (error) {
      console.error(error);
      if (error.response) {
        setErrorMsg(
          `Error ${error.response.status}: ${
            error.response.data.detail || JSON.stringify(error.response.data)
          }`
        );
      } else if (error.request) {
        setErrorMsg("No response from server. Make sure backend is running.");
      } else {
        setErrorMsg(`Request error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 to-pink-50 flex flex-col items-center justify-start p-8">
      {/* Header */}
      <h1 className="text-5xl font-bold text-purple-700 mb-12 text-center tracking-tight">
        PCOS Detection Dashboard
      </h1>

      {/* Upload & Predict Card */}
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 mb-12 transform transition-all hover:scale-[1.02]">
        <div className="flex flex-col items-center gap-8">
          <label className="flex flex-col items-center justify-center w-full p-8 bg-purple-50 border-2 border-dashed border-purple-300 rounded-2xl cursor-pointer hover:border-purple-500 transition-all duration-300 hover:scale-105">
            <CloudArrowUpIcon className="w-16 h-16 text-purple-400 mb-4 animate-bounce" />
            <span className="text-gray-700 font-medium text-lg">
              {file ? file.name : "Drag & drop or click to upload your file"}
            </span>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-transform duration-300 ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 hover:scale-105"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <ArrowPathIcon className="w-6 h-6 animate-spin" />
                Processing...
              </div>
            ) : (
              "Predict Now"
            )}
          </button>

          {errorMsg && (
            <div className="mt-6 flex items-center gap-3 text-red-600 font-medium animate-pulse">
              <XCircleIcon className="w-6 h-6" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg border border-purple-200 rounded-3xl shadow-2xl p-10 animate-fadeInUp">
          <div className="flex items-center gap-4 mb-6">
            <CheckCircleIcon className="w-12 h-12 text-purple-600" />
            <h2 className="text-3xl font-bold text-purple-700">Prediction Result</h2>
          </div>

          <p className="text-gray-800 text-xl mb-6">{result.prediction}</p>

          {result.confidence && (
            <div className="mb-6">
              <span className="text-gray-700 font-medium">Confidence:</span>
              <div className="w-full bg-purple-100 rounded-full h-6 mt-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-6 rounded-full transition-all duration-700"
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {result.advice && (
            <div>
              <h3 className="text-2xl font-semibold text-purple-700 mb-4">
                Recommendations
              </h3>
              <pre className="text-gray-700 whitespace-pre-wrap bg-purple-50 p-6 rounded-xl shadow-inner text-lg">
                {result.advice}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
