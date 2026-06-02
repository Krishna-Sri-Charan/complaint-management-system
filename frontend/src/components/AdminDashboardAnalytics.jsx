import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
} from "@mui/material";

import {
  ConfirmationNumberOutlined,
  CheckCircleOutline,
  HourglassEmptyOutlined,
  BarChartOutlined,
  AccessTime,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import API from "../services/api";
import AdminStatusChart from "./charts/AdminStatusChart";
import Layout from "./Layout";
import CommonLoader from "./CommonLoader";
import ErrorMessage from "./ErrorMessage";

// Custom tooltip for bar chart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: "#0f172a",
          color: "#fff",
          px: 2,
          py: 1.2,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={700}>
          {payload[0].value} complaints
        </Typography>
      </Box>
    );
  }
  return null;
};

function AdminDashboardAnalytics() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    averageResolutionHours: 0,
    fastestResolutionHours: 0,
    slowestResolutionHours: 0,
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/analytics/dashboard");
      setStats(res.data.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch admin dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/analytics/complaints");
      setAnalytics(res.data.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch analytics data.");
    } finally {
      setLoading(false);
    }
  };

  // Pre-define all 12 months in order
  const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Merge backend data with ALL_MONTHS to ensure missing ones show up as 0
  const monthlyData = ALL_MONTHS.map((month) => {
    // Check if backend returned data for this month, otherwise default to 0
    const complaintCount = analytics?.monthlyComplaints && analytics.monthlyComplaints[month] !== undefined
      ? analytics.monthlyComplaints[month]
      : 0;

    return {
      month,
      complaints: complaintCount,
    };
  });

  const statCards = [
    {
      label: "Total Complaints",
      value: stats.totalComplaints,
      icon: <ConfirmationNumberOutlined sx={{ fontSize: 22 }} />,
      color: "#6366f1",
      bg: "#eef2ff",
      border: "#c7d2fe",
    },
    {
      label: "Resolved",
      value: stats.resolvedComplaints,
      icon: <CheckCircleOutline sx={{ fontSize: 22 }} />,
      color: "#10b981",
      bg: "#ecfdf5",
      border: "#a7f3d0",
    },
    {
      label: "Pending",
      value: stats.pendingComplaints,
      icon: <HourglassEmptyOutlined sx={{ fontSize: 22 }} />,
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
    },
    {
      label: "Avg Resolution",
      value: `${stats?.averageResolutionTime || 0}h`,
      icon: <AccessTime sx={{ fontSize: 22 }} />,
      color: "#06b6d4",
      bg: "#ecfeff",
      border: "#a5f3fc",
    },
    {
      label: "Fastest",
      value: `${stats?.fastestResolutionTime || 0}h`,
      icon: <AccessTime sx={{ fontSize: 22 }} />,
      color: "#22c55e",
      bg: "#f0fdf4",
      border: "#bbf7d0",
    },
    {
      label: "Slowest",
      value: `${stats?.slowestResolutionTime || 0}h`,
      icon: <AccessTime sx={{ fontSize: 22 }} />,
      color: "#ef4444",
      bg: "#fef2f2",
      border: "#fecaca",
    },
  ];

  if (loading) {
    return <Layout><CommonLoader /></Layout>;
  }

  if (error) {
    return <Layout><ErrorMessage message={error} /></Layout>;
  }

  return (
    <Box sx={{ mb: 5 }}>
      {/* Section Label */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
          Analytics Overview
        </Typography>
        <Chip
          label="Live Data"
          size="small"
          sx={{
            bgcolor: "#dcfce7",
            color: "#16a34a",
            fontWeight: 700,
            fontSize: "0.65rem",
            height: 20,
            borderRadius: "5px",
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Stack>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((card, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i} sx={{ display: "flex" }}>
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${card.border}`,
                bgcolor: card.bg,
                boxShadow: "none",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: `0 8px 24px ${card.color}18`,
                },
              }}
            >
              <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        fontSize: "0.65rem",
                        display: "block",
                        mb: 1,
                      }}
                    >
                      {card.label}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 800, color: card.color, lineHeight: 1 }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      bgcolor: `${card.color}18`,
                      border: `1px solid ${card.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Layer */}
      <Grid container spacing={3} sx={{ mt: 0.5, width: "100%" }}>
        {/* Bar Chart Section */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
          <Card
            sx={{
              height: 420,
              width: "100%",
              borderRadius: 3,
              border: "1px solid #f1f5f9",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column"}}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    bgcolor: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BarChartOutlined sx={{ fontSize: 20, color: "#6366f1" }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                    Monthly Complaints
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Submission trend over time
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ flexGrow: 1, width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} barSize={20}> {/* Adjusted barSize slightly down so 12 bars breathe nicely */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<CustomBarTooltip />}
                      cursor={{ fill: "#f1f5f9", radius: 8 }}
                    />
                    <Bar dataKey="complaints" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Donut Chart Section */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
          <AdminStatusChart analytics={analytics} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboardAnalytics;