// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useAuth } from "@clerk/clerk-react";
// import axios from "axios";
// import LinkShareModal from "../components/LinkShareModal";
// import { Download } from "lucide-react";
// import { Copy, File, Info, Share2 } from "lucide-react";
// const publicFileView = () => {
//   const [file, setFile] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [shareModalOpen, setShareModalOpen] = useState({
//     isOpen: false,
//     link = ""
//   });

//   const { getToken } = useAuth();
//   const { fileId } = useParams();

//   useEffect(() => {
//     const getFile = async () => {
//       setIsLoading(true);
//       try {
//         const res = await axios.get(`http://localhost:8080/api/v1.0/files/public/${fileId}`, {
//           headers: {
//             Authorization: `Bearer ${await getToken()}`
//           }
//         });
//         setFile(res.data);
//       } catch (err) {
//         setError("Could not retrieve the file. The link may be invalid or the file may have been deleted.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getFile();
//   }, [fileId, getToken]);

//   const handleDownload = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/v1.0/files/download/${fileId}`, {
//         responseType: "blob",
//         headers: {
//           Authorization: `Bearer ${await getToken()}`
//         }
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", file.name);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//     } catch (err) {
//       setError("Could not download the file.");
//     }
//   };

//   const openShareModal = () => {
//     setShareModalOpen({
//       isOpen: true,
//       link: `${window.location.origin}/files/${fileId}`
//     });
//   };

//   const closeShareModal = () => {
//     setShareModalOpen({
//       isOpen: false,
//       link: ""
//     });
//   };
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <p className="text-gray-600">Loading file...</p>

//       </div>
//     )
//   };

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <div className="tect-center p-8 bg-white rounded-lg sha">
//           <h2 className="text-xl font-bold text-red-600">Error</h2>
//           <p className="text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!file) {
//     return null;
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <header className="p-4 border-b bg-white">
//         <div className="container mx-auto flex justify-betwee items-center">
//           <div className="flex items-center gap-2">
//             <Share2 className="text-blue-600" />
//             <span className="font-bold text-xl text-gray-800">CloudShare</span>
//           </div>
//           <button onClick={openShareModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
//             <Copy size={18} /> Share Link
//           </button>
//         </div>
//       </header>
//       <main className="container mx-auto p-4 md:p-8 flex justify-center" >
//         <div className="w-full max-w-3xl">
//           <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
//             <div className="flex justify-center mb-4">
//               <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
//                 <File size={40} className="text-blue-600" />
//               </div>
//             </div>
//             <h1 className="text-2xl font-semibold text-gray-800 break-words">
//               {file.name}
//             </h1>
//             <p className="text-sm text-gray-500 mt-2">
//               {(file.size / 1024).toFixed(2)} KB
//               <span className="mx-2">&bull;</span>
//              Shared on {new Date(file.createdAt).toLocaleDateString()}
//             </p>
//             <div className="my-6">
//               <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded">
//                 {file.type || "File"}
//               </span>
//             </div>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleDownload}
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//               >
//                 <Download size={18} /> Download
//               </button>
//             </div>
//             <hr className="my-6" />
//             <div>
//               <h3 className="text-lg font-semibold text-left text-gray-800 mb-4">
//                 File Information
//               </h3>
//               <div className="text-left text-sm space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">File Name:</span>
//                   <span className="text-gray-800 font-medium break-all">{file.name}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">File Size:</span>
//                   <span className="text-gray-800 font-medium">{(file.size / 1024).toFixed(2)} KB</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">File Type:</span>
//                   <span className="text-gray-800 font-medium">{file.type || "N/A"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Shared On:</span>
//                   <span className="text-gray-800 font-medium">{new Date(file.createdAt).toLocaleDateString()}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="mt-6 bg-blue-50 border-blue-200 text-blue-800 px-4 py-2 rounded text-center">
//             <Info size={20} />
//             <p className="text-sm">
//               This is a public link. Anyone with this link can view and download the file. Please share it responsibly.
//             </p>
//           </div>
//         </div>
//       </main>
//       <LinkShareModal isOpen={shareModalOpen.isOpen} link={shareModalOpen.link} onClose={closeShareModal} title = "Share File" />
//     </div>
//   )
// }
// export default publicFileView;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  Download,
  Copy,
  File,
  Info,
  Share2,
  Loader2,
  AlertCircle,
  X,
  Check,
} from "lucide-react";

/* =========================================================
   SHARE LINK DIALOG
   Defined inside the same file
========================================================= */

const ShareLinkDialog = ({ isOpen, onClose, link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Share File</h2>

            <p className="text-sm text-gray-500 mt-1">
              Copy the link to share this file.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-600 mb-5">
            Anyone with this link can access this public file.
          </p>

          {/* Link + Copy Button */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={link}
              readOnly
              onClick={(e) => e.target.select()}
              className="flex-1 min-w-0 px-3 py-3 border-2 border-purple-500 rounded-xl outline-none text-sm text-gray-700 bg-white"
            />

            <button
              type="button"
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy Link"}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
                copied
                  ? "bg-green-100 text-green-600"
                  : "text-purple-600 hover:bg-purple-50"
              }`}
            >
              {copied ? <Check size={22} /> : <Copy size={22} />}
            </button>
          </div>

          {/* Copied Message */}
          {copied && (
            <div className="flex items-center gap-2 text-sm text-green-700 mt-4">
              <Check size={17} />
              <span>Link copied to clipboard!</span>
            </div>
          )}

          {/* Important information */}
          <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-start gap-3">
              <Info size={19} className="text-blue-600 mt-0.5 shrink-0" />

              <p className="text-sm text-blue-700">
                Anyone who receives this link can open it in a new browser tab
                and access the file.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-2 px-5 py-2.5 text-white rounded-xl shadow-sm transition-colors ${
              copied
                ? "bg-green-600 hover:bg-green-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   PUBLIC FILE VIEW
========================================================= */

const PublicFileView = () => {
  const { fileId } = useParams();

  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [shareModalOpen, setShareModalOpen] = useState({
    isOpen: false,
    link: "",
  });

  const API_URL = "http://localhost:8080/api/v1.0";

  /* =========================
     Fetch Public File
  ========================= */

  useEffect(() => {
    const getFile = async () => {
      if (!fileId) {
        setError("Invalid file link.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/files/public/${fileId}`);

        setFile(response.data);
      } catch (err) {
        console.error(
          "Error fetching file:",
          err.response?.data || err.message,
        );

        setError(
          err.response?.data?.message ||
            "Could not retrieve the file. The link may be invalid, private, or deleted.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getFile();
  }, [fileId]);

  /* =========================
     Download File
  ========================= */

  const handleDownload = async () => {
    if (!file) return;

    try {
      setError(null);

      const response = await axios.get(`${API_URL}/files/download/${fileId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");

      downloadLink.href = url;
      downloadLink.setAttribute("download", file.name || "download");

      document.body.appendChild(downloadLink);
      downloadLink.click();

      setTimeout(() => {
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Full download error:", err);

      if (err.response?.data instanceof Blob) {
        const errorText = await err.response.data.text();
        console.error("Backend error message:", errorText);
      }

      console.error("Status:", err.response?.status);

      setError(
        `Could not download the file. ${
          err.response?.status
            ? `Server returned error ${err.response.status}.`
            : "Please try again."
        }`,
      );
    }
  };

  /* =========================
     Open Share Dialog
  ========================= */

  const openShareModal = () => {
    const publicLink = `${window.location.origin}/files/${fileId}`;

    setShareModalOpen({
      isOpen: true,
      link: publicLink,
    });
  };

  /* =========================
     Close Share Dialog
  ========================= */

  const closeShareModal = () => {
    setShareModalOpen({
      isOpen: false,
      link: "",
    });
  };

  /* =========================
     Format File Size
  ========================= */

  const formatFileSize = (bytes) => {
    if (bytes === null || bytes === undefined) {
      return "N/A";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  /* =========================
     Format Date
  ========================= */

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /* =========================
     Loading UI
  ========================= */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <Loader2 size={36} className="animate-spin text-purple-600 mb-3" />

        <p className="text-gray-600">Loading shared file...</p>
      </div>
    );
  }

  /* =========================
     Error UI
  ========================= */

  if (error && !file) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="w-full max-w-md text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="w-14 h-14 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle size={28} className="text-red-600" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Unable to Open File
          </h2>

          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!file) return null;

  /* =========================
     Main UI
  ========================= */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Share2 size={21} className="text-purple-600" />
            </div>

            <span className="font-bold text-xl text-gray-800">CloudShare</span>
          </div>

          <button
            type="button"
            onClick={openShareModal}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Copy size={18} />

            <span className="hidden sm:inline">Share Link</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* File Header */}
          <div className="p-8 md:p-10 text-center border-b border-gray-100">
            <div className="flex justify-center mb-5">
              <div className="w-24 h-24 bg-purple-50 rounded-2xl flex items-center justify-center">
                <File size={48} className="text-purple-600" />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 break-words">
              {file.name}
            </h1>

            <p className="text-sm text-gray-500 mt-3">
              {formatFileSize(file.size)}
              <span className="mx-2">•</span>
              Shared on {formatDate(file.createdAt)}
            </p>

            <div className="mt-5">
              <span className="inline-flex px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                {file.type || "File"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 mt-7 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
            >
              <Download size={20} />
              Download File
            </button>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          </div>

          {/* File Information */}
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              File Information
            </h3>

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-4 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-500">File Name</span>

                <span className="text-sm text-gray-800 font-medium break-all sm:text-right">
                  {file.name}
                </span>
              </div>

              <div className="flex justify-between gap-4 p-4 rounded-xl">
                <span className="text-sm text-gray-500">File Size</span>

                <span className="text-sm font-medium text-gray-800">
                  {formatFileSize(file.size)}
                </span>
              </div>

              <div className="flex justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-500">File Type</span>

                <span className="text-sm font-medium text-gray-800">
                  {file.type || "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4 p-4 rounded-xl">
                <span className="text-sm text-gray-500">Shared On</span>

                <span className="text-sm font-medium text-gray-800">
                  {formatDate(file.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Public Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
          <Info size={21} className="text-blue-600 shrink-0 mt-0.5" />

          <div>
            <h4 className="text-sm font-semibold text-blue-800">
              Public Shared File
            </h4>

            <p className="text-sm text-blue-700 mt-1">
              Anyone with this link can open it in another browser tab and
              access this file.
            </p>
          </div>
        </div>
      </main>

      {/* Share Dialog */}
      <ShareLinkDialog
        isOpen={shareModalOpen.isOpen}
        onClose={closeShareModal}
        link={shareModalOpen.link}
      />
    </div>
  );
};

export default PublicFileView;
