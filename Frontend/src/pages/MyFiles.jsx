import {
  Copy,
  Download,
  File,
  Globe,
  Grid,
  List,
  Lock,
  Trash2,
  Eye,
  FileText,
  Image,
  Music,
  Video,
  FileIcon,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import FileCard from "../components/FileCard";
import ConfirmationDialog from "../components/ConfirmationDialog";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [view, setView] = useState("list");
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    try {
      const token = await getToken();
      await axios.delete(
        `http://localhost:8080/api/v1.0/files/${fileToDelete.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFiles(files.filter((file) => file.id !== fileToDelete.id));
      toast.success(`File "${fileToDelete.name}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting file: ", error);
      toast.error("Failed to delete file. Please try again later.");
    } finally {
      setIsDialogOpen(false);
      setFileToDelete(null);
    }
  };
  const getFileIcon = (file) => {
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

  const fetchFiles = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        "http://localhost:8080/api/v1.0/files/my-files",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 200) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error("Error fetching files from server: ", error);
      toast.error("Failed to fetch files. Please try again later.");
    }
  };

  //toggle status of file between public and private
  const toggleFileStatus = async (fileToUpdate) => {
    try {
      const token = await getToken();
      const response = await axios.patch(
        `http://localhost:8080/api/v1.0/files/${fileToUpdate.id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
        setFiles(
          files.map((file) =>
            file.id === fileToUpdate.id
              ? { ...file, isPublic: !file.isPublic }
              : file,
          ),
        ),
      );
    } catch (error) {
      console.error("Error toggling file status: ", error);
      toast.error("Failed to toggle file status. Please try again later.");
    }
  };

  //handle download file
  const handleDownload = async (file) => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:8080/api/v1.0/files/download/${file.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file: ", error);
      toast.error("Failed to download file. Please try again later.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [getToken]);

  return (
    <DashboardLayout activeMenu="My Files">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Files {files.length}</h2>
          <div className="flex items-center gap-3">
            <List
              onClick={() => setView("list")}
              size={24}
              className={`cursor-pointer transition-colors ${view === "list" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            />
            <Grid
              size={24}
              onClick={() => setView("grid")}
              className={`cursor-pointer transition-colors ${view === "grid" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            />
          </div>
        </div>
        {files.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
            <File size={60} className="text-purple-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No files uploaded yet.
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              You haven't uploaded any files yet. Start by uploading your files
              to see them here. Don't worry, your files are safe and secure with
              us. You can upload files anytime and access them from anywhere.
            </p>
            <button
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              onClick={() => navigate("/upload")}
            >
              Upload Files
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sharing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {files.map((file) => (
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file)}
                        {file.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {(file.size / 1024).toFixed(2)} KB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleFileStatus(file)}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          {file.isPublic ? (
                            <>
                              <Globe size={16} className="text-green-600" />
                              <span className="group-hover:underline">
                                Public
                              </span>
                            </>
                          ) : (
                            <>
                              <Lock size={16} className="text-gray-500" />
                              <span className="group-hover:underline">
                                Private
                              </span>
                            </>
                          )}
                        </button>
                        {file.isPublic && (
                          <button className="flex items-center gap-2 cursor-pointer group text-blue-600">
                            <Copy size={16} />
                            <span className="group-hover:underline">
                              Share Link
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDownload(file)}
                            title="Download"
                            className="text-gray-500 hover:text-blue-600"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                        <div className="flex justify-center">
                          <button
                            onClick={() => {
                              setFileToDelete(file);
                              setIsDialogOpen(true);
                            }}
                            title="Delete"
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="flex justify-center">
                          {file.isPublic ? (
                            <a
                              href={`/files/${file.id}`}
                              target="_blank"
                              title="View File"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-blue-600"
                            >
                              <Eye size={18} />
                            </a>
                          ) : (
                            <span className=" w-[18px]"></span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${fileToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteFile}
          confirmationButtonClass="bg-red-600 hover:bg-red-700"
        />
      </div>
    </DashboardLayout>
  );
};

export default MyFiles;
