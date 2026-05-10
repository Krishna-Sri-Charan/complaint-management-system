import { useNavigate } from "react-router-dom";
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea, 
  Box, 
  Stack 
} from "@mui/material";
import { 
  AddCircleOutline, 
  History, 
  Assessment, 
  HelpOutline 
} from "@mui/icons-material";
import Layout from "../../components/Layout";

function UserDashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "User";

  // Data for the dashboard cards
  const actions = [
    {
      title: "File a Complaint",
      desc: "Report a new issue or technical problem.",
      icon: <AddCircleOutline sx={{ fontSize: 40, color: "#6366f1" }} />,
      path: "/create-complaint",
      color: "#eef2ff",
    },
    {
      title: "My Complaints",
      desc: "Track the status of your reported issues.",
      icon: <History sx={{ fontSize: 40, color: "#ec4899" }} />,
      path: "/my-complaints",
      color: "#fdf2f8",
    },
    {
      title: "View Reports",
      desc: "See general analytics and resolution times.",
      icon: <Assessment sx={{ fontSize: 40, color: "#10b981" }} />,
      path: "/dashboard", // Placeholder
      color: "#ecfdf5",
    },
    {
      title: "Support Center",
      desc: "Need help? Read our FAQ and guides.",
      icon: <HelpOutline sx={{ fontSize: 40, color: "#f59e0b" }} />,
      path: "/dashboard", // Placeholder
      color: "#fffbeb",
    },
  ];

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Welcome Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Hello, {userEmail.split('@')[0]}! 👋
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome to your Complaint Management portal. What would you like to do today?
          </Typography>
        </Box>

        {/* Action Grid */}
        <Grid container spacing={3}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  borderRadius: 4, 
                  boxShadow: "0px 10px 30px rgba(0,0,0,0.03)",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-5px)" }
                }}
              >
                <CardActionArea 
                  onClick={() => navigate(action.path)}
                  sx={{ p: 2 }}
                >
                  <CardContent>
                    <Box 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: "16px", 
                        backgroundColor: action.color, 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        mb: 2
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {action.desc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Stats Section (Placeholder for Vibe) */}
        <Box sx={{ mt: 6, p: 3, borderRadius: 4, bgcolor: "#ffffff", border: "1px solid #e2e8f0" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>System Overview</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                <Box>
                    <Typography variant="caption" color="textSecondary" fontWeight={600}>ACTIVE COMPLAINTS</Typography>
                    <Typography variant="h4" fontWeight={800} color="#6366f1">04</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary" fontWeight={600}>RESOLVED THIS WEEK</Typography>
                    <Typography variant="h4" fontWeight={800} color="#10b981">12</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary" fontWeight={600}>AVG. RESPONSE TIME</Typography>
                    <Typography variant="h4" fontWeight={800} color="#f59e0b">2.5h</Typography>
                </Box>
            </Stack>
        </Box>
      </Box>
    </Layout>
  );
}

export default UserDashboard;