import {
  FileIcon,
  FileText,
  Globe,
  Image,
  Lock,
  Music,
  Video,
} from "lucide-react";
import React from "react";

const FileCard = ({ file }) => {
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
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
    else return (bytes / 1073741824).toFixed(2) + " GB";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div
      className="relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all border border-gray-100"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="h-32 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
        {getFileIcon()}
      </div>
      {/* public/private badge */}
      <div className="absolute top-2 right-2">
        <div
          className={`rounded-full p-1.5 ${file.isPublic ? "bg-green-100" : "bg-gray-100"}`}
          title={file.isPublic ? "Public" : "Private"}
        >
          {file.isPublic ? (
            <Globe size={14} className="text-green-600" />
          ) : (
            <Lock size={14} className="text-gray-500" />
          )}
        </div>
      </div>
      {/* file info */}
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
              {formatFileSize(file.size)} . {formatDate(file.uploadedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
