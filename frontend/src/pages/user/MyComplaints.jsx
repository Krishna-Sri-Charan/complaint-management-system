import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Card, CardContent, Chip, Grid, Stack, 
  IconButton, Button, Divider, Menu, MenuItem
} from "@mui/material";
import {
  MoreVert, ErrorOutline, CheckCircleOutline, PendingActions, 
  FlagOutlined, InboxOutlined, Timeline, VisibilityOutlined
} from "@mui/icons-material";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import CommonLoader from "../../components/CommonLoader";
import ErrorMessage from "../../components/ErrorMessage";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");

  const fetchComplaints = useCallback(async () => {
    try {
      const res = await API.get(`/complaints/my?page=${page}&size=12`);
      setComplaints(res.data.data.content || []);
      setTotalPages(res.data.data.totalPages || 0);
    } catch (error) {
      console.log(error);      
      setError("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

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
        return { color: "#16a34a", bg: "#ecfdf5", border: "#a7f3d0", icon: <CheckCircleOutline sx={{ fontSize: 13 }} />, label: "Resolved" };
      case "IN_PROGRESS":
        return { color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: <PendingActions sx={{ fontSize: 13 }} />, label: "In Progress" };
      default:
        return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", icon: <ErrorOutline sx={{ fontSize: 13 }} />, label: "Pending" };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH": return { color: "#dc2626", bg: "#fee2e2", border: "#fecaca", barColor: "#ef4444" };
      case "MEDIUM": return { color: "#d97706", bg: "#fffbeb", border: "#fde68a", barColor: "#f59e0b" };
      default: return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", barColor: "#6366f1" };
    }
  };

  if (error) return <Layout><ErrorMessage message={error} /></Layout>;
  if (loading) return <Layout><CommonLoader /></Layout>;

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, margin: "0 auto", px: { xs: 1, sm: 2 } }}>

        {/* Section Header */}
        <Box sx={{ mb: 4, pb: 2.5, borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
              My Complaints History
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
              Track lifecycle history, operational assignments, and core developer timeline notations.
            </Typography>
          </Box>
          {complaints.length > 0 && (
            <Chip label={`${complaints.length} Records Total`} sx={{ bgcolor: "#f1f5f9", color: "#334155", fontWeight: 700, fontSize: "0.75rem", borderRadius: "6px", height: 28, border: "1px solid #cbd5e1" }} />
          )}
        </Box>

        {/* Empty State Block */}
        {complaints.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10, px: 4, borderRadius: 4, bgcolor: "#fff", border: "1px dashed #cbd5e1" }}>
            <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <InboxOutlined sx={{ fontSize: 32, color: "#6366f1" }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>No logged tickets detected</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>Your issue portfolio log is clear. Create a complaint to route a ticket to our technicians.</Typography>
            <Button variant="contained" disableElevation onClick={() => navigate("/create-complaint")} sx={{ borderRadius: "8px", bgcolor: "#6366f1", fontWeight: 600, px: 3, textTransform: "none", "&:hover": { bgcolor: "#4f46e5" } }}>
              File an Issue Ticket
            </Button>
          </Box>
        ) : (
          /* Cards Grid Row Track Sizing Allocation */
          <Grid container spacing={3}>
            {complaints.map((c) => {
              const statusCfg = getStatusConfig(c.status);
              const priorityCfg = getPriorityConfig(c.priority);
              return (
                <Grid size={{ xs: 12, md: 6 }} key={c.id} sx={{ display: "flex" }}>
                  <Card
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      border: "1px solid #e2e8f0",
                      boxShadow: "none",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": { transform: "translateY(-3px)", boxShadow: "0px 12px 24px rgba(15,23,42,0.04)", borderColor: "#cbd5e1" },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0, top: 0, bottom: 0,
                        width: "4px", // Adaptive vertical alignment color strip
                        backgroundColor: priorityCfg.barColor
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flex: 1, "&:last-child": { pb: 3 } }}>
                      {/* Row 1: Badges */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={1}>
                          <Chip label={statusCfg.label} size="small" icon={statusCfg.icon} sx={{ bgcolor: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}`, fontWeight: 700, borderRadius: "6px", height: 22, fontSize: "0.68rem", "& .MuiChip-icon": { color: statusCfg.color } }} />
                          <Chip label={c.priority || "LOW"} size="small" icon={<FlagOutlined sx={{ fontSize: "12px !important" }} />} sx={{ bgcolor: priorityCfg.bg, color: priorityCfg.color, border: `1px solid ${priorityCfg.border}`, fontWeight: 700, borderRadius: "6px", height: 22, fontSize: "0.68rem", "& .MuiChip-icon": { color: priorityCfg.color } }} />
                        </Stack>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, c.id)} sx={{ border: "1px solid #e2e8f0", borderRadius: "8px", width: 30, height: 30, color: "#64748b", "&:hover": { bgcolor: "#f1f5f9" } }}>
                          <MoreVert sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Stack>

                      {/* Row 2: Header Texts */}
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem", mb: 0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {c.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" fontWeight={600} sx={{ letterSpacing: "0.3px", mb: 2 }}>
                        Tracking ID: #{c.id}
                      </Typography>

                      {/* Row 3: Text Statement */}
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", height: "3.2em", mb: 2 }}>
                        {c.description || "No description text logged for this file asset."}
                      </Typography>

                      {/* Row 4: Image Attachment Block Preview */}
                      {c.attachmentUrl && (
                        <Box sx={{ mt: 1, mb: 2, borderRadius: "6px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                          <img src={`http://localhost:8080/uploads/${c.attachmentUrl}`} alt="attachment" style={{ width: "100%", maxHeight: 110, objectFit: "cover", display: "block" }} />
                        </Box>
                      )}

                      <Box sx={{ flexGrow: 1 }} />
                      <Divider sx={{ mb: 2, borderColor: "#f1f5f9" }} />

                      {/* Row 5: Action Button Link */}
                      <Button
                        variant="outlined" size="small" fullWidth startIcon={<Timeline sx={{ fontSize: 14 }} />}
                        onClick={(e) => { e.stopPropagation(); navigate(`/complaint/${c.id}/timeline`); }}
                        sx={{ borderRadius: "8px", fontWeight: 600, py: 1, fontSize: "0.75rem", borderColor: "#cbd5e1", color: "#475569", "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" } }}
                      >
                        Audit Progress Timeline
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Pagination Track Row */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={5}>
            <Pagination count={totalPages} page={page + 1} onChange={(_, value) => setPage(value - 1)} color="primary" sx={{ "& .MuiPaginationItem-root": { borderRadius: "8px", fontWeight: 600 } }} />
          </Box>
        )}

        {/* Floating Actions Content Overlays Option Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} elevation={3} slotProps={{ paper: { sx: { borderRadius: "10px", border: "1px solid #e2e8f0", minWidth: 160 } } }}>
          <MenuItem onClick={() => { navigate(`/complaints/${selectedComplaint}`); handleMenuClose(); }} sx={{ gap: 1.5, fontSize: "0.85rem", fontWeight: 500, color: "#334155", mx: 0.5, borderRadius: 1 }}>
            <VisibilityOutlined sx={{ fontSize: 18, color: "#64748b" }} /> View Full Details
          </MenuItem>
        </Menu>
      </Box>
    </Layout>
  );
}

export default MyComplaints;