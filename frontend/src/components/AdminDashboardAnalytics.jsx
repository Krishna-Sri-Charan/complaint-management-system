import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Grid, Card, CardContent, Typography, Box, Stack, Chip } from "@mui/material";
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
import CommonLoader from "./CommonLoader";
import ErrorMessage from "./ErrorMessage";

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
    averageResolutionTime: 0,
    fastestResolutionTime: 0,
    slowestResolutionTime: 0,
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        API.get("/analytics/dashboard"),
        API.get("/analytics/complaints")
      ]);
      setStats(statsRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch dashboard data framework.");
    } finally {
      setLoading(false);
    }
  };

  const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthlyData = ALL_MONTHS.map((month) => {
    const complaintCount = analytics?.monthlyComplaints && analytics.monthlyComplaints[month] !== undefined
      ? analytics.monthlyComplaints[month]
      : 0;

    return {
      month,
      complaints: complaintCount,
    };
  });

  const avgResolution =
  analytics?.averageResolutionHours ?? 0;

  const fastestResolution =
    analytics?.fastestResolutionHours ?? 0;

  const slowestResolution =
    analytics?.slowestResolutionHours ?? 0;

  const statCards = [
    { label: "Total Complaints", value: stats.totalComplaints, icon: <ConfirmationNumberOutlined sx={{ fontSize: 22 }} />, color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
    { label: "Resolved", value: stats.resolvedComplaints, icon: <CheckCircleOutline sx={{ fontSize: 22 }} />, color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
    { label: "Pending", value: stats.pendingComplaints, icon: <HourglassEmptyOutlined sx={{ fontSize: 22 }} />, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
    { label: "Avg Resolution", value: `${avgResolution.toFixed(1) || 0}h`, icon: <AccessTime sx={{ fontSize: 22 }} />, color: "#06b6d4", bg: "#ecfeff", border: "#a5f3fc" },
    { label: "Fastest", value: `${fastestResolution.toFixed(1) || 0}h`, icon: <AccessTime sx={{ fontSize: 22 }} />, color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
    { label: "Slowest", value: `${slowestResolution.toFixed(1) || 0}h`, icon: <AccessTime sx={{ fontSize: 22 }} />, color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  ];

  if (loading) return <CommonLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box sx={{ mb: 5 }}>
      {/* Section Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
          ResolveFlow Analytics Overview
        </Typography>
        <Chip
          label="Live System Stream"
          size="small"
          sx={{ bgcolor: "#dcfce7", color: "#16a34a", fontWeight: 700, fontSize: "0.65rem", height: 20, borderRadius: "5px" }}
        />
      </Stack>

      {/* Numerical Counter Metric Blocks Row */}
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
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem", display: "block", mb: 0.5 }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: card.color, lineHeight: 1 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: `${card.color}18`, border: `1px solid ${card.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>
                    {card.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Visual Graphical Analytics Splitting Rows */}
      <Grid container spacing={3} sx={{ mt: 0.5, width: "100%" }}>
        {/* Left Hand: Bar Chart Section */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
          <Card
            sx={{
              height: 420,
              width: "100%",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "none",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BarChartOutlined sx={{ fontSize: 20, color: "#6366f1" }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                    Monthly Complaints Traffic
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Submission logging trajectory map
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ flexGrow: 1, width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "#f1f5f9", radius: 8 }} />
                    <Bar dataKey="complaints" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Hand: Pie Chart Section */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
          <AdminStatusChart analytics={analytics} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboardAnalytics;