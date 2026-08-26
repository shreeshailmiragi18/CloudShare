import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { useState, useContext, useEffect } from "react";
import UploadBox from "../components/UploadBox";
import { AlertCircle } from "lucide-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import axios from "axios";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const { credits, setCredits } = useContext(UserCreditsContext);
  const { getToken } = useAuth();

  const MAX_FILES = 5;

  // This receives FILES directly from UploadBox
  const handleFileChange = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);

    // Total number of files after adding
    const totalFiles = files.length + newFiles.length;

    // Maximum 5 files
    if (totalFiles > MAX_FILES) {
      setMessage(`You can upload a maximum of ${MAX_FILES} files at a time.`);
      setMessageType("error");
      return;
    }

    // Optional: Check credits while selecting
    if (totalFiles > credits) {
      setMessage(`You only have ${credits} credit${credits !== 1 ? "s" : ""}.`);
      setMessageType("error");
      return;
    }

    setFiles((previousFiles) => [...previousFiles, ...newFiles]);

    setMessage("");
    setMessageType("");
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((previousFiles) =>
      previousFiles.filter((_, index) => index !== indexToRemove),
    );

    setMessage("");
    setMessageType("");
  };

  const handleUpload = async () => {
    console.log("Files selected for upload:", files);

    // Check selected files
    if (files.length === 0) {
      setMessage("Please select files to upload.");
      setMessageType("error");
      return;
    }

    // Maximum 5 files
    if (files.length > MAX_FILES) {
      setMessage(`You can upload a maximum of ${MAX_FILES} files at a time.`);
      setMessageType("error");
      return;
    }

    // Check credits
    if (credits <= 0) {
      setMessage("You don't have enough credits to upload.");
      setMessageType("error");
      return;
    }

    if (files.length > credits) {
      setMessage(
        `You need ${files.length} credits, but you only have ${credits}.`,
      );
      setMessageType("error");
      return;
    }

    setUploading(true);
    setMessage("");
    setMessageType("");

    try {
      const token = await getToken();

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(
        "http://localhost:8080/api/v1.0/files/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Upload successful:", response.data);

      // Update credits from backend
      if (response.data?.remainingCredits !== undefined) {
        setCredits(response.data.remainingCredits);
      }

      setMessage("Files uploaded successfully!");
      setMessageType("success");

      // Clear selected files
      setFiles([]);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);

      setMessage(
        error.response?.data?.message ||
          "Error uploading files. Please try again.",
      );

      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  const isUploadDisabled =
    files.length === 0 ||
    files.length > MAX_FILES ||
    credits <= 0 ||
    files.length > credits ||
    uploading;

  useEffect(() => {
    const displayToken = async () => {
      const token = await getToken();
      console.log(token);
    };
    displayToken();
  }, []);

  return (
    <DashboardLayout activeMenu="Upload">
      <div className="p-6">
        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
              messageType === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {messageType === "error" && <AlertCircle size={20} />}

            {message}
          </div>
        )}

        {/* Upload Component */}
        <UploadBox
          files={files}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
          onUpload={handleUpload}
          remainingCredits={credits}
          isUploadDisabled={isUploadDisabled}
          uploading={uploading}
          maxFiles={MAX_FILES}
        />
      </div>
    </DashboardLayout>
  );
};

export default Upload;
