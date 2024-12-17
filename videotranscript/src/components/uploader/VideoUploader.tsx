import React, { useState } from "react";
import axios from "axios";

const VideoUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [downloadFileUrl, setDownloadFileUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a video file");
      return;
    }

    setIsLoading(true);
    setFileUrl(null);
    setDownloadFileUrl(null);

    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/transcribe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.fileUrl) setFileUrl(response.data.fileUrl);
      if (response.data.downloadFileUrl) setDownloadFileUrl(response.data.downloadFileUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Something went wrong while processing the video.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadFileUrl) {
      const link = document.createElement("a");
      link.href = downloadFileUrl;
      link.download = downloadFileUrl.split("/").pop() || "processed_video.mp4";
      link.click();
    }
  };

  return (
    <main
      className="flex-grow p-4 bg-gray-900 text-white flex justify-center items-center h-screen"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div
        className="upload-container border-2 border-dashed border-gray-500 rounded-lg p-6 text-center w-3/4 max-w-2xl"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ background: "#1c1c1e", transition: "all 0.3s ease" }}
      >
        <form onSubmit={handleSubmit}>

          {isLoading && (
            <div className="spinner-container">
              <p>Processing...</p>
            </div>
          )}

          {!isLoading && fileUrl && (
            <div className="mt-4">
              <h3 className="text-lg mb-2">Processed Video Preview</h3>
              <video src={fileUrl} controls width="100%" className="rounded-lg mb-4" />
              <button
                type="button"
                onClick={handleDownload}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Download Captioned Video
              </button>
            </div>
          )}

          {!isLoading && !fileUrl && (
            <>
              <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-4">Drop a file to <span style={{ color: "#9b79ff" }}>transcribe</span> it.</h2>

                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gray-800 hover:bg-gray-700 py-2 px-4 rounded-lg mb-4"
                >
                  Upload a File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-gray-400">or drag and drop your video file here.</p>
              </div>
              {selectedFile && <p className="mt-2 text-sm">{selectedFile.name}</p>}
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4"
                disabled={!selectedFile || isLoading}
              >
                Upload & Generate Captions
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  );
};

export default VideoUploader;
