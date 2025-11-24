"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/admin/ProtectedRoute";
import Image from "next/image";
import { Tabs, Tab, Button, Box } from "@mui/material";
import AnalyticsStats from "@/app/components/admin/AnalyticsStats";
import ErrorsDisplay from "@/app/components/admin/ErrorsDisplay";

function DashboardContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <Image
                src="/logo_original.png"
                alt="Nuristani Cultural Foundation"
                width={48}
                height={48}
                className="object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            {/* Sign Out Button */}
            <Button
              variant="outlined"
              color="error"
              onClick={handleSignOut}
              size="small"
            >
              Sign Out
            </Button>
          </div>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Analytics Stats" />
              <Tab label="Error Logs" />
            </Tabs>
          </Box>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 0 && <AnalyticsStats />}
        {activeTab === 1 && <ErrorsDisplay />}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
