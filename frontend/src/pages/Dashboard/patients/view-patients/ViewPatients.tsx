// src/pages/ViewPatients/ViewPatients.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPatients,
  deletePatient,
  fetchPatientStats,
  clearError,
} from "../../../store/slices/patientsSlice.tsx";
import type { AppDispatch, RootState } from "../../../store/store/Store.ts";
import Layout from "../../../../components/Layout/Layout/Layout.tsx";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  User,
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
  Shield,
  X,
  ExternalLink,
  File,
  Image,
  FileArchive,
} from "lucide-react";

interface DocumentViewerProps {
  patient: any;
  isOpen: boolean;
  onClose: () => void;
}

// Document Viewer Modal Component

// In your DocumentViewer component, update the file display section
const DocumentViewer: React.FC<DocumentViewerProps> = ({
  patient,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !patient) return null;

  // Function to extract clean file name from URL
  const getCleanFileName = (fileUrl: string): string => {
    // Extract the filename from the URL
    const fileName = fileUrl.split("/").pop() || "";

    // Remove the timestamp and user ID prefix
    // Pattern: timestamp-userId-originalFileName
    const parts = fileName.split("-");

    // Keep the original filename parts (everything after the timestamp and user ID)
    if (parts.length > 2) {
      // Remove the first two parts (timestamp and user ID)
      return parts.slice(2).join("-");
    }

    // If pattern doesn't match, return the original filename
    return fileName;
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return <Image className="w-5 h-5 text-green-600" />;
    } else if (["pdf"].includes(extension || "")) {
      return <FileText className="w-5 h-5 text-red-600" />;
    } else if (["zip", "rar", "7z"].includes(extension || "")) {
      return <FileArchive className="w-5 h-5 text-orange-600" />;
    } else {
      return <File className="w-5 h-5 text-blue-600" />;
    }
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "PDF Document";
      case "jpg":
      case "jpeg":
        return "JPEG Image";
      case "png":
        return "PNG Image";
      case "doc":
      case "docx":
        return "Word Document";
      case "xls":
      case "xlsx":
        return "Excel Spreadsheet";
      case "zip":
        return "ZIP Archive";
      case "txt":
        return "Text File";
      default:
        return "File";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Medical Documents - {patient.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {patient.files.length} document(s) available
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Documents List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* In the patient card files section */}
          {patient.files.length > 0 ? (
            <div className="space-y-1">
              {patient.files.slice(0, 2).map((file: any, index: number) => {
                const cleanFileName = file.fileUrl.split("/").pop() || "";
                const parts = cleanFileName.split("-");
                const displayName =
                  parts.length > 2 ? parts.slice(2).join("-") : cleanFileName;

                return (
                  <div
                    key={file._id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-gray-600 truncate flex-1">
                      {displayName}
                    </span>
                    <a
                      href={file.fileDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <Download className="w-3 h-3" />
                    </a>
                  </div>
                );
              })}
              {patient.files.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{patient.files.length - 2} more files
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-500">No files attached</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>All documents are securely stored and encrypted</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewPatients: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { patients, stats, loading, error } = useSelector(
    (state: RootState) => state.patients
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [patientForDocuments, setPatientForDocuments] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchPatientStats());
  }, [dispatch]);

  // Filter patients based on search and filter
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.data.conditions.some((condition: string) =>
        condition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFilter =
      !filterCondition || patient.data.conditions.includes(filterCondition);

    return matchesSearch && matchesFilter;
  });

  const handleDeleteClick = (patientId: string) => {
    setPatientToDelete(patientId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (patientToDelete) {
      await dispatch(deletePatient(patientToDelete));
      setShowDeleteModal(false);
      setPatientToDelete(null);
    }
  };

  const handleViewDocuments = (patient: any) => {
    setPatientForDocuments(patient);
    setShowDocumentViewer(true);
  };

  const closeDocumentViewer = () => {
    setShowDocumentViewer(false);
    setPatientForDocuments(null);
  };

  const getConditionStats = () => {
    return stats.slice(0, 5); // Top 5 conditions
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading patients...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Patient Records
            </h1>
            <p className="text-gray-600">
              Manage and view all patient records with encrypted data protection
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading patients
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => dispatch(clearError())}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Stats and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Patients</span>
                    <span className="font-semibold text-gray-900">
                      {patients.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Files Stored</span>
                    <span className="font-semibold text-gray-900">
                      {patients.reduce(
                        (acc, patient) => acc + patient.files.length,
                        0
                      )}
                    </span>
                  </div>
                </div>

                {/* Top Conditions */}
                {stats.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Top Conditions
                    </h4>
                    <div className="space-y-2">
                      {getConditionStats().map((stat) => (
                        <div
                          key={stat._id}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600 truncate">
                            {stat._id}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {stat.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Patients List */}
            <div className="lg:col-span-3">
              {/* Search and Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search patients or conditions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Filter */}
                  <div className="sm:w-64">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={filterCondition}
                        onChange={(e) => setFilterCondition(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      >
                        <option value="">All Conditions</option>
                        {Array.from(
                          new Set(patients.flatMap((p) => p.data.conditions))
                        ).map((condition) => (
                          <option key={condition} value={condition}>
                            {condition}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patients Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    {/* Patient Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {patient.name}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              DOB: {new Date(patient.dob).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleViewDocuments(patient)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View Documents"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedPatient(patient)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(patient._id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Patient Details */}
                    <div className="p-6">
                      {/* Conditions */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Conditions
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {patient.data.conditions.length > 0 ? (
                            patient.data.conditions
                              .slice(0, 3)
                              .map((condition: string, index: number) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {condition}
                                </span>
                              ))
                          ) : (
                            <span className="text-sm text-gray-500">
                              No conditions listed
                            </span>
                          )}
                          {patient.data.conditions.length > 3 && (
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{patient.data.conditions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Files */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-700 flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            Files ({patient.files.length})
                          </h4>
                          {patient.files.length > 0 && (
                            <button
                              onClick={() => handleViewDocuments(patient)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View All
                            </button>
                          )}
                        </div>
                        {patient.files.length > 0 ? (
                          <div className="space-y-1">
                            {patient.files
                              .slice(0, 2)
                              .map((file: any, index: number) => (
                                <div
                                  key={file._id}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <span className="text-gray-600 truncate flex-1">
                                    {file.fileUrl.split("/").pop()}
                                  </span>
                                  <a
                                    href={file.fileDownloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                  >
                                    <Download className="w-3 h-3" />
                                  </a>
                                </div>
                              ))}
                            {patient.files.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{patient.files.length - 2} more files
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            No files attached
                          </span>
                        )}
                      </div>

                      {/* Security Badge */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center text-xs text-gray-500">
                          <Shield className="w-3 h-3 mr-1" />
                          Encrypted Data
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredPatients.length === 0 && (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No patients found
                  </h3>
                  <p className="text-gray-500">
                    {patients.length === 0
                      ? "Get started by creating your first patient record."
                      : "Try adjusting your search or filter criteria."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Patient
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this patient record? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Viewer Modal */}
        <DocumentViewer
          patient={patientForDocuments}
          isOpen={showDocumentViewer}
          onClose={closeDocumentViewer}
        />
      </div>
    </Layout>
  );
};

export default ViewPatients;
