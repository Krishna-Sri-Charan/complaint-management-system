import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box, Stack } from "@mui/material";
import {
  FolderOutlined,
  LockOpenOutlined,
  HourglassEmptyOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import API from "../services/api";
import UserStatusChart from "./charts/UserStatusChart";
import Layout from "./Layout";
import CommonLoader from "./CommonLoader";
import ErrorMessage from "./ErrorMessage";

function UserDashboardAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/analytics/my-dashboard");
      setStats(res.data.data);
    } catch (error) {
      setError("Failed to fetch analytics data.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "My Complaints",
      value: stats?.totalComplaints || 0,
      icon: <FolderOutlined sx={{ fontSize: 22 }} />,
      color: "#4f46e5",
      bg: "#eef2ff",
      border: "#c7d2fe",
    },
    {
      title: "Open",
      value: stats?.openComplaints || 0,
      icon: <LockOpenOutlined sx={{ fontSize: 22 }} />,
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      title: "In Progress",
      value: stats?.inProgressComplaints || 0,
      icon: <HourglassEmptyOutlined sx={{ fontSize: 22 }} />,
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
    },
    {
      title: "Resolved",
      value: stats?.resolvedComplaints || 0,
      icon: <CheckCircleOutline sx={{ fontSize: 22 }} />,
      color: "#10b981",
      bg: "#ecfdf5",
      border: "#a7f3d0",
    },
  ];

  return (
    <Box sx={{ mb: 5 }}>
      {/* Grid Track using size parameters */}
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title} sx={{ display: "flex" }}>
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
                      {card.title}
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
      
      {/* Dynamic Header */}
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ color: "#0f172a", mt: 4, mb: 2 }}
      >
        Complaint Status Overview
      </Typography>

      {/* Restricting maximum container layout expansion width to prevent white space leaks */}
      <Box sx={{ maxWidth: { xs: "100%", md: "50%" } }}>
        <UserStatusChart analytics={stats} />
      </Box>
    </Box>
  );
}

export default UserDashboardAnalytics;