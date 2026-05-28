import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
  DonutSmallOutlined,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import API from "../services/api";

const statusData = [
  { name: "Open", value: 8 },
  { name: "In Progress", value: 5 },
  { name: "Resolved", value: 12 },
];

const monthlyData = [
  { month: "Jan", complaints: 4 },
  { month: "Feb", complaints: 7 },
  { month: "Mar", complaints: 5 },
  { month: "Apr", complaints: 10 },
  { month: "May", complaints: 8 },
];

const COLORS = ["#6366f1", "#f59e0b", "#10b981"];

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

// Custom tooltip for pie chart
const CustomPieTooltip = ({ active, payload }) => {
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
        <Typography variant="body2" fontWeight={700}>
          {payload[0].name}: {payload[0].value}
        </Typography>
      </Box>
    );
  }
  return null;
};

function DashboardAnalytics() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/analytics/dashboard");
      setStats(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

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
  ];

  return (
    <Box sx={{ mt: 5 }}>
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
      <Grid container spacing={3}>
        {statCards.map((card, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${card.border}`,
                bgcolor: card.bg,
                boxShadow: "none",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-3px)", boxShadow: `0 8px 24px ${card.color}18` },
              }}
            >
              <CardContent sx={{ p: 3 }}>
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

      {/* Charts */}
      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        {/* Bar Chart */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #f1f5f9",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
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

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "#f1f5f9", radius: 8 }} />
                  <Bar
                    dataKey="complaints"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #f1f5f9",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    bgcolor: "#fef3c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DonutSmallOutlined sx={{ fontSize: 20, color: "#f59e0b" }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                    Status Breakdown
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Current complaint states
                  </Typography>
                </Box>
              </Stack>

              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <Stack spacing={1} sx={{ mt: 2 }}>
                {statusData.map((item, i) => (
                  <Stack key={i} direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "3px",
                          bgcolor: COLORS[i],
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="caption" color="textSecondary" fontWeight={600}>
                        {item.name}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" fontWeight={800} color="#0f172a">
                      {item.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardAnalytics;