"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase-config";
import { collection, query, getDocs, orderBy, limit, where, Timestamp, deleteDoc, doc } from "firebase/firestore";

interface ErrorLog {
  id: string;
  timestamp: Timestamp;
  errorType: string;
  errorMessage: string;
  errorStack?: string;
  errorName: string;
  severity: string;
  url: string;
  pathname?: string;
  userAgent?: string;
  sessionId?: string;
  additionalData?: Record<string, unknown>;
  statusCode?: number;
  method?: string;
}

export default function ErrorsDisplay() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "30d" | "all">("7d");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [errorToDelete, setErrorToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilter]);

  const getTimeFilterDate = () => {
    const now = new Date();
    switch (timeFilter) {
      case "24h":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "30d":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0);
    }
  };

  const fetchErrors = async () => {
    try {
      setLoading(true);
      const filterDate = getTimeFilterDate();

      const errorsQuery = timeFilter === "all"
        ? query(collection(db, "analytics-errors"), orderBy("timestamp", "desc"), limit(100))
        : query(
            collection(db, "analytics-errors"),
            where("timestamp", ">=", Timestamp.fromDate(filterDate)),
            orderBy("timestamp", "desc"),
            limit(100)
          );

      const errorsSnapshot = await getDocs(errorsQuery);
      const errorsList = errorsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ErrorLog[];

      setErrors(errorsList);
    } catch (error) {
      console.error("Error fetching errors:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case "javascript":
        return "bg-red-50 text-red-700 border-red-300";
      case "react":
        return "bg-orange-50 text-orange-700 border-orange-300";
      case "api":
        return "bg-blue-50 text-blue-700 border-blue-300";
      case "network":
        return "bg-purple-50 text-purple-700 border-purple-300";
      case "custom":
        return "bg-indigo-50 text-indigo-700 border-indigo-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  const handleDeleteClick = (errorId: string) => {
    setErrorToDelete(errorId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!errorToDelete) return;

    try {
      setDeleting(true);
      // Delete from Firestore
      await deleteDoc(doc(db, "analytics-errors", errorToDelete));

      // Update local state
      setErrors((prevErrors) => prevErrors.filter((error) => error.id !== errorToDelete));

      // Close dialog
      setDeleteDialogOpen(false);
      setErrorToDelete(null);
    } catch (error) {
      console.error("Error deleting error log:", error);
      alert("Failed to delete error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setErrorToDelete(null);
  };

  const filteredErrors = errors.filter((error) => {
    if (filterSeverity !== "all" && error.severity !== filterSeverity) return false;
    if (filterType !== "all" && error.errorType !== filterType) return false;
    return true;
  });

  const errorStats = {
    critical: errors.filter((e) => e.severity === "critical").length,
    high: errors.filter((e) => e.severity === "high").length,
    medium: errors.filter((e) => e.severity === "medium").length,
    low: errors.filter((e) => e.severity === "low").length,
    byType: {
      javascript: errors.filter((e) => e.errorType === "javascript").length,
      react: errors.filter((e) => e.errorType === "react").length,
      api: errors.filter((e) => e.errorType === "api").length,
      network: errors.filter((e) => e.errorType === "network").length,
      custom: errors.filter((e) => e.errorType === "custom").length,
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex gap-2">
        {(["24h", "7d", "30d", "all"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {filter === "24h" ? "Last 24 Hours" : filter === "7d" ? "Last 7 Days" : filter === "30d" ? "Last 30 Days" : "All Time"}
          </button>
        ))}
      </div>

      {/* Error Statistics */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Error Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600">{errorStats.critical}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">{errorStats.high}</div>
            <div className="text-sm text-gray-600">High</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{errorStats.medium}</div>
            <div className="text-sm text-gray-600">Medium</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{errorStats.low}</div>
            <div className="text-sm text-gray-600">Low</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity
          </label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Error Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="api">API</option>
            <option value="network">Network</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Errors List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">
          Showing {filteredErrors.length} of {errors.length} errors
        </h2>

        {filteredErrors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <p className="text-gray-600">
              No errors found with the selected filters
            </p>
          </div>
        ) : (
          filteredErrors.map((error) => (
            <details key={error.id} className="bg-white rounded-lg shadow-md border border-gray-200 group">
              <summary className="p-4 cursor-pointer hover:bg-gray-50 transition-colors list-none">
                <div className="flex items-center gap-3 flex-wrap w-full">
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(error.severity)}`}>
                    {error.severity}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(error.errorType)}`}>
                    {error.errorType}
                  </span>
                  <span className="font-medium flex-1 min-w-0 truncate">
                    {error.errorMessage.length > 60
                      ? `${error.errorMessage.slice(0, 60)}...`
                      : error.errorMessage}
                  </span>
                  <span className="text-sm text-gray-500">
                    {error.timestamp?.toDate().toLocaleString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDeleteClick(error.id);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete error"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </summary>
              <div className="p-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Error Name
                    </p>
                    <p className="text-gray-900">{error.errorName}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      URL
                    </p>
                    <p className="text-gray-900 break-all">{error.url}</p>
                  </div>

                  {error.pathname && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Pathname
                      </p>
                      <p className="text-gray-900">{error.pathname}</p>
                    </div>
                  )}

                  {error.statusCode && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Status Code
                      </p>
                      <p className="text-gray-900">{error.statusCode}</p>
                    </div>
                  )}

                  {error.method && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Method
                      </p>
                      <p className="text-gray-900">{error.method}</p>
                    </div>
                  )}

                  {error.sessionId && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Session ID
                      </p>
                      <p className="text-gray-900 font-mono text-sm">
                        {error.sessionId}
                      </p>
                    </div>
                  )}

                  {error.errorStack && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Stack Trace
                      </p>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                        {error.errorStack}
                      </pre>
                    </div>
                  )}

                  {error.additionalData && Object.keys(error.additionalData).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Additional Data
                      </p>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(error.additionalData, null, 2)}
                      </pre>
                    </div>
                  )}

                  {error.userAgent && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        User Agent
                      </p>
                      <p className="text-gray-900 text-xs break-all">
                        {error.userAgent}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </details>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Confirm Delete
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete this error log? This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
