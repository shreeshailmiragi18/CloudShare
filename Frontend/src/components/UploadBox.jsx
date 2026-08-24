import React, { useRef, useState } from "react";
import {
  UploadCloud,
  File,
  X,
  Trash2,
  Image as ImageIcon,
  FileText,
  Music,
  Video,
  Loader2,
  AlertCircle,
} from "lucide-react";

const UploadBox = ({
  files = [],
  onFileChange,
  onRemoveFile,
  onUpload,
  remainingCredits = 0,
  isUploadDisabled = false,
  uploading = false,
  maxFiles = 5,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // =====================================
  // GET FILE ICON
  // =====================================
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return <ImageIcon size={22} className="text-purple-500" />;
    }

    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
      return <FileText size={22} className="text-red-500" />;
    }

    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return <Music size={22} className="text-green-500" />;
    }

    if (["mp4", "mov", "avi", "mkv", "webm"].includes(extension)) {
      return <Video size={22} className="text-blue-500" />;
    }

    return <File size={22} className="text-gray-500" />;
  };

  // =====================================
  // FORMAT FILE SIZE
  // =====================================
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";

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

  // =====================================
  // OPEN FILE SELECTOR
  // =====================================
  const handleBrowseClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  // =====================================
  // SELECT FILES
  // IMPORTANT:
  // Pass event.target.files directly
  // =====================================
  const handleInputChange = (event) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      onFileChange(selectedFiles);
    }

    // Reset input so same file can be selected again
    event.target.value = "";
  };

  // =====================================
  // DRAG OVER
  // =====================================
  const handleDragOver = (event) => {
    event.preventDefault();

    if (!uploading) {
      setIsDragging(true);
    }
  };

  // =====================================
  // DRAG LEAVE
  // =====================================
  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  // =====================================
  // DROP FILES
  // =====================================
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (uploading) return;

    const droppedFiles = event.dataTransfer.files;

    if (droppedFiles && droppedFiles.length > 0) {
      // Pass FileList directly
      onFileChange(droppedFiles);
    }
  };

  const availableSlots = Math.max(0, maxFiles - files.length);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* ================================
          UPLOAD AREA
      ================================= */}
      <div
        onClick={handleBrowseClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative rounded-2xl border-2 border-dashed
          p-8 sm:p-12 text-center
          transition-all duration-200
          cursor-pointer
          ${
            isDragging
              ? "border-purple-500 bg-purple-50 scale-[1.01]"
              : "border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50/30"
          }
          ${uploading ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleInputChange}
          disabled={uploading}
        />

        <div className="flex flex-col items-center">
          <div
            className={`
              w-16 h-16 rounded-full
              flex items-center justify-center
              mb-4 transition-colors
              ${isDragging ? "bg-purple-200" : "bg-purple-100"}
            `}
          >
            <UploadCloud size={32} className="text-purple-600" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Upload your files
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Drag and drop your files here, or click to browse
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Maximum {maxFiles} files at a time
          </p>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleBrowseClick();
            }}
            disabled={uploading}
            className="mt-5 px-5 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select Files
          </button>
        </div>
      </div>

      {/* ================================
          FILE COUNT AND CREDITS
      ================================= */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-gray-600">
          Selected:{" "}
          <span className="font-semibold text-gray-900">
            {files.length} / {maxFiles}
          </span>
          {availableSlots > 0 && (
            <span className="ml-2 text-gray-400">
              ({availableSlots} slot
              {availableSlots !== 1 ? "s" : ""} remaining)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Remaining Credits:</span>

          <span
            className={`
              px-3 py-1 rounded-full font-semibold
              ${
                remainingCredits > 0
                  ? "bg-purple-100 text-purple-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {remainingCredits}
          </span>
        </div>
      </div>

      {/* ================================
          SELECTED FILES
      ================================= */}
      {files.length > 0 && (
        <div className="mt-5 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Selected Files</h3>

            <span className="text-sm text-gray-500">
              {files.length} file
              {files.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                {/* File Information */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                    {getFileIcon(file.name)}
                  </div>

                  <div className="min-w-0">
                    <p
                      title={file.name}
                      className="font-medium text-gray-800 truncate"
                    >
                      {file.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  disabled={uploading}
                  title="Remove file"
                  className="flex-shrink-0 p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================
          NO CREDITS WARNING
      ================================= */}
      {remainingCredits <= 0 && (
        <div className="mt-5 flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
          <AlertCircle size={20} />

          <p className="text-sm">
            You don't have enough credits to upload files.
          </p>
        </div>
      )}

      {/* ================================
          UPLOAD BUTTON
      ================================= */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onUpload}
          disabled={isUploadDisabled}
          className={`
            min-w-40 px-6 py-3 rounded-lg
            flex items-center justify-center gap-2
            font-medium transition-all
            ${
              isUploadDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg cursor-pointer"
            }
          `}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud size={20} />
              Upload Files
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadBox;
