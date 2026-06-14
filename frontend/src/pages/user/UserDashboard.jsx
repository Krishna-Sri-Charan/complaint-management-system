import { useNavigate } from "react-router-dom";
import {
  Typography, Grid, Card, CardContent, CardActionArea,
  Box, Stack, Avatar,
} from "@mui/material";
import { AddCircleOutline, History, AccountCircle, FlashOnOutlined } from "@mui/icons-material";
import Layout from "../../components/Layout";
import UserDashboardAnalytics from "../../components/UserDashboardAnalytics";

function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("cms_user"));
  const userName = user?.name || "User";

  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const actions = [
    {
      title: "Create Complaint",
      desc: "Submit a new issue and let AI categorize and prioritize it automatically.",
      icon: <AddCircleOutline sx={{ fontSize: 24, color: "#fff" }} />,
      path: "/create-complaint",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      shadowColor: "rgba(99,102,241,0.2)",
    },
    {
      title: "My Complaints",
      desc: "Track the status and timeline of all your submitted complaints.",
      icon: <History sx={{ fontSize: 24, color: "#fff" }} />,
      path: "/my-complaints",
      gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
      shadowColor: "rgba(236,72,153,0.18)",
    },
    {
      title: "My Profile",
      desc: "Update your personal information and account preferences.",
      icon: <AccountCircle sx={{ fontSize: 24, color: "#fff" }} />,
      path: "/profile",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      shadowColor: "rgba(16,185,129,0.18)",
    },
  ];

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, margin: "0 auto", px: { xs: 1, sm: 2 } }}>

        {/* Premium Corporate User Welcome Banner */}
        <Box
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            border: "1px solid #4338ca",
            boxShadow: "0 10px 30px rgba(49,46,129,0.1)"
          }}
        >
          <Box sx={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.04)", top: -60, right: 80, pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)", bottom: -40, right: 40, pointerEvents: "none" }} />

          <Stack direction="row" alignItems="center" spacing={2.5} sx={{ position: "relative", zIndex: 1 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #a5b4fc, #818cf8)",
                fontWeight: 800,
                fontSize: "1.1rem",
                border: "2px solid rgba(255,255,255,0.25)",
                borderRadius: "14px",
              }}
            >
              {getInitials(userName)}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2 }}>
                Welcome back, {userName}! 👋
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
                Track active system diagnostics tickets, manage submissions, and access direct updates.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* User Analytics Counters & Chart View Row */}
        <UserDashboardAnalytics />

        {/* Operational Quick Actions Portal Section */}
        <Box sx={{ mt: 5 }}>
          <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 3 }}>
            <Box sx={{ width: 28, height: 28, borderRadius: "8px", bgcolor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FlashOnOutlined sx={{ fontSize: 16, color: "#6366f1" }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem" }}>
              Quick Action Workspace
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {actions.map((action, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    width: "100%",
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                    boxShadow: "none",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0px 14px 30px ${action.shadowColor}`,
                      borderColor: "#cbd5e1"
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(action.path)}
                    sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch", height: "100%" }}
                  >
                    <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1, height: "100%" }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "12px",
                          background: action.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: `0 4px 12px ${action.shadowColor}`,
                          mb: 2.5,
                          flexShrink: 0,
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.8, fontSize: "0.95rem" }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6, flexGrow: 1 }}>
                        {action.desc}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}

export default UserDashboard;