// import {
//   Copy,
//   Download,
//   File,
//   Globe,
//   Grid,
//   List,
//   Lock,
//   Trash2,
//   Eye,
//   FileText,
//   Image,
//   Music,
//   Video,
//   FileIcon,
// } from "lucide-react";
// import DashboardLayout from "../layout/DashboardLayout";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@clerk/clerk-react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// import FileCard from "../components/FileCard";
// import ConfirmationDialog from "../components/ConfirmationDialog";
// import ShareLinkDialog from "../components/ShareLinkDialog";

// const MyFiles = () => {
//   // =========================
//   // STATES
//   // =========================

//   const [files, setFiles] = useState([]);
//   const [view, setView] = useState("list");

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [fileToDelete, setFileToDelete] = useState(null);

//   const [sharedLink, setSharedLink] = useState({
//     isOpen: false,
//     file: null,
//     link: "",
//   });

//   const { getToken } = useAuth();
//   const navigate = useNavigate();

//   // =========================
//   // COPY LINK
//   // =========================

//   const handleCopyLink = (link) => {
//     navigator.clipboard.writeText(link).then(
//       () => {
//         toast.success("Link copied to clipboard!");
//       },
//       (err) => {
//         console.error("Could not copy text:", err);
//         toast.error("Failed to copy link. Please try again.");
//       },
//     );
//   };

//   // =========================
//   // FETCH FILES
//   // =========================

//   const fetchFiles = async () => {
//     try {
//       const token = await getToken();

//       const response = await axios.get(
//         "http://localhost:8080/api/v1.0/files/my-files",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (response.status === 200) {
//         setFiles(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching files:", error);
//       toast.error("Failed to fetch files. Please try again later.");
//     }
//   };

//   // =========================
//   // TOGGLE PUBLIC / PRIVATE
//   // =========================

//   const toggleFile = async (fileToUpdate) => {
//     try {
//       const token = await getToken();

//       await axios.patch(
//         `http://localhost:8080/api/v1.0/files/${fileToUpdate.id}/toggle-status`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       // Update UI after successful API call
//       setFiles((prevFiles) =>
//         prevFiles.map((file) =>
//           file.id === fileToUpdate.id
//             ? {
//                 ...file,
//                 isPublic: !file.isPublic,
//               }
//             : file,
//         ),
//       );

//       toast.success(
//         `File is now ${fileToUpdate.isPublic ? "private" : "public"}`,
//       );
//     } catch (error) {
//       console.error("Error toggling file status:", error);
//       toast.error("Failed to toggle file status.");
//     }
//   };

//   // =========================
//   // OPEN DELETE DIALOG
//   // =========================

//   const deleteFile = (file) => {
//     setFileToDelete(file);
//     setIsDialogOpen(true);
//   };

//   // =========================
//   // ACTUAL DELETE API CALL
//   // =========================

//   const handleDeleteFile = async () => {
//     if (!fileToDelete) return;

//     try {
//       const token = await getToken();

//       await axios.delete(
//         `http://localhost:8080/api/v1.0/files/${fileToDelete.id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       // Remove deleted file from UI
//       setFiles((prevFiles) =>
//         prevFiles.filter((file) => file.id !== fileToDelete.id),
//       );

//       toast.success(`File "${fileToDelete.name}" deleted successfully.`);
//     } catch (error) {
//       console.error("Error deleting file:", error);
//       toast.error("Failed to delete file. Please try again later.");
//     } finally {
//       setIsDialogOpen(false);
//       setFileToDelete(null);
//     }
//   };

//   // =========================
//   // SHARE FILE
//   // =========================

//   const shareFile = (file) => {
//     if (!file.isPublic) {
//       toast.error("Make the file public before sharing it.");
//       return;
//     }

//     setSharedLink({
//       isOpen: true,
//       file: file,
//       link: `${window.location.origin}/files/${file.id}`,
//     });
//   };

//   // =========================
//   // DOWNLOAD FILE
//   // =========================

//   const downloadFile = async (file) => {
//     try {
//       const token = await getToken();

//       const response = await axios.get(
//         `http://localhost:8080/api/v1.0/files/download/${file.id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           responseType: "blob",
//         },
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));

//       const downloadLink = document.createElement("a");

//       downloadLink.href = url;
//       downloadLink.setAttribute("download", file.name);

//       document.body.appendChild(downloadLink);
//       downloadLink.click();

//       downloadLink.remove();
//       window.URL.revokeObjectURL(url);

//       toast.success("File downloaded successfully!");
//     } catch (error) {
//       console.error("Error downloading file:", error);
//       toast.error("Failed to download file.");
//     }
//   };

//   // =========================
//   // FILE ICON
//   // =========================

//   const getFileIcon = (file) => {
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

//   // =========================
//   // FETCH FILES ON LOAD
//   // =========================

//   useEffect(() => {
//     fetchFiles();
//   }, [getToken]);

//   return (
//     <DashboardLayout activeMenu="My Files">
//       <div className="p-6">
//         {/* =========================
//             HEADER
//         ========================= */}

//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">My Files {files.length}</h2>

//           <div className="flex items-center gap-3">
//             <List
//               onClick={() => setView("list")}
//               size={24}
//               className={`cursor-pointer transition-colors ${
//                 view === "list"
//                   ? "text-blue-600"
//                   : "text-gray-400 hover:text-gray-600"
//               }`}
//             />

//             <Grid
//               onClick={() => setView("grid")}
//               size={24}
//               className={`cursor-pointer transition-colors ${
//                 view === "grid"
//                   ? "text-blue-600"
//                   : "text-gray-400 hover:text-gray-600"
//               }`}
//             />
//           </div>
//         </div>

//         {/* =========================
//             EMPTY STATE
//         ========================= */}

//         {files.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
//             <File size={60} className="text-purple-300 mb-4" />

//             <h3 className="text-xl font-medium text-gray-700 mb-2">
//               No files uploaded yet.
//             </h3>

//             <p className="text-gray-500 text-center max-w-md mb-6">
//               You haven't uploaded any files yet. Start by uploading your files
//               to see them here.
//             </p>

//             <button
//               className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
//               onClick={() => navigate("/upload")}
//             >
//               Upload Files
//             </button>
//           </div>
//         ) : view === "grid" ? (
//           /* =========================
//               GRID VIEW
//           ========================= */

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {files.map((file) => (
//               <FileCard
//                 key={file.id}
//                 file={file}
//                 onToggle={() => toggleFile(file)}
//                 onDelete={() => deleteFile(file)}
//                 onShare={() => shareFile(file)}
//                 onDownload={() => downloadFile(file)}
//               />
//             ))}
//           </div>
//         ) : (
//           /* =========================
//               LIST VIEW
//           ========================= */

//           <div className="overflow-x-auto bg-white rounded-lg shadow">
//             <table className="min-w-full">
//               {/* TABLE HEADER */}

//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Size
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Uploaded
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Sharing
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               {/* TABLE BODY */}

//               <tbody className="divide-y divide-gray-200">
//                 {files.map((file) => (
//                   <tr
//                     key={file.id}
//                     className="hover:bg-gray-50 transition-colors"
//                   >
//                     {/* NAME */}

//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
//                       <div className="flex items-center gap-2">
//                         {getFileIcon(file)}
//                         {file.name}
//                       </div>
//                     </td>

//                     {/* SIZE */}

//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                       {(file.size / 1024).toFixed(2)} KB
//                     </td>

//                     {/* UPLOADED DATE */}

//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                       {new Date(file.uploadedAt).toLocaleDateString()}
//                     </td>

//                     {/* SHARING */}

//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                       <div className="flex items-center gap-4">
//                         {/* TOGGLE */}

//                         <button
//                           onClick={() => toggleFile(file)}
//                           className="flex items-center gap-2 cursor-pointer group"
//                         >
//                           {file.isPublic ? (
//                             <>
//                               <Globe size={16} className="text-green-600" />

//                               <span className="group-hover:underline">
//                                 Public
//                               </span>
//                             </>
//                           ) : (
//                             <>
//                               <Lock size={16} className="text-gray-500" />

//                               <span className="group-hover:underline">
//                                 Private
//                               </span>
//                             </>
//                           )}
//                         </button>

//                         {/* SHARE */}

//                         {file.isPublic && (
//                           <button
//                             onClick={() => shareFile(file)}
//                             className="flex items-center gap-2 cursor-pointer group text-blue-600"
//                           >
//                             <Copy size={16} />

//                             <span className="group-hover:underline">
//                               Share Link
//                             </span>
//                           </button>
//                         )}
//                       </div>
//                     </td>

//                     {/* ACTIONS */}

//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="grid grid-cols-3 gap-4">
//                         {/* DOWNLOAD */}

//                         <div className="flex justify-center">
//                           <button
//                             onClick={() => downloadFile(file)}
//                             title="Download"
//                             className="text-gray-500 hover:text-blue-600"
//                           >
//                             <Download size={18} />
//                           </button>
//                         </div>

//                         {/* DELETE */}

//                         <div className="flex justify-center">
//                           <button
//                             onClick={() => deleteFile(file)}
//                             title="Delete"
//                             className="text-gray-500 hover:text-red-600"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>

//                         {/* VIEW */}

//                         <div className="flex justify-center">
//                           {file.isPublic ? (
//                             <a
//                               href={`/files/${file.id}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               title="View File"
//                               className="text-gray-500 hover:text-blue-600"
//                             >
//                               <Eye size={18} />
//                             </a>
//                           ) : (
//                             <span className="w-[18px]" />
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* =========================
//             DELETE CONFIRMATION DIALOG
//         ========================= */}

//         <ConfirmationDialog
//           isOpen={isDialogOpen}
//           onClose={() => {
//             setIsDialogOpen(false);
//             setFileToDelete(null);
//           }}
//           title="Confirm Deletion"
//           message={`Are you sure you want to delete "${fileToDelete?.name}"? This action cannot be undone.`}
//           confirmText="Delete"
//           cancelText="Cancel"
//           onConfirm={handleDeleteFile}
//           confirmationButtonClass="bg-red-600 hover:bg-red-700"
//         />

//         {/* =========================
//             SHARE LINK DIALOG
//         ========================= */}

//         <ShareLinkDialog
//           isOpen={sharedLink.isOpen}
//           onClose={() =>
//             setSharedLink({
//               isOpen: false,
//               file: null,
//               link: "",
//             })
//           }
//           link={sharedLink.link}
//           onCopy={handleCopyLink}
//         />
//       </div>
//     </DashboardLayout>
//   );
// };

// export default MyFiles;

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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-hot-toast";

import FileCard from "../components/FileCard";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ShareLinkDialog from "../components/ShareLinkDialog";

const MyFiles = () => {
  // =========================
  // STATES
  // =========================

  const [files, setFiles] = useState([]);
  const [view, setView] = useState("list");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const [sharedLink, setSharedLink] = useState({
    isOpen: false,
    file: null,
    link: "",
  });

  const { getToken } = useAuth();
  const navigate = useNavigate();

  // =========================
  // COPY LINK
  // =========================

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Could not copy text:", error);
      toast.error("Failed to copy link. Please try again.");
    }
  };

  // =========================
  // FETCH FILES
  // =========================

  const fetchFiles = async () => {
    try {
      const token = await getToken();

      const response = await axios.get(
        "http://localhost:8080/api/v1.0/files/my-files",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to fetch files. Please try again later.");
    }
  };

  // =========================
  // TOGGLE PUBLIC / PRIVATE
  // =========================

  const toggleFile = async (fileToUpdate) => {
    try {
      const token = await getToken();

      await axios.patch(
        `http://localhost:8080/api/v1.0/files/${fileToUpdate.id}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileToUpdate.id
            ? {
                ...file,
                isPublic: !file.isPublic,
              }
            : file,
        ),
      );

      toast.success(
        `File is now ${fileToUpdate.isPublic ? "private" : "public"}`,
      );
    } catch (error) {
      console.error("Error toggling file status:", error);
      toast.error("Failed to toggle file status.");
    }
  };

  // =========================
  // OPEN DELETE DIALOG
  // =========================

  const deleteFile = (file) => {
    setFileToDelete(file);
    setIsDialogOpen(true);
  };

  // =========================
  // DELETE FILE
  // =========================

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    try {
      const token = await getToken();

      await axios.delete(
        `http://localhost:8080/api/v1.0/files/${fileToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileToDelete.id),
      );

      toast.success(`File "${fileToDelete.name}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file. Please try again later.");
    } finally {
      setIsDialogOpen(false);
      setFileToDelete(null);
    }
  };

  // =========================
  // SHARE FILE
  // =========================

  const shareFile = (file) => {
    if (!file.isPublic) {
      toast.error("Make the file public before sharing it.");
      return;
    }

    setSharedLink({
      isOpen: true,
      file: file,
      link: `${window.location.origin}/files/${file.id}`,
    });
  };

  // =========================
  // DOWNLOAD FILE
  // =========================

  const downloadFile = async (file) => {
    try {
      const token = await getToken();

      const response = await axios.get(
        `http://localhost:8080/api/v1.0/files/download/${file.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const downloadLink = document.createElement("a");

      downloadLink.href = url;
      downloadLink.setAttribute("download", file.name);

      document.body.appendChild(downloadLink);
      downloadLink.click();

      downloadLink.remove();
      window.URL.revokeObjectURL(url);

      toast.success("File downloaded successfully!");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file.");
    }
  };

  // =========================
  // FILE ICON
  // =========================

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

  // =========================
  // FETCH FILES ON LOAD
  // =========================

  useEffect(() => {
    fetchFiles();
  }, [getToken]);

  return (
    <DashboardLayout activeMenu="My Files">
      <div className="p-6">
        {/* =========================
            HEADER
        ========================= */}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Files {files.length}</h2>

          <div className="flex items-center gap-3">
            <List
              onClick={() => setView("list")}
              size={24}
              className={`cursor-pointer transition-colors ${
                view === "list"
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            />

            <Grid
              onClick={() => setView("grid")}
              size={24}
              className={`cursor-pointer transition-colors ${
                view === "grid"
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            />
          </div>
        </div>

        {/* =========================
            EMPTY STATE
        ========================= */}

        {files.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
            <File size={60} className="text-purple-300 mb-4" />

            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No files uploaded yet.
            </h3>

            <p className="text-gray-500 text-center max-w-md mb-6">
              You haven't uploaded any files yet. Start by uploading your files
              to see them here.
            </p>

            <button
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              onClick={() => navigate("/upload")}
            >
              Upload Files
            </button>
          </div>
        ) : view === "grid" ? (
          /* =========================
              GRID VIEW
          ========================= */

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onToggle={() => toggleFile(file)}
                onDelete={() => deleteFile(file)}
                onShare={() => shareFile(file)}
                onDownload={() => downloadFile(file)}
              />
            ))}
          </div>
        ) : (
          /* =========================
              LIST VIEW
          ========================= */

          <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full table-fixed">
              {/* TABLE HEADER */}

              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-[32%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>

                  <th className="w-[12%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>

                  <th className="w-[18%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>

                  <th className="w-[23%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sharing
                  </th>

                  <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}

              <tbody className="divide-y divide-gray-200">
                {files.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* NAME - FIXED FOR LONG FILE NAMES */}

                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0">{getFileIcon(file)}</div>

                        <span
                          title={file.name}
                          className="block min-w-0 truncate"
                        >
                          {file.name}
                        </span>
                      </div>
                    </td>

                    {/* SIZE */}

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {file.size
                        ? file.size < 1024 * 1024
                          ? `${(file.size / 1024).toFixed(2)} KB`
                          : `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : "0 KB"}
                    </td>

                    {/* UPLOADED */}

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(
                        file.uploadedAt || file.createdAt,
                      ).toLocaleDateString()}
                    </td>

                    {/* SHARING */}

                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-4 whitespace-nowrap">
                        {/* TOGGLE */}

                        <button
                          onClick={() => toggleFile(file)}
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

                        {/* SHARE */}

                        {file.isPublic && (
                          <button
                            onClick={() => shareFile(file)}
                            className="flex items-center gap-2 cursor-pointer group text-blue-600"
                          >
                            <Copy size={16} />

                            <span className="group-hover:underline">
                              Share Link
                            </span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="grid grid-cols-3 gap-2">
                        {/* DOWNLOAD */}

                        <div className="flex justify-center">
                          <button
                            onClick={() => downloadFile(file)}
                            title="Download"
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            <Download size={18} />
                          </button>
                        </div>

                        {/* DELETE */}

                        <div className="flex justify-center">
                          <button
                            onClick={() => deleteFile(file)}
                            title="Delete"
                            className="text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* VIEW */}

                        <div className="flex justify-center">
                          {file.isPublic ? (
                            <a
                              href={`/files/${file.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View File"
                              className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <Eye size={18} />
                            </a>
                          ) : (
                            <span className="w-[18px]" />
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

        {/* =========================
            DELETE CONFIRMATION DIALOG
        ========================= */}

        <ConfirmationDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setFileToDelete(null);
          }}
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${fileToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteFile}
          confirmationButtonClass="bg-red-600 hover:bg-red-700"
        />

        {/* =========================
            SHARE LINK DIALOG
        ========================= */}

        <ShareLinkDialog
          isOpen={sharedLink.isOpen}
          onClose={() =>
            setSharedLink({
              isOpen: false,
              file: null,
              link: "",
            })
          }
          link={sharedLink.link}
          onCopy={handleCopyLink}
        />
      </div>
    </DashboardLayout>
  );
};

export default MyFiles;
