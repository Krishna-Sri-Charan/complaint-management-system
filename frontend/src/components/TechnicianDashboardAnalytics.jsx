import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box, Stack } from "@mui/material";
import {
  AssignmentOutlined,
  LoopOutlined,
  CheckCircleOutline,
  TrendingUpOutlined,
} from "@mui/icons-material";
import API from "../services/api";

function TechnicianDashboardAnalytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/analytics/technician-dashboard");
      setStats(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cards = [
    {
      title: "Assigned",
      value: stats?.assigned || 0,
      icon: <AssignmentOutlined sx={{ fontSize: 22 }} />,
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      title: "In Progress",
      value: stats?.inProgress || 0,
      icon: <LoopOutlined sx={{ fontSize: 22 }} />,
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
    },
    {
      title: "Resolved",
      value: stats?.resolved || 0,
      icon: <CheckCircleOutline sx={{ fontSize: 22 }} />,
      color: "#10b981",
      bg: "#ecfdf5",
      border: "#a7f3d0",
    },
    {
      title: "Completion Rate",
      value: stats?.completionRate !== undefined && stats.assigned ? `${stats.completionRate}%` : "0%",
      icon: <TrendingUpOutlined sx={{ fontSize: 22 }} />,
      color: "#8b5cf6",
      bg: "#f5f3ff",
      border: "#ddd6fe",
    },
  ];

  return (
    <Box sx={{ mb: 5 }}>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${card.border}`,
                bgcolor: card.bg,
                boxShadow: "none",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: `0 8px 24px ${card.color}18`,
                },
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
    </Box>
  );
}

export default TechnicianDashboardAnalytics;