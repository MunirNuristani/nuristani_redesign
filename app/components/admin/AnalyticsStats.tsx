"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/utils/firebase-config";
import { collection, query, getDocs, orderBy, limit, where, Timestamp } from "firebase/firestore";
import { CircularProgress, Card, CardContent, Typography } from "@mui/material";

interface SearchResult {
  id: string;
  searchQuery: string;
  dictionaryType: string;
  resultsFound: boolean;
  timestamp: Timestamp;
}

interface Stats {
  totalSessions: number;
  totalPageVisits: number;
  totalSearches: number;
  totalButtonClicks: number;
  totalErrors: number;
  totalDictionarySwitches: number;
  recentSessions: unknown[];
  recentSearches: SearchResult[];
  popularPages: { page: string; count: number }[];
}

export default function AnalyticsStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<"all" | "24h" | "7d" | "30d">("7d");

 

  const getTimeFilterDate = useCallback(() => {
    const now = new Date();
    switch (timeFilter) {
      case "24h":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "30d":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0); // All time
    }
  }, [timeFilter]);



  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const filterDate = getTimeFilterDate();

      // Fetch sessions
      const sessionsQuery = timeFilter === "all"
        ? query(collection(db, "analytics-sessions"))
        : query(collection(db, "analytics-sessions"), where("timestamp", ">=", Timestamp.fromDate(filterDate)));
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const totalSessions = sessionsSnapshot.size;

      // Fetch recent sessions
      const recentSessionsQuery = query(
        collection(db, "analytics-sessions"),
        orderBy("timestamp", "desc"),
        limit(10)
      );
      const recentSessionsSnapshot = await getDocs(recentSessionsQuery);
      const recentSessions = recentSessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch page visits
      const pageVisitsQuery = timeFilter === "all"
        ? query(collection(db, "analytics-page-visits"))
        : query(collection(db, "analytics-page-visits"), where("timestamp", ">=", Timestamp.fromDate(filterDate)));
      const pageVisitsSnapshot = await getDocs(pageVisitsQuery);
      const totalPageVisits = pageVisitsSnapshot.size;

      // Calculate popular pages
      const pageCounts: { [key: string]: number } = {};
      pageVisitsSnapshot.docs.forEach(doc => {
        const page = doc.data().page || "unknown";
        pageCounts[page] = (pageCounts[page] || 0) + 1;
      });
      const popularPages = Object.entries(pageCounts)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Fetch dictionary searches
      const searchesQuery = timeFilter === "all"
        ? query(collection(db, "analytics-dictionary-searches"))
        : query(collection(db, "analytics-dictionary-searches"), where("timestamp", ">=", Timestamp.fromDate(filterDate)));
      const searchesSnapshot = await getDocs(searchesQuery);
      const totalSearches = searchesSnapshot.size;

      // Fetch recent searches
      const recentSearchesQuery = query(
        collection(db, "analytics-dictionary-searches"),
        orderBy("timestamp", "desc"),
        limit(10)
      );
      const recentSearchesSnapshot = await getDocs(recentSearchesQuery);
      const recentSearches = recentSearchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as SearchResult[];

      // Fetch button clicks
      const clicksQuery = timeFilter === "all"
        ? query(collection(db, "analytics-button-clicks"))
        : query(collection(db, "analytics-button-clicks"), where("timestamp", ">=", Timestamp.fromDate(filterDate)));
      const clicksSnapshot = await getDocs(clicksQuery);
      const totalButtonClicks = clicksSnapshot.size;

      // Fetch dictionary switches
      const switchesQuery = timeFilter === "all"
        ? query(collection(db, "analytics-dictionary-switches"))
        : query(collection(db, "analytics-dictionary-switches"), where("timestamp", ">=", Timestamp.fromDate(filterDate)));
      const switchesSnapshot = await getDocs(switchesQuery);
      const totalDictionarySwitches = switchesSnapshot.size;

      // Fetch errors
      const errorsQuery = timeFilter === "all"
        ? query(collection(db, "analytics-errors"))
        : query(collection(db, "analytics-errors"), where("timestamp", ">=", Timestamp.fromDate(filterDate)));
      const errorsSnapshot = await getDocs(errorsQuery);
      const totalErrors = errorsSnapshot.size;

      setStats({
        totalSessions,
        totalPageVisits,
        totalSearches,
        totalButtonClicks,
        totalErrors,
        totalDictionarySwitches,
        recentSessions,
        recentSearches,
        popularPages,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [timeFilter, getTimeFilterDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, timeFilter]);
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <CircularProgress />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-12">Failed to load stats</div>;
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="h-full">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Sessions
            </Typography>
            <Typography variant="h4" component="div">
              {stats.totalSessions.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Page Visits
            </Typography>
            <Typography variant="h4" component="div">
              {stats.totalPageVisits.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Dictionary Searches
            </Typography>
            <Typography variant="h4" component="div">
              {stats.totalSearches.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Button Clicks
            </Typography>
            <Typography variant="h4" component="div">
              {stats.totalButtonClicks.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Dictionary Switches
            </Typography>
            <Typography variant="h4" component="div">
              {stats.totalDictionarySwitches.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Errors
            </Typography>
            <Typography variant="h4" component="div" color="error">
              {stats.totalErrors.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Popular Pages */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Popular Pages
          </Typography>
          <div className="space-y-2 mt-4">
            {stats.popularPages.map((page, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{page.page}</span>
                <span className="text-gray-600">{page.count} visits</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Dictionary Searches
          </Typography>
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Query</th>
                  <th className="text-left p-2">Dictionary</th>
                  <th className="text-left p-2">Results</th>
                  <th className="text-left p-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSearches.map((search) => (
                  <tr key={search.id} className="border-b">
                    <td className="p-2 font-medium">{search.searchQuery}</td>
                    <td className="p-2">{search.dictionaryType}</td>
                    <td className="p-2">
                      {search.resultsFound ? (
                        <span className="text-green-600">✓ Found</span>
                      ) : (
                        <span className="text-red-600">✗ None</span>
                      )}
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {search.timestamp?.toDate().toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
