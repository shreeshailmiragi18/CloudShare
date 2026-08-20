// import {
//   Copy,
//   Eye,
//   FileIcon,
//   FileText,
//   Globe,
//   Image,
//   Lock,
//   Music,
//   Video,
//   Download,
//   Trash2,
// } from "lucide-react";
// import React from "react";

// const FileCard = ({ file }) => {
//   const [showActions, setShowActions] = React.useState(false);

//   const getFileIcon = () => {
//     const extension = file.name.split(".").pop().toLowerCase();
//     if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
//       return <Image size={24} className="text-purple-500" />;
//     }

//     if (["mp4", "avi", "mov", "mkv", "wmv", "webm"].includes(extension)) {
//       return <Video size={24} className="text-blue-500" />;
//     }

//     if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
//       return <Music size={24} className="text-green-500" />;
//     }

//     if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
//       return <FileText size={24} className="text-amber-500" />;
//     }
//     return <FileIcon size={24} className="text-purple-500" />;
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes < 1024) return bytes + " B";
//     else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
//     else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
//     else return (bytes / 1073741824).toFixed(2) + " GB";
//   };

//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };
//   return (
//     <div
//       className="relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all border border-gray-100"
//       onMouseEnter={() => setShowActions(true)}
//       onMouseLeave={() => setShowActions(false)}
//     >
//       <div className="h-32 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
//         {getFileIcon()}
//       </div>
//       {/* public/private badge */}
//       <div className="absolute top-2 right-2">
//         <div
//           className={`rounded-full p-1.5 ${file.isPublic ? "bg-green-100" : "bg-gray-100"}`}
//           title={file.isPublic ? "Public" : "Private"}
//         >
//           {file.isPublic ? (
//             <Globe size={14} className="text-green-600" />
//           ) : (
//             <Lock size={14} className="text-gray-500" />
//           )}
//         </div>
//       </div>
//       {/* file info */}
//       <div className="p-4">
//         <div className="flex justify-between items-start">
//           <div className="overflow-hidden">
//             <h3
//               title={file.name}
//               className="font-medium text-gray-900 truncate"
//             >
//               {file.name}
//             </h3>
//             <p className="text-xs text-gray-500 mt-1">
//               {formatFileSize(file.size)} . {formatDate(file.uploadedAt)}
//             </p>
//           </div>
//         </div>
//       </div>
//       {/* action buttons */}
//       <div
//         className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${showActions ? "opacity-100" : "opacity-0"}`}
//       >
//         <div className="flex gap-3 w-full justify-center">
//           {file.isPublic && (
//             <button
//               title="Share Link"
//               className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-purple-500 hover:text-purple-600"
//             >
//               <Copy size={18} />
//             </button>
//           )}
//           {file.isPublic && (
//             <a
//               href={`/file/${file.id}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               title="View File"
//               className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-gray-700 hover:text-gray-900"
//             >
//               <Eye size={18} />
//             </a>
//           )}

//           <button
//             title="Download"
//             className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-green-600 hover:text-green-700"
//           >
//             <Download size={18} />
//           </button>
//           <button
//             title={file.isPublic ? "Make Private" : "Make Public"}
//             className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-amber-600 hover:text-amber-700"
//           >
//             {file.isPublic ? <Lock size={18} /> : <Globe size={18} />}
//           </button>

//           <button
//             className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-red-600 hover:text-red-700"
//             title="Delete"
//           >
//             <Trash2 size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileCard;

// design 2

// import {
//   Copy,
//   Eye,
//   FileIcon,
//   FileText,
//   Globe,
//   Image,
//   Lock,
//   Music,
//   Video,
//   Download,
//   Trash2,
// } from "lucide-react";
// import React from "react";

// const FileCard = ({ file, onToggle, onDelete, onShare, onDownload }) => {
//   const [showActions, setShowActions] = React.useState(false);

//   const getFileIcon = () => {
//     const extension = file.name.split(".").pop().toLowerCase();

//     if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
//       return <Image size={24} className="text-purple-500" />;
//     }

//     if (["mp4", "avi", "mov", "mkv", "wmv", "webm"].includes(extension)) {
//       return <Video size={24} className="text-blue-500" />;
//     }

//     if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
//       return <Music size={24} className="text-green-500" />;
//     }

//     if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
//       return <FileText size={24} className="text-amber-500" />;
//     }

//     return <FileIcon size={24} className="text-purple-500" />;
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes < 1024) return bytes + " B";
//     else if (bytes < 1048576) {
//       return (bytes / 1024).toFixed(2) + " KB";
//     } else if (bytes < 1073741824) {
//       return (bytes / 1048576).toFixed(2) + " MB";
//     } else {
//       return (bytes / 1073741824).toFixed(2) + " GB";
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     };

//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <div
//       className="relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all border border-gray-100"
//       onMouseEnter={() => setShowActions(true)}
//       onMouseLeave={() => setShowActions(false)}
//     >
//       {/* File Icon */}
//       <div className="h-32 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
//         {getFileIcon()}
//       </div>

//       {/* Public / Private Badge */}
//       <div className="absolute top-2 right-2">
//         <button
//           type="button"
//           onClick={onToggle}
//           className={`rounded-full p-1.5 cursor-pointer ${
//             file.isPublic ? "bg-green-100" : "bg-gray-100"
//           }`}
//           title={file.isPublic ? "Make Private" : "Make Public"}
//         >
//           {file.isPublic ? (
//             <Globe size={14} className="text-green-600" />
//           ) : (
//             <Lock size={14} className="text-gray-500" />
//           )}
//         </button>
//       </div>

//       {/* File Info */}
//       <div className="p-4">
//         <div className="flex justify-between items-start">
//           <div className="overflow-hidden">
//             <h3
//               title={file.name}
//               className="font-medium text-gray-900 truncate"
//             >
//               {file.name}
//             </h3>

//             <p className="text-xs text-gray-500 mt-1">
//               {formatFileSize(file.size)} · {formatDate(file.uploadedAt)}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons Overlay */}
//       <div
//         className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${
//           showActions ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//       >
//         <div className="flex gap-3 w-full justify-center">
//           {/* Share */}
//           {file.isPublic && (
//             <button
//               type="button"
//               onClick={onShare}
//               title="Share Link"
//               className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-purple-500 hover:text-purple-600"
//             >
//               <Copy size={18} />
//             </button>
//           )}

//           {/* View */}
//           {file.isPublic && (
//             <a
//               href={`/files/${file.id}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               title="View File"
//               className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-gray-700 hover:text-gray-900"
//             >
//               <Eye size={18} />
//             </a>
//           )}

//           {/* Download */}
//           <button
//             type="button"
//             onClick={onDownload}
//             title="Download"
//             className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-green-600 hover:text-green-700"
//           >
//             <Download size={18} />
//           </button>

//           {/* Toggle */}
//           <button
//             type="button"
//             onClick={onToggle}
//             title={file.isPublic ? "Make Private" : "Make Public"}
//             className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-amber-600 hover:text-amber-700"
//           >
//             {file.isPublic ? <Lock size={18} /> : <Globe size={18} />}
//           </button>

//           {/* Delete */}
//           <button
//             type="button"
//             onClick={onDelete}
//             title="Delete"
//             className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-red-600 hover:text-red-700"
//           >
//             <Trash2 size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileCard;

import React, { useEffect, useRef, useState } from "react";
import {
  Copy,
  Download,
  Eye,
  File,
  FileIcon,
  FileText,
  Globe,
  Image as ImageIcon,
  Lock,
  MoreVertical,
  Music,
  Share2,
  Trash2,
  Video,
} from "lucide-react";

const FileCard = ({
  file,
  isOwner = false,
  onToggle,
  onDelete,
  onShare,
  onDownload,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // =========================
  // CLOSE MENU OUTSIDE CLICK
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  // FILE EXTENSION
  // =========================
  const getExtension = () => {
    if (!file?.name) return "";

    return file.name.split(".").pop().toLowerCase();
  };

  const extension = getExtension();

  // =========================
  // GET FILE URL
  // Change according to your backend
  // =========================
  const previewUrl =
    file.previewUrl ||
    file.fileUrl ||
    file.downloadUrl ||
    file.url ||
    file.path ||
    null;

  // =========================
  // FILE TYPE CHECKS
  // =========================
  const isImage = ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(
    extension,
  );

  const isVideo = ["mp4", "avi", "mov", "mkv", "wmv", "webm"].includes(
    extension,
  );

  const isAudio = ["mp3", "wav", "ogg", "flac", "m4a", "aac"].includes(
    extension,
  );

  const isPdf = extension === "pdf";

  const isDocument = [
    "doc",
    "docx",
    "txt",
    "rtf",
    "xls",
    "xlsx",
    "csv",
    "ppt",
    "pptx",
  ].includes(extension);

  // =========================
  // FILE ICON
  // =========================
  const getFileIcon = () => {
    if (isAudio) {
      return <Music size={50} className="text-green-500" />;
    }

    if (isPdf) {
      return <FileText size={50} className="text-red-500" />;
    }

    if (isDocument) {
      return <FileText size={50} className="text-blue-500" />;
    }

    if (isVideo) {
      return <Video size={50} className="text-blue-500" />;
    }

    if (isImage) {
      return <ImageIcon size={50} className="text-red-500" />;
    }

    return <FileIcon size={50} className="text-purple-500" />;
  };

  // =========================
  // FORMAT FILE SIZE
  // =========================
  const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) {
      return "Unknown size";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================
  // COPY LINK
  // =========================
  const handleCopyLink = async () => {
    const link = `${window.location.origin}/files/${file.id}`;

    try {
      await navigator.clipboard.writeText(link);
    } catch (error) {
      console.error("Could not copy link:", error);
    }

    setShowMenu(false);

    if (onShare) {
      onShare(file);
    }
  };

  // =========================
  // MENU ACTION
  // =========================
  const handleMenuAction = (callback) => {
    setShowMenu(false);

    if (callback) {
      callback(file);
    }
  };

  // =========================
  // RENDER FILE PREVIEW
  // =========================
  const renderPreview = () => {
    // ---------------------------------
    // IMAGE PREVIEW
    // ---------------------------------
    if (isImage && previewUrl) {
      return (
        <div className="relative w-full h-full bg-gray-100">
          <img
            src={previewUrl}
            alt={file.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Bottom fade like Google Drive */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      );
    }

    // ---------------------------------
    // VIDEO PREVIEW
    // ---------------------------------
    if (isVideo && previewUrl) {
      return (
        <div className="relative w-full h-full bg-black overflow-hidden">
          <video
            src={previewUrl}
            preload="metadata"
            muted
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Video size={22} className="text-purple-600" />
            </div>
          </div>
        </div>
      );
    }

    // ---------------------------------
    // PDF PREVIEW - ONLY OWNER
    // ---------------------------------
    if (isPdf && previewUrl && isOwner) {
      return (
        <div className="relative w-full h-full bg-gray-200 overflow-hidden">
          <iframe
            src={`${previewUrl}#page=1&toolbar=0&navpanes=0`}
            title={file.name}
            className="absolute top-0 left-0 w-full h-[600px] border-0 pointer-events-none"
          />

          {/* Fade bottom to show partial preview */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-100 via-gray-100/80 to-transparent" />

          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-gray-600 shadow-sm">
            Preview
          </div>
        </div>
      );
    }

    // ---------------------------------
    // TEXT FILE PREVIEW - ONLY OWNER
    // Requires file.previewText from backend
    // ---------------------------------
    if (extension === "txt" && file.previewText && isOwner) {
      return (
        <div className="relative w-full h-full bg-white overflow-hidden p-4">
          <div className="font-mono text-[10px] leading-relaxed text-gray-600 whitespace-pre-wrap">
            {file.previewText.substring(0, 700)}
          </div>

          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />

          <div className="absolute bottom-2 right-2 bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-500">
            Preview
          </div>
        </div>
      );
    }

    // ---------------------------------
    // DOCUMENT STYLE PARTIAL PREVIEW
    // DOC, DOCX, EXCEL, PPT, ETC.
    // ONLY OWNER
    // ---------------------------------
    if (isDocument && isOwner) {
      return (
        <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden p-4">
          {/* Fake document sheet */}
          <div className="absolute top-4 left-6 right-6 min-h-[250px] bg-white border border-gray-200 rounded-t-md shadow-sm p-4">
            {/* Document heading */}
            <div className="w-20 h-2.5 bg-blue-200 rounded mb-4" />

            {/* Document lines */}
            <div className="space-y-2">
              <div className="w-full h-1.5 bg-gray-200 rounded" />
              <div className="w-11/12 h-1.5 bg-gray-200 rounded" />
              <div className="w-full h-1.5 bg-gray-200 rounded" />
              <div className="w-9/12 h-1.5 bg-gray-200 rounded" />

              <div className="w-full h-1.5 bg-gray-200 rounded mt-4" />
              <div className="w-10/12 h-1.5 bg-gray-200 rounded" />
              <div className="w-full h-1.5 bg-gray-200 rounded" />
              <div className="w-8/12 h-1.5 bg-gray-200 rounded" />

              <div className="w-full h-1.5 bg-gray-200 rounded mt-4" />
              <div className="w-9/12 h-1.5 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-200 to-transparent" />

          <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs text-gray-500 shadow-sm">
            Owner preview
          </div>
        </div>
      );
    }

    // ---------------------------------
    // AUDIO FILE
    // ---------------------------------
    if (isAudio) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center">
            <Music size={42} className="text-green-500" />
          </div>

          <div className="flex items-end gap-1 h-6 mt-4">
            <span className="w-1 h-2 bg-green-400 rounded" />
            <span className="w-1 h-5 bg-green-500 rounded" />
            <span className="w-1 h-3 bg-green-400 rounded" />
            <span className="w-1 h-6 bg-green-500 rounded" />
            <span className="w-1 h-4 bg-green-400 rounded" />
            <span className="w-1 h-2 bg-green-500 rounded" />
            <span className="w-1 h-5 bg-green-400 rounded" />
          </div>
        </div>
      );
    }

    // ---------------------------------
    // DEFAULT FILE
    // ---------------------------------
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center">
          {getFileIcon()}
        </div>

        <span className="mt-3 text-xs font-medium uppercase text-gray-400">
          {extension || "FILE"}
        </span>
      </div>
    );
  };

  // =========================
  // COMPONENT
  // =========================
  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200 overflow-visible">
      {/* ================= PREVIEW AREA ================= */}
      <div className="relative h-48 bg-gray-100 rounded-t-xl overflow-hidden">
        {renderPreview()}

        {/* PUBLIC / PRIVATE BADGE */}
        <div className="absolute top-3 left-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm backdrop-blur-md ${
              file.isPublic ? "bg-green-100/90" : "bg-white/90"
            }`}
            title={file.isPublic ? "Public" : "Private"}
          >
            {file.isPublic ? (
              <Globe size={16} className="text-green-600" />
            ) : (
              <Lock size={16} className="text-gray-600" />
            )}
          </div>
        </div>

        {/* FILE TYPE BADGE */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md rounded-lg px-2 py-1 shadow-sm">
          <span className="text-xs font-semibold uppercase text-gray-600">
            {extension || "FILE"}
          </span>
        </div>
      </div>

      {/* ================= FILE INFORMATION ================= */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Small Icon */}
          <div className="shrink-0 mt-0.5">
            {isImage ? (
              <ImageIcon size={22} className="text-red-500" />
            ) : isVideo ? (
              <Video size={22} className="text-blue-500" />
            ) : isAudio ? (
              <Music size={22} className="text-green-500" />
            ) : (
              <File size={22} className="text-purple-500" />
            )}
          </div>

          {/* FILE NAME */}
          <div className="flex-1 min-w-0">
            <h3
              title={file.name}
              className="font-medium text-gray-800 truncate"
            >
              {file.name}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(file.size)}

              {file.uploadedAt && (
                <>
                  <span className="mx-1">•</span>
                  {formatDate(file.uploadedAt)}
                </>
              )}
            </p>
          </div>

          {/* ================= THREE DOT MENU ================= */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              title="More options"
            >
              <MoreVertical size={20} className="text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-11 z-50 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-2 overflow-hidden">
                {/* VIEW */}
                {file.isPublic && (
                  <a
                    href={`/files/${file.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Eye size={18} />
                    View
                  </a>
                )}

                {/* SHARE */}
                {file.isPublic && (
                  <button
                    type="button"
                    onClick={() => handleMenuAction(onShare)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                )}

                {/* COPY LINK */}
                {file.isPublic && (
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Copy size={18} />
                    Copy link
                  </button>
                )}

                {/* DOWNLOAD */}
                <button
                  type="button"
                  onClick={() => handleMenuAction(onDownload)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Download size={18} />
                  Download
                </button>

                <div className="border-t border-gray-100 my-2" />

                {/* PUBLIC / PRIVATE */}
                <button
                  type="button"
                  onClick={() => handleMenuAction(onToggle)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {file.isPublic ? <Lock size={18} /> : <Globe size={18} />}

                  {file.isPublic ? "Make private" : "Make public"}
                </button>

                <div className="border-t border-gray-100 my-2" />

                {/* DELETE */}
                <button
                  type="button"
                  onClick={() => handleMenuAction(onDelete)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
