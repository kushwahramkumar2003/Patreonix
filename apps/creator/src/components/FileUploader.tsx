"use client";

import React, { useState } from "react";
import axios from "axios";

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/ipfs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCid(response.data.cid);
      setError(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file");
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-violet-50 file:text-violet-700
        hover:file:bg-violet-100
      "
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        Upload to IPFS
      </button>
      {cid && (
        <p className="text-green-600">File uploaded successfully. CID: {cid}</p>
      )}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
