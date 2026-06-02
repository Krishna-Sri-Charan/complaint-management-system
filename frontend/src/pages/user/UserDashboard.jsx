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
  ArrowUpward, AccountCircle,
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import UserDashboardAnalytics from "../../components/UserDashboardAnalytics";

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
      title: "Profile Page",
      desc: "Manage your account settings.",
      icon: <AccountCircle sx={{ fontSize: 26, color: "#fff" }} />,
      path: "/profile",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      accent: "#ecfdf5",
      badge: null,
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
        <UserDashboardAnalytics />
        {/* Action Grid */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "#0f172a",
            }}
          >
            Quick Actions
          </Typography>

          <Grid container spacing={3}>
            {actions.map((action, index) => (
              <Grid item xs={12} md={4} key={index}>
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
                    <CardContent sx={{ 
                      p: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}>
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
                      <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.5, flexGrow: 1 }}>
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