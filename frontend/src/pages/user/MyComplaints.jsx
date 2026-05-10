import { useEffect, useState } from "react";
import { 
  Box, Typography, Card, CardContent, Chip, 
  Grid, Stack, Skeleton, IconButton 
} from "@mui/material";
import { MoreVert, ErrorOutline, CheckCircleOutline, PendingActions } from "@mui/icons-material";
import API from "../../services/api";
import Layout from "../../components/Layout";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my?userId=1");
      setComplaints(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Helper to get status colors
  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "RESOLVED": return { color: "success", icon: <CheckCircleOutline fontSize="small" /> };
      case "IN_PROGRESS": return { color: "warning", icon: <PendingActions fontSize="small" /> };
      default: return { color: "default", icon: <ErrorOutline fontSize="small" /> };
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 1000, margin: "0 auto" }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: "#1e293b" }}>
          My Complaints History
        </Typography>

        {loading ? (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={100} />)}
          </Stack>
        ) : complaints.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography color="textSecondary">No complaints found. Everything looks good!</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {complaints.map((c) => {
              const statusInfo = getStatusStyle(c.status);
              return (
                <Grid item xs={12} key={c.id}>
                  <Card sx={{ 
                    borderRadius: 3, 
                    transition: "0.3s",
                    "&:hover": { boxShadow: "0px 8px 24px rgba(0,0,0,0.08)" },
                    border: "1px solid #f1f5f9"
                  }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                          <Chip 
                            label={c.status || "PENDING"} 
                            size="small" 
                            color={statusInfo.color} 
                            icon={statusInfo.icon}
                            sx={{ fontWeight: 700, borderRadius: 1 }}
                          />
                          <Chip 
                            label={`Priority: ${c.priority}`} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontWeight: 600, borderRadius: 1 }}
                          />
                        </Stack>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {c.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 600 }}>
                          {c.description}
                        </Typography>
                      </Box>
                      <IconButton><MoreVert /></IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Layout>
  );
}

export default MyComplaints;