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
  Tooltip,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  MoreVert,
  ErrorOutline,
  CheckCircleOutline,
  PendingActions,
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
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

  const handleMenuOpen = (event, complaintId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedComplaint(complaintId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
        return { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" };
      case "MEDIUM":
        return { color: "#d97706", bg: "#fef3c7", border: "#fde68a" };
      default:
        return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" };
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 1100, margin: "0 auto" }}>

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
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
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

        {/* Loading skeletons */}
        {loading ? (
          <Grid container spacing={2.5}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>

        /* Empty state */
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

        /* Cards grid */
        ) : (
          <>
            <Grid container spacing={2.5}>
              {complaints.map((c) => {
                const statusCfg = getStatusConfig(c.status);
                const priorityCfg = getPriorityConfig(c.priority);
                return (
                  <Grid item xs={12} sm={6} key={c.id} sx={{ display: "flex" }}>
                    <Card
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        border: "1px solid #f1f5f9",
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0px 12px 32px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          p: 3,
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                          "&:last-child": { pb: 3 },
                        }}
                      >
                        {/* Row 1: Chips + Menu */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          sx={{ mb: 1.5 }}
                        >
                          <Stack direction="row" flexWrap="wrap" gap={0.6}>
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
                                height: 22,
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
                                border: `1px solid ${priorityCfg.border}`,
                                fontWeight: 700,
                                borderRadius: "7px",
                                height: 22,
                                fontSize: "0.7rem",
                                "& .MuiChip-icon": { color: priorityCfg.color },
                              }}
                            />
                          </Stack>

                          <Tooltip title="More options">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, c.id)}
                              sx={{
                                ml: 1,
                                flexShrink: 0,
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                width: 28,
                                height: 28,
                                color: "#94a3b8",
                                "&:hover": { bgcolor: "#f1f5f9", color: "#475569" },
                              }}
                            >
                              <MoreVert sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>

                        {/* Row 2: Title — 1 line, ellipsis */}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: "#0f172a",
                            fontSize: "0.95rem",
                            mb: 0.5,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            flexShrink: 0,
                          }}
                        >
                          {c.title}
                        </Typography>

                        {/* Row 3: Description — hard 2-line cap, ellipsis */}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            height: "3.2em",   /* exactly 2 lines — keeps all cards aligned */
                            flexShrink: 0,
                          }}
                        >
                          {c.description || "No description provided."}
                        </Typography>

                        {/* Row 4: Attachment or fixed-height placeholder */}
                        <Box sx={{ mt: 1.5, flexShrink: 0, height: c.attachmentUrl ? "auto" : 0 }}>
                          {c.attachmentUrl && (
                            <img
                              src={`http://localhost:8080/uploads/${c.attachmentUrl}`}
                              alt="attachment"
                              style={{
                                width: "100%",
                                maxHeight: 100,
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                display: "block",
                              }}
                            />
                          )}
                        </Box>

                        {/* Spacer: pushes divider + button to bottom */}
                        <Box sx={{ flexGrow: 1 }} />

                        <Divider sx={{ my: 2, borderColor: "#f1f5f9" }} />

                        {/* Row 5: Action button */}
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          startIcon={<Timeline sx={{ fontSize: 15 }} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/complaint/${c.id}/timeline`);
                          }}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            borderColor: "#c7d2fe",
                            color: "#6366f1",
                            flexShrink: 0,
                            "&:hover": { borderColor: "#6366f1", bgcolor: "#eef2ff" },
                          }}
                        >
                          View Timeline
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Single Menu instance — outside the map loop */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  border: "1px solid #f1f5f9",
                  minWidth: 170,
                  mt: 0.5,
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate(`/complaints/${selectedComplaint}`);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#0f172a", borderRadius: 1, mx: 0.5 }}
              >
                View Full Details
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>
    </Layout>
  );
}

export default MyComplaints;