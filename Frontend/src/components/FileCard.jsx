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
import {
  Copy,
  Eye,
  FileIcon,
  FileText,
  Globe,
  Image,
  Lock,
  Music,
  Video,
  Download,
  Trash2,
} from "lucide-react";
import React from "react";

const FileCard = ({ file, onToggle, onDelete, onShare, onDownload }) => {
  const [showActions, setShowActions] = React.useState(false);

  const getFileIcon = () => {
    const extension = file.name.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return <Image size={24} className="text-purple-500" />;
    }

    if (["mp4", "avi", "mov", "mkv", "wmv", "webm"].includes(extension)) {
      return <Video size={24} className="text-blue-500" />;
    }

    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return <Music size={24} className="text-green-500" />;
    }

    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
      return <FileText size={24} className="text-amber-500" />;
    }

    return <FileIcon size={24} className="text-purple-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1073741824) {
      return (bytes / 1048576).toFixed(2) + " MB";
    } else {
      return (bytes / 1073741824).toFixed(2) + " GB";
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className="relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all border border-gray-100"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* File Icon */}
      <div className="h-32 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
        {getFileIcon()}
      </div>

      {/* Public / Private Badge */}
      <div className="absolute top-2 right-2">
        <button
          type="button"
          onClick={onToggle}
          className={`rounded-full p-1.5 cursor-pointer ${
            file.isPublic ? "bg-green-100" : "bg-gray-100"
          }`}
          title={file.isPublic ? "Make Private" : "Make Public"}
        >
          {file.isPublic ? (
            <Globe size={14} className="text-green-600" />
          ) : (
            <Lock size={14} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* File Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="overflow-hidden">
            <h3
              title={file.name}
              className="font-medium text-gray-900 truncate"
            >
              {file.name}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(file.size)} · {formatDate(file.uploadedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${
          showActions ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex gap-3 w-full justify-center">
          {/* Share */}
          {file.isPublic && (
            <button
              type="button"
              onClick={onShare}
              title="Share Link"
              className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-purple-500 hover:text-purple-600"
            >
              <Copy size={18} />
            </button>
          )}

          {/* View */}
          {file.isPublic && (
            <a
              href={`/files/${file.id}`}
              target="_blank"
              rel="noopener noreferrer"
              title="View File"
              className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-gray-700 hover:text-gray-900"
            >
              <Eye size={18} />
            </a>
          )}

          {/* Download */}
          <button
            type="button"
            onClick={onDownload}
            title="Download"
            className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-green-600 hover:text-green-700"
          >
            <Download size={18} />
          </button>

          {/* Toggle */}
          <button
            type="button"
            onClick={onToggle}
            title={file.isPublic ? "Make Private" : "Make Public"}
            className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-amber-600 hover:text-amber-700"
          >
            {file.isPublic ? <Lock size={18} /> : <Globe size={18} />}
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            title="Delete"
            className="p-2 bg-white/90 cursor-pointer rounded-full hover:bg-white transition-colors text-red-600 hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
