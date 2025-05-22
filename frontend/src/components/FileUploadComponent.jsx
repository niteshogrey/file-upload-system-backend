import { useState } from "react";
import axios from "axios";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
  "image/jpeg",
  "image/png",
];

const FileUploadComponent = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const validatedFiles = files.map((file) => {
      let error = null;
      if (!ALLOWED_TYPES.includes(file.type)) {
        error = "Invalid file type";
      } else if (file.size > MAX_FILE_SIZE) {
        error = "File size exceeds 50MB";
      }
      return { file, error };
    });

    setSelectedFiles((prev) => [...prev, ...validatedFiles]);
    setMessage({ type: "", text: "" });
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    selectedFiles.forEach(({ file, error }) => {
      if (!error) {
        formData.append("documents", file); // Key must match backend
      }
    });

    try {
      await axios.post(
        "http://localhost:2000/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      setMessage({ type: "success", text: "Files uploaded successfully!" });
      setSelectedFiles([]);
      setUploadProgress(0);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Upload failed. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Files</h2>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-4 border py-2 file:bg-gray-400 rounded file:px-1"
        accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
      />

      {selectedFiles.length > 0 && (
        <div className="mb-4 space-y-3">
          {selectedFiles.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border p-2 rounded"
            >
              <div>
                <p className="text-sm font-medium">{item.file.name}</p>
                <p className="text-xs text-gray-500">
                  {(item.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {item.error && (
                  <p className="text-xs text-red-500">{item.error}</p>
                )}
              </div>
              <button
                onClick={() => removeFile(index)}
                className="ml-4 text-red-500 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadProgress > 0 && (
        <div className="mb-4 w-full bg-gray-200 rounded-full">
          <div
            className="bg-blue-500 text-white text-sm text-center p-1 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          >
            {uploadProgress}%
          </div>
        </div>
      )}

      <button
        onClick={uploadFiles}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={
          selectedFiles.length === 0 || selectedFiles.some((f) => f.error)
        }
      >
        Upload
      </button>

      {message.text && (
        <div
          className={`mt-4 p-2 text-sm rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
