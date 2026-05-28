import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Skeleton,
  IconButton,
  Button,
  Avatar,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  MoreVert,
  ErrorOutline,
  CheckCircleOutline,
  PendingActions,
  AccessTime,
  FlagOutlined,
  InboxOutlined,
  Timeline,
} from "@mui/icons-material";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get(`/complaints/my`);
      setComplaints(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case "RESOLVED":
        return {
          color: "#16a34a",
          bg: "#dcfce7",
          border: "#bbf7d0",
          icon: <CheckCircleOutline sx={{ fontSize: 14 }} />,
          label: "Resolved",
        };
      case "IN_PROGRESS":
        return {
          color: "#d97706",
          bg: "#fef3c7",
          border: "#fde68a",
          icon: <PendingActions sx={{ fontSize: 14 }} />,
          label: "In Progress",
        };
      default:
        return {
          color: "#6366f1",
          bg: "#eef2ff",
          border: "#c7d2fe",
          icon: <ErrorOutline sx={{ fontSize: 14 }} />,
          label: "Pending",
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return { color: "#dc2626", bg: "#fee2e2" };
      case "MEDIUM":
        return { color: "#d97706", bg: "#fef3c7" };
      default:
        return { color: "#6366f1", bg: "#eef2ff" };
    }
  };

  const getAvatarColor = (title) => {
    const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];
    const idx = (title?.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            pb: 3,
            borderBottom: "2px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}
            >
              My Complaints
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Track and manage your submitted complaints
            </Typography>
          </Box>
          {!loading && complaints.length > 0 && (
            <Chip
              label={`${complaints.length} Total`}
              sx={{
                bgcolor: "#eef2ff",
                color: "#6366f1",
                fontWeight: 700,
                fontSize: "0.8rem",
                borderRadius: "10px",
                height: 32,
                border: "1px solid #c7d2fe",
              }}
            />
          )}
        </Box>

        {loading ? (
          <Stack spacing={2.5}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" height={130} sx={{ borderRadius: 3 }} />
            ))}
          </Stack>
        ) : complaints.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              px: 4,
              borderRadius: 4,
              bgcolor: "#f8fafc",
              border: "2px dashed #e2e8f0",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "20px",
                bgcolor: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <InboxOutlined sx={{ fontSize: 36, color: "#6366f1" }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>
              No complaints found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Everything looks good! File a complaint if you encounter any issues.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/create-complaint")}
              sx={{
                mt: 3,
                borderRadius: 2,
                bgcolor: "#6366f1",
                fontWeight: 700,
                px: 4,
                "&:hover": { bgcolor: "#4f46e5" },
              }}
            >
              File a Complaint
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {complaints.map((c) => {
              const statusCfg = getStatusConfig(c.status);
              const priorityCfg = getPriorityConfig(c.priority);
              return (
                <Grid item xs={12} key={c.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0px 12px 32px rgba(0,0,0,0.08)",
                      },
                      border: "1px solid #f1f5f9",
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                      overflow: "visible",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "flex-start" }}
                        spacing={2}
                      >
                        {/* Left: Icon + Content */}
                        <Stack direction="row" spacing={2.5} sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            {/* Badges */}
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }} gap={1}>
                              <Chip
                                label={statusCfg.label}
                                size="small"
                                icon={statusCfg.icon}
                                sx={{
                                  bgcolor: statusCfg.bg,
                                  color: statusCfg.color,
                                  border: `1px solid ${statusCfg.border}`,
                                  fontWeight: 700,
                                  borderRadius: "7px",
                                  height: 24,
                                  fontSize: "0.7rem",
                                  "& .MuiChip-icon": { color: statusCfg.color, fontSize: 13 },
                                }}
                              />
                              <Chip
                                label={`${c.priority || "LOW"} Priority`}
                                size="small"
                                icon={<FlagOutlined sx={{ fontSize: "13px !important" }} />}
                                sx={{
                                  bgcolor: priorityCfg.bg,
                                  color: priorityCfg.color,
                                  fontWeight: 700,
                                  borderRadius: "7px",
                                  height: 24,
                                  fontSize: "0.7rem",
                                  "& .MuiChip-icon": { color: priorityCfg.color },
                                }}
                              />
                            </Stack>

                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: "#0f172a",
                                fontSize: "1rem",
                                mb: 0.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {c.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{
                                maxWidth: 560,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                lineHeight: 1.6,
                              }}
                            >
                              {c.description}
                            </Typography>

                            {c.attachmentUrl && (
                              <Box sx={{ mt: 1.5 }}>
                                <img
                                  src={`http://localhost:8080/uploads/${c.attachmentUrl}`}
                                  alt="attachment"
                                  style={{
                                    width: 180,
                                    borderRadius: "10px",
                                    border: "1px solid #e2e8f0",
                                  }}
                                />
                              </Box>
                            )}

                            <Box sx={{ mt: 2 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Timeline sx={{ fontSize: 16 }} />}
                                onClick={() => navigate(`/complaint/${c.id}/timeline`)}
                                sx={{
                                  borderRadius: 2,
                                  fontWeight: 700,
                                  fontSize: "0.75rem",
                                  borderColor: "#c7d2fe",
                                  color: "#6366f1",
                                  px: 2,
                                  "&:hover": {
                                    borderColor: "#6366f1",
                                    bgcolor: "#eef2ff",
                                  },
                                }}
                              >
                                View Timeline
                              </Button>
                            </Box>
                          </Box>
                        </Stack>

                        {/* Right: Actions */}
                        <Tooltip title="More options">
                          <IconButton
                            size="small"
                            sx={{
                              color: "#94a3b8",
                              "&:hover": { bgcolor: "#f1f5f9", color: "#475569" },
                              flexShrink: 0,
                            }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
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