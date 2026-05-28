import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Stack,
  Avatar,
  Chip,
} from "@mui/material";
import {
  AddCircleOutline,
  History,
  Assessment,
  HelpOutline,
  TrendingUp,
  ArrowUpward,
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import DashboardAnalytics from "../../components/DashboardAnalytics";

function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("cms_user"));
  const userName = user?.name || "User";

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const actions = [
    {
      title: "File a Complaint",
      desc: "Report a new issue or technical problem.",
      icon: <AddCircleOutline sx={{ fontSize: 26, color: "#fff" }} />,
      path: "/create-complaint",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      accent: "#eef2ff",
      badge: null,
    },
    {
      title: "My Complaints",
      desc: "Track the status of your reported issues.",
      icon: <History sx={{ fontSize: 26, color: "#fff" }} />,
      path: "/my-complaints",
      gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
      accent: "#fdf2f8",
      badge: null,
    },
    {
      title: "View Reports",
      desc: "See general analytics and resolution times.",
      icon: <Assessment sx={{ fontSize: 26, color: "#fff" }} />,
      path: "/dashboard",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      accent: "#ecfdf5",
      badge: null,
    },
    {
      title: "Support Center",
      desc: "Need help? Read our FAQ and guides.",
      icon: <HelpOutline sx={{ fontSize: 26, color: "#fff" }} />,
      path: "/dashboard",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      accent: "#fffbeb",
      badge: null,
    },
  ];

  const stats = [
    {
      label: "Active Complaints",
      value: "04",
      color: "#6366f1",
      bg: "#eef2ff",
      icon: <TrendingUp sx={{ fontSize: 18, color: "#6366f1" }} />,
      trend: "+1 this week",
    },
    {
      label: "Resolved This Week",
      value: "12",
      color: "#10b981",
      bg: "#ecfdf5",
      icon: <ArrowUpward sx={{ fontSize: 18, color: "#10b981" }} />,
      trend: "+3 vs last week",
    },
    {
      label: "Avg. Response Time",
      value: "2.5h",
      color: "#f59e0b",
      bg: "#fffbeb",
      icon: <TrendingUp sx={{ fontSize: 18, color: "#f59e0b" }} />,
      trend: "↓ 0.5h improved",
    },
  ];

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Welcome Header */}
        <Box
          sx={{
            mb: 5,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <Box
            sx={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              top: -60,
              right: 80,
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              bottom: -40,
              right: 40,
              pointerEvents: "none",
            }}
          />

          <Stack direction="row" alignItems="center" spacing={2.5} sx={{ position: "relative", zIndex: 1 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #a5b4fc, #818cf8)",
                fontWeight: 800,
                fontSize: "1.2rem",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              {getInitials(userName)}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2 }}
              >
                Hello, {userName}! 👋
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5 }}
              >
                Welcome to your Complaint Management portal. What would you like to do today?
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Action Grid */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.06)",
                  border: "1px solid #f1f5f9",
                  transition: "transform 0.22s ease, box-shadow 0.22s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0px 16px 40px rgba(99,102,241,0.12)",
                  },
                  height: "100%",
                }}
              >
                <CardActionArea
                  onClick={() => navigate(action.path)}
                  sx={{ p: 0.5, height: "100%" }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      sx={{ mb: 2 }}
                    >
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "14px",
                          background: action.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                        }}
                      >
                        {action.icon}
                      </Box>
                      {action.badge && (
                        <Chip
                          label={action.badge}
                          size="small"
                          sx={{
                            bgcolor: "#eef2ff",
                            color: "#6366f1",
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            height: 22,
                            borderRadius: "6px",
                          }}
                        />
                      )}
                    </Stack>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 0.5, color: "#0f172a", fontSize: "1rem" }}
                    >
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.5 }}>
                      {action.desc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <DashboardAnalytics />

        {/* System Overview Stats */}
        <Box
          sx={{
            mt: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
              System Overview
            </Typography>
            <Chip
              label="Live"
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

          <Grid container spacing={3}>
            {stats.map((stat, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: stat.bg,
                    border: `1px solid ${stat.color}22`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.65rem" }}
                    >
                      {stat.label}
                    </Typography>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "8px",
                        bgcolor: `${stat.color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Stack>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, color: stat.color, lineHeight: 1, mb: 0.5 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.72rem" }}>
                    {stat.trend}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}

export default UserDashboard;