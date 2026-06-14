import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Card, CardContent, Button,
  Stack, Chip, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem,
  Divider, IconButton, Menu, Pagination
} from "@mui/material";
import {
  Update, RateReview, CheckCircle, Engineering, 
  FlagOutlined, NoteAddOutlined, MoreVert, VisibilityOutlined
} from "@mui/icons-material";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import TechnicianDashboardAnalytics from "../../components/TechnicianDashboardAnalytics";
import CommonLoader from "../../components/CommonLoader";
import ErrorMessage from "../../components/ErrorMessage";

function TechnicianDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [modalType, setModalType] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const user = JSON.parse(localStorage.getItem("cms_user"));

  const handleMenuOpen = (event, complaintId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedComplaint(complaintId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/technician/complaints?technicianId=${user.id}&page=${page}&size=12`);
      setComplaints(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.log(error);
      setComplaints([]);
      setError("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  }, [user.id, page]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleOpenModal = (id, type) => {
    setSelectedId(id);
    setModalType(type);
    setInputValue("");
    setOpenModal(true);
  };

  const handleModalSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (modalType === "STATUS") {
        await API.put(`/technician/update-status?complaintId=${selectedId}&status=${inputValue}`);
      } else {
        await API.post(`/technician/add-update?complaintId=${selectedId}&technicianId=${user.id}&message=${inputValue}`);
      }
      setOpenModal(false);
      fetchComplaints();
    } catch (error) {
      console.log(error);
      setError("Failed to update complaint");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case "RESOLVED":
        return { color: "#16a34a", bg: "#ecfdf5", border: "#a7f3d0", label: "Resolved" };
      case "IN_PROGRESS":
        return { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "In Progress" };
      default:
        return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", label: "Open" };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH": return { color: "#dc2626", bg: "#fee2e2", border: "#fecaca", barColor: "#ef4444" };
      case "MEDIUM": return { color: "#d97706", bg: "#fffbeb", border: "#fde68a", barColor: "#f59e0b" };
      default: return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", barColor: "#6366f1" };
    }
  };

  if (loading) return <Layout><CommonLoader /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, margin: "0 auto", px: { xs: 1, sm: 2 } }}>

        {/* Premium Page Header Panel */}
        <Box
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            border: "1px solid #334155",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
          }}
        >
          <Box sx={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "rgba(99,102,241,0.08)", top: -60, right: 40, pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "rgba(99,102,241,0.04)", bottom: -40, right: 10, pointerEvents: "none" }} />

          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} spacing={2.5} sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: "14px", bgcolor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Engineering sx={{ color: "#818cf8", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                ResolveFlow Workspace
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5, maxWidth: 650 }}>
                Analyze your performance velocity metrics, track assignments, and finalize outstanding system tickets seamlessly.
              </Typography>
              <Chip
                label={`Operator ID: #${user?.id || "Tech"}`}
                size="small"
                sx={{
                  mt: 1.5,
                  bgcolor: "rgba(99,102,241,0.15)",
                  color: "#a5b4fc",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: "6px"
                }}
              />
            </Box>
          </Stack>
        </Box>

        {/* Analytics Grid Section Component */}
        <TechnicianDashboardAnalytics />

        {/* Workspace List Section Header */}
        {complaints.length > 0 && (
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 5, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem" }}>
              Assigned Tickets Queue
            </Typography>
            <Chip
              label={`${complaints.length} active tasks`}
              size="small"
              sx={{
                bgcolor: "#eef2ff",
                color: "#6366f1",
                fontWeight: 700,
                borderRadius: "6px",
                fontSize: "0.75rem",
                border: "1px solid #c7d2fe",
              }}
            />
          </Stack>
        )}

        {/* Empty State Layout Fallback */}
        {complaints.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10, px: 3, borderRadius: 4, bgcolor: "#fff", border: "1px dashed #cbd5e1", boxShadow: "0px 4px 20px rgba(0,0,0,0.02)" }}>
            <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle sx={{ fontSize: 32, color: "#10b981" }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
              All Caught Up!
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", maxWidth: 400, margin: "0 auto" }}>
              No active complaints have been logged to your queue. New assignments will auto-populate right here.
            </Typography>
          </Box>
        ) : (
          /* Cards Grid Layout Panel — Clean 2-Column Split System */
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
                        left: 0, top: 0, bottom: 0, width: "4px",
                        backgroundColor: priorityCfg.barColor
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flex: 1, "&:last-child": { pb: 3 } }}>
                      {/* Row 1: Badges & Actions */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={1}>
                          <Chip label={statusCfg.label} size="small" sx={{ bgcolor: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}`, fontWeight: 700, borderRadius: "6px", height: 22, fontSize: "0.68rem" }} />
                          <Chip label={c.priority || "LOW"} size="small" icon={<FlagOutlined sx={{ fontSize: "12px !important" }} />} sx={{ bgcolor: priorityCfg.bg, color: priorityCfg.color, border: `1px solid ${priorityCfg.border}`, fontWeight: 700, borderRadius: "6px", height: 22, fontSize: "0.68rem", "& .MuiChip-icon": { color: priorityCfg.color } }} />
                        </Stack>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, c.id)} sx={{ border: "1px solid #e2e8f0", borderRadius: "8px", width: 30, height: 30, color: "#64748b", "&:hover": { bgcolor: "#f1f5f9" } }}>
                          <MoreVert sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Stack>

                      {/* Row 2: Header Title */}
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem", mb: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {c.title}
                      </Typography>

                      {/* Row 3: Description Blocks */}
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", height: "3.2em", mb: 3 }}>
                        {c.description || "No problem statement description logged for this ticket parameters."}
                      </Typography>

                      <Box sx={{ flexGrow: 1 }} />
                      <Divider sx={{ mb: 2, borderColor: "#f1f5f9" }} />

                      {/* Row 4: Operational Action Buttons */}
                      <Stack direction="row" spacing={1.5}>
                        <Button
                          variant="contained"
                          disableElevation
                          size="small"
                          fullWidth
                          startIcon={<Update sx={{ fontSize: 14 }} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(c.id, "STATUS");
                          }}
                          sx={{
                            borderRadius: "8px",
                            bgcolor: "#4f46e5", // Switched from dark slate to cohesive Indigo
                            color: "#fff",
                            fontWeight: 600,
                            py: 1,
                            fontSize: "0.75rem",
                            "&:hover": { bgcolor: "#4338ca" },
                          }}
                        >
                          Update Status
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          startIcon={<NoteAddOutlined sx={{ fontSize: 14 }} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(c.id, "NOTE");
                          }}
                          sx={{
                            borderRadius: "8px",
                            fontWeight: 600,
                            py: 1,
                            fontSize: "0.75rem",
                            borderColor: "#cbd5e1",
                            color: "#475569",
                            "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
                          }}
                        >
                          Add Work Note
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Queue Navigation Pagination Track */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={5}>
            <Pagination count={totalPages} page={page + 1} onChange={(_, value) => setPage(value - 1)} color="primary" sx={{ "& .MuiPaginationItem-root": { borderRadius: "8px", fontWeight: 600 } }} />
          </Box>
        )}

        {/* Action Dropdown Menu Options Panel */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} elevation={3} slotProps={{ paper: { sx: { borderRadius: "10px", border: "1px solid #e2e8f0", minWidth: 150 } } }}>
          <MenuItem onClick={() => { navigate(`/complaints/${selectedComplaint}`); handleMenuClose(); }} sx={{ gap: 1.5, fontSize: "0.85rem", fontWeight: 500, color: "#334155" }}>
            <VisibilityOutlined sx={{ fontSize: 18, color: "#64748b" }} />
            View Details
          </MenuItem>
        </Menu>

        {/* Dialog Action Overlay Modals */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3, boxShadow: "0 24px 64px rgba(15,23,42,0.12)" } }}>
          <DialogTitle sx={{ fontWeight: 800, pb: 2, pt: 3, color: "#0f172a", fontSize: "1.1rem" }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {modalType === "STATUS" ? <Update sx={{ fontSize: 18, color: "#16a34a" }} /> : <RateReview sx={{ fontSize: 18, color: "#16a34a" }} />}
              </Box>
              <span>{modalType === "STATUS" ? "Update Ticket Status" : "Log Workspace Note"}</span>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            {modalType === "STATUS" ? (
              <TextField fullWidth select label="Select Target Status" value={inputValue} onChange={(e) => setInputValue(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
              </TextField>
            ) : (
              <TextField fullWidth multiline rows={4} label="Internal Audit Log Update" placeholder="Type resolution adjustments or milestones here..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
            <Button onClick={() => setOpenModal(false)} sx={{ borderRadius: "8px", color: "#64748b", fontWeight: 600, textTransform: "none" }}>Discard</Button>
            <Button variant="contained" disableElevation onClick={handleModalSubmit} sx={{ borderRadius: "8px", bgcolor: "#10b981", fontWeight: 700, px: 3, textTransform: "none", "&:hover": { bgcolor: "#059669" } }}>Commit Changes</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default TechnicianDashboard;