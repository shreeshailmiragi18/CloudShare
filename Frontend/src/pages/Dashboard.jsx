import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Cloud,
  File,
  Files,
  HardDrive,
  Upload,
  FolderOpen,
  Download,
  Image,
  FileText,
  Music,
  Video,
  FileIcon,
  Loader2,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const API_URL = "http://localhost:8080/api/v1.0";

  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const token = await getToken();

        const [filesResponse, creditsResponse] = await Promise.all([
          axios.get(`${API_URL}/files/my-files`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${API_URL}/users/credits`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setFiles(filesResponse.data || []);
        setCredits(creditsResponse.data?.credits || 0);
      } catch (error) {
        console.error(
          "Error fetching dashboard data:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken]);

  // =========================
  // FILE ICON
  // =========================
  const getFileIcon = (file) => {
    const extension = file.name?.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return <Image size={22} className="text-purple-500" />;
    }

    if (["mp4", "avi", "mov", "mkv", "wmv", "webm"].includes(extension)) {
      return <Video size={22} className="text-blue-500" />;
    }

    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return <Music size={22} className="text-green-500" />;
    }

    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
      return <FileText size={22} className="text-orange-500" />;
    }

    return <FileIcon size={22} className="text-purple-500" />;
  };

  // =========================
  // FORMAT FILE SIZE
  // =========================
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // =========================
  // RECENT FILES
  // =========================
  const recentFiles = [...files]
    .sort(
      (a, b) =>
        new Date(b.uploadedAt || b.createdAt) -
        new Date(a.uploadedAt || a.createdAt),
    )
    .slice(0, 5);

  // =========================
  // FILE STATISTICS
  // =========================
  const publicFiles = files.filter((file) => file.isPublic).length;

  const totalStorage = files.reduce(
    (total, file) => total + (Number(file.size) || 0),
    0,
  );

  const imageFiles = files.filter((file) => {
    const extension = file.name?.split(".").pop()?.toLowerCase();

    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension);
  }).length;

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        {/* =========================
            WELCOME SECTION
        ========================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back 👋</h1>

          <p className="text-gray-500 mt-2">
            Here's an overview of your files and storage.
          </p>
        </div>

        {/* =========================
            STATISTICS CARDS
        ========================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {/* Total Files */}

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Files</p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? "-" : files.length}
                </h2>

                <p className="text-xs text-gray-400 mt-2">
                  Files in your storage
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-100">
                <Files size={23} className="text-purple-600" />
              </div>
            </div>
          </div>

          {/* Storage */}

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Storage Used</p>

                <h2 className="text-2xl font-bold text-gray-800 mt-2">
                  {loading ? "-" : formatFileSize(totalStorage)}
                </h2>

                <p className="text-xs text-gray-400 mt-2">Total storage used</p>
              </div>

              <div className="p-3 rounded-xl bg-blue-100">
                <HardDrive size={23} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Public Files */}

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Shared Files</p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {loading ? "-" : publicFiles}
                </h2>

                <p className="text-xs text-gray-400 mt-2">
                  Files available publicly
                </p>
              </div>

              <div className="p-3 rounded-xl bg-green-100">
                <Cloud size={23} className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Credits */}

          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-5 shadow-md text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-purple-100">Available Credits</p>

                <h2 className="text-3xl font-bold mt-2">
                  {loading ? "-" : credits}
                </h2>

                <p className="text-xs text-purple-100 mt-2">
                  Credits available for uploads
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/15">
                <Cloud size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            QUICK ACTIONS + OVERVIEW
        ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}

          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Quick Actions
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage your files easily
                </p>
              </div>

              <ArrowUpRight size={20} className="text-gray-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/upload")}
                className="group text-left p-5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-100 transition-all hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 flex items-center justify-center bg-purple-600 rounded-xl text-white mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <Upload size={21} />
                </div>

                <h3 className="font-semibold text-gray-800">Upload Files</h3>

                <p className="text-sm text-gray-500 mt-1">
                  Upload new files to CloudShare
                </p>
              </button>

              <button
                onClick={() => navigate("/MyFiles")}
                className="group text-left p-5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 flex items-center justify-center bg-blue-600 rounded-xl text-white mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <FolderOpen size={21} />
                </div>

                <h3 className="font-semibold text-gray-800">My Files</h3>

                <p className="text-sm text-gray-500 mt-1">
                  View and manage all your files
                </p>
              </button>

              <button
                onClick={() => navigate("/subscription")}
                className="group text-left p-5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 flex items-center justify-center bg-indigo-600 rounded-xl text-white mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <Cloud size={21} />
                </div>

                <h3 className="font-semibold text-gray-800">Get Credits</h3>

                <p className="text-sm text-gray-500 mt-1">
                  Upgrade and upload more files
                </p>
              </button>
            </div>
          </div>

          {/* Storage Overview */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <HardDrive size={20} className="text-purple-600" />

              <h2 className="text-lg font-semibold text-gray-800">
                Storage Overview
              </h2>
            </div>

            <div className="flex justify-center my-5">
              <div className="w-32 h-32 rounded-full border-[12px] border-purple-100 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-800">
                  {formatFileSize(totalStorage)}
                </span>

                <span className="text-xs text-gray-500 mt-1">Used</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Documents</span>

                <span className="font-medium text-gray-700">
                  {files.length - imageFiles} files
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Images</span>

                <span className="font-medium text-gray-700">
                  {imageFiles} files
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shared</span>

                <span className="font-medium text-gray-700">
                  {publicFiles} files
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            RECENT FILES
        ========================= */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}

          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-purple-600" />

                <h2 className="text-xl font-semibold text-gray-800">
                  Recent Files
                </h2>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Your recently uploaded files
              </p>
            </div>

            <button
              onClick={() => navigate("/MyFiles")}
              className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
            >
              View All
            </button>
          </div>

          {/* Loading */}

          {loading ? (
            <div className="h-56 flex flex-col items-center justify-center text-gray-500">
              <Loader2
                size={28}
                className="animate-spin text-purple-600 mb-3"
              />

              <p>Loading your files...</p>
            </div>
          ) : recentFiles.length === 0 ? (
            /* Empty State */

            <div className="p-10 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                <File size={30} className="text-purple-500" />
              </div>

              <h3 className="font-semibold text-gray-700">No files yet</h3>

              <p className="text-sm text-gray-500 mt-2">
                Upload your first file to see it here.
              </p>

              <button
                onClick={() => navigate("/upload")}
                className="mt-5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
              >
                Upload Your First File
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        File
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Size
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Uploaded
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {recentFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="hover:bg-purple-50/40 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                              {getFileIcon(file)}
                            </div>

                            <div className="min-w-0">
                              <p
                                className="font-medium text-gray-800 truncate max-w-[280px]"
                                title={file.name}
                              >
                                {file.name}
                              </p>

                              <p className="text-xs text-gray-500 mt-0.5">
                                {file.isPublic ? "Public file" : "Private file"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatFileSize(file.size)}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {file.uploadedAt || file.createdAt
                            ? new Date(
                                file.uploadedAt || file.createdAt,
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate("/my-files")}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors"
                            title="Manage Files"
                          >
                            <Download size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}

              <div className="md:hidden divide-y divide-gray-100">
                {recentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gray-50 flex items-center justify-center">
                        {getFileIcon(file)}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {file.name}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/my-files")}
                      className="text-purple-600"
                    >
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
