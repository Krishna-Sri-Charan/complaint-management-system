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
} from "@mui/material";

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

const COLORS = ["#6366F1", "#F59E0B", "#10B981"];

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

  return (
    <Box sx={{ mt: 5 }}>

      {/* STAT CARDS */}

      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="textSecondary">
                Total Complaints
              </Typography>

              <Typography variant="h4" fontWeight={800}>
                {stats.totalComplaints}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="textSecondary">
                Resolved
              </Typography>

              <Typography
                variant="h4"
                fontWeight={800}
                color="#10B981"
              >
                {stats.resolvedComplaints}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="textSecondary">
                Pending
              </Typography>

              <Typography
                variant="h4"
                fontWeight={800}
                color="#F59E0B"
              >
                {stats.pendingComplaints}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* CHARTS */}

      <Grid container spacing={3} sx={{ mt: 2 }}>

        {/* BAR CHART */}

        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>

              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Monthly Complaints
              </Typography>

              <ResponsiveContainer width="100%" height={300}>

                <BarChart data={monthlyData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="complaints"
                    fill="#6366F1"
                    radius={[8, 8, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </CardContent>
          </Card>
        </Grid>

        {/* PIE CHART */}

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>

              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Complaint Status
              </Typography>

              <ResponsiveContainer width="100%" height={300}>

                <PieChart>

                  <Pie
                    data={statusData}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >

                    {statusData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </CardContent>
          </Card>
        </Grid>

      </Grid>

    </Box>
  );
}

export default DashboardAnalytics;