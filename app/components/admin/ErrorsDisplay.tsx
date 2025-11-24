"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase-config";
import { collection, query, getDocs, orderBy, limit, where, Timestamp } from "firebase/firestore";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

  const getSeverityColor = (severity: string): "error" | "warning" | "info" | "success" | "default" => {
    switch (severity) {
      case "critical":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getTypeColor = (type: string): "error" | "warning" | "info" | "secondary" | "primary" | "default" => {
    switch (type) {
      case "javascript":
        return "error";
      case "react":
        return "warning";
      case "api":
        return "info";
      case "network":
        return "secondary";
      case "custom":
        return "primary";
      default:
        return "default";
    }
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
        <CircularProgress />
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
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Error Summary
          </Typography>
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
        </CardContent>
      </Card>

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
        <Typography variant="h6">
          Showing {filteredErrors.length} of {errors.length} errors
        </Typography>

        {filteredErrors.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Typography color="textSecondary">
                No errors found with the selected filters
              </Typography>
            </CardContent>
          </Card>
        ) : (
          filteredErrors.map((error) => (
            <Accordion key={error.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="flex items-center gap-3 flex-wrap w-full">
                  <Chip
                    label={error.severity}
                    color={getSeverityColor(error.severity)}
                    size="small"
                  />
                  <Chip
                    label={error.errorType}
                    color={getTypeColor(error.errorType)}
                    variant="outlined"
                    size="small"
                  />
                  <span className="font-medium flex-1 min-w-0 truncate">
                    {error.errorMessage}
                  </span>
                  <span className="text-sm text-gray-500">
                    {error.timestamp?.toDate().toLocaleString()}
                  </span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="space-y-3">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Error Name
                    </Typography>
                    <Typography>{error.errorName}</Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      URL
                    </Typography>
                    <Typography className="break-all">{error.url}</Typography>
                  </div>

                  {error.pathname && (
                    <div>
                      <Typography variant="subtitle2" color="textSecondary">
                        Pathname
                      </Typography>
                      <Typography>{error.pathname}</Typography>
                    </div>
                  )}

                  {error.statusCode && (
                    <div>
                      <Typography variant="subtitle2" color="textSecondary">
                        Status Code
                      </Typography>
                      <Typography>{error.statusCode}</Typography>
                    </div>
                  )}

                  {error.method && (
                    <div>
                      <Typography variant="subtitle2" color="textSecondary">
                        Method
                      </Typography>
                      <Typography>{error.method}</Typography>
                    </div>
                  )}

                  {error.sessionId && (
                    <div>
                      <Typography variant="subtitle2" color="textSecondary">
                        Session ID
                      </Typography>
                      <Typography className="font-mono text-sm">
                        {error.sessionId}
                      </Typography>
                    </div>
                  )}

                  {error.errorStack && (
                    <div>
                      <Typography variant="subtitle2" color="textSecondary">
                        Stack Trace
                      </Typography>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                        {error.errorStack}
                      </pre>
                    </div>
                  )}

                  {error.additionalData && Object.keys(error.additionalData).length > 0 && (
                    <div>
                      <Typography variant="subtitle2" color="textSecondary">
                        Additional Data
                      </Typography>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(error.additionalData, null, 2)}
                      </pre>
                    </div>
                  )}

                  {error.userAgent && (
                    <div>
                      <Typography variant="subtitle2" color="textSecondary">
                        User Agent
                      </Typography>
                      <Typography className="text-xs break-all">
                        {error.userAgent}
                      </Typography>
                    </div>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </div>
    </div>
  );
}
