import React, { useState } from "react";
import { Copy, X, Check } from "lucide-react";

const ShareLinkDialog = ({ isOpen, onClose, link, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);

      setCopied(true);

      // Optional: reset back to copy icon after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Share File</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-600 mb-5">
            Share this link with others to give them access to this file:
          </p>

          {/* Link + Copy Button */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={link}
              readOnly
              onClick={(e) => e.target.select()}
              className="flex-1 min-w-0 px-3 py-2.5 border-2 border-purple-500 rounded-lg outline-none text-sm text-gray-700"
            />

            <button
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy Link"}
              className={`flex-shrink-0 p-2.5 rounded-lg transition-all duration-200 ${
                copied
                  ? "bg-green-100 text-green-600"
                  : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              {copied ? <Check size={22} /> : <Copy size={22} />}
            </button>
          </div>

          {/* Copied Message */}
          {copied && (
            <p className="flex items-center gap-1.5 text-sm text-green-700 mt-4">
              <Check size={16} />
              Link copied to clipboard!
            </p>
          )}

          <p className={`text-sm text-gray-500 ${copied ? "mt-4" : "mt-4"}`}>
            Anyone with this link can access this file.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleCopy}
            className={`px-5 py-2.5 text-white rounded-lg shadow-sm transition-colors ${
              copied
                ? "bg-green-700 hover:bg-green-800"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareLinkDialog;
