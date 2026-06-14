import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Card, CardContent, Button,
  Stack, Chip, Grid, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, InputAdornment,
  Divider, IconButton, Tooltip, Menu, Pagination
} from "@mui/material";
import {
  Update, FilterList, AdminPanelSettings, Engineering, SearchOutlined,
  MoreVert, FlagOutlined, FileDownloadOutlined, RefreshOutlined, 
  VisibilityOutlined, AssignmentIndOutlined
} from "@mui/icons-material";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import AdminDashboardAnalytics from "../../components/AdminDashboardAnalytics";
import TechnicianPerformanceTable from "../../components/TechnicianPerformanceTable";
import CommonLoader from "../../components/CommonLoader";
import ErrorMessage from "../../components/ErrorMessage";

function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [priority, setPriority] = useState("MEDIUM");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      const res = await API.get(`/complaints?page=${page}&size=12`);
      setComplaints(res.data.data.content || []);
      setTotalPages(res.data.data.totalPages || 0);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch complaints.");
    } finally {
      setLoading(false);
    }
  }, [page]);

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
    try {
      if (modalType === "ASSIGN") {
        await API.put(`/admin/assign-technician?complaintId=${selectedId}&technicianId=${inputValue}`);
      } else {
        await API.put(`/admin/update-status?complaintId=${selectedId}&status=${inputValue}`);
      }
      setOpenModal(false);
      fetchComplaints();
    } catch (error) {
      setError("Action failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const searchComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(
        `/admin/search?keyword=${keyword}&status=${status}&priority=${priority}`
      );
      setComplaints(res.data.data || []);
      setTotalPages(0);
    } catch (error) {
      console.log(error);
      setError("Failed to search complaints.");
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

  const downloadExcel = async () => {
    try {
      const response = await API.get("/export/complaints", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "complaints.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <Layout><CommonLoader /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, margin: "0 auto", px: { xs: 1, sm: 2 } }}>

        {/* Premium Corporate Page Header */}
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

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2.5} sx={{ position: "relative", zIndex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2.5}>
              <Box sx={{ width: 56, height: 56, borderRadius: "14px", bgcolor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AdminPanelSettings sx={{ color: "#818cf8", fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                  Admin Control Center
                </Typography>
                <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5, maxWidth: 600 }}>
                  Audit centralized operational tracking sheets, manage technician workflows, and execute macro updates.
                </Typography>
              </Box>
            </Stack>
            
            <Stack direction="row" spacing={1.5}>
              <Tooltip title="Refresh Queue Data">
                <IconButton
                  onClick={fetchComplaints}
                  sx={{ bgcolor: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", width: 40, height: 40, "&:hover": { bgcolor: "rgba(255,255,255,0.12)" } }}
                >
                  <RefreshOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                disableElevation
                startIcon={<FileDownloadOutlined sx={{ fontSize: 17 }} />}
                onClick={downloadExcel}
                sx={{
                  borderRadius: "8px",
                  bgcolor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "0.85rem",
                  px: 2.5,
                  backdropFilter: "blur(4px)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
              >
                Export Sheet
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Analytics Layout Grid */}
        <AdminDashboardAnalytics />

        {/* Performance Visualization Table */}
        <TechnicianPerformanceTable />

        {/* Complaint Management Engine Workspace */}
        <Box sx={{ mt: 5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem" }}>
              Global Complaints Ledger
            </Typography>
            {complaints.length > 0 && (
              <Chip
                label={`${complaints.length} tickets loaded`}
                size="small"
                sx={{ bgcolor: "#eef2ff", color: "#6366f1", fontWeight: 700, borderRadius: "6px", fontSize: "0.75rem", border: "1px solid #c7d2fe" }}
              />
            )}
          </Stack>

          {/* Clean Parameter Filter Card */}
          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: "none", border: "1px solid #e2e8f0" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 2.5 }}>
                <FilterList sx={{ fontSize: 18, color: "#6366f1" }} />
                <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                  Filter Parameters & Ledger Query
                </Typography>
              </Stack>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search query by keyword text..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchOutlined sx={{ fontSize: 18, color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", "&:hover fieldset": { borderColor: "#6366f1" }, "&.Mui-focused fieldset": { borderColor: "#6366f1" } } }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select fullWidth label="Status" value={status}
                    onChange={(e) => setStatus(e.target.value)} size="small"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  >
                    <MenuItem value="OPEN">Open</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="RESOLVED">Resolved</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select fullWidth label="Priority" value={priority}
                    onChange={(e) => setPriority(e.target.value)} size="small"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth variant="contained" disableElevation onClick={searchComplaints}
                    sx={{ 
                      height: "40px", 
                      borderRadius: "8px", 
                      bgcolor: "#4f46e5", // Updated to vibrant Indigo
                      fontWeight: 600, 
                      fontSize: "0.82rem", 
                      textTransform: "none", 
                      "&:hover": { bgcolor: "#4338ca" } 
                    }}
                  >
                    Execute Search
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Cards Grid Pane — 2 Symmetrical Columns */}
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
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "4px",
                        backgroundColor: priorityCfg.barColor
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flex: 1, "&:last-child": { pb: 3 } }}>

                      {/* Row 1: Badges & Controls Menu */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Stack direction="row" flexWrap="wrap" gap={0.6}>
                          <Chip
                            label={statusCfg.label} size="small"
                            sx={{ bgcolor: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}`, fontWeight: 700, borderRadius: "6px", height: 22, fontSize: "0.68rem" }}
                          />
                          <Chip
                            label={`${c.priority || "LOW"} Priority`} size="small"
                            icon={<FlagOutlined sx={{ fontSize: "12px !important" }} />}
                            sx={{ bgcolor: priorityCfg.bg, color: priorityCfg.color, border: `1px solid ${priorityCfg.border}`, fontWeight: 700, borderRadius: "6px", height: 22, fontSize: "0.68rem", "& .MuiChip-icon": { color: priorityCfg.color } }}
                          />
                        </Stack>
                        
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, c.id)}
                          sx={{ border: "1px solid #e2e8f0", borderRadius: "8px", width: 30, height: 30, color: "#64748b", "&:hover": { bgcolor: "#f1f5f9" } }}
                        >
                          <MoreVert sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Stack>

                      {/* Row 2: Heading Title text */}
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem", mb: 0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flexShrink: 0 }}
                      >
                        {c.title}
                      </Typography>

                      {/* Row 3: Meta Identifier Label */}
                      <Typography
                        variant="caption" color="textSecondary" fontWeight={600}
                        sx={{ letterSpacing: "0.3px", mb: 2 }}
                      >
                        Ticket Sequence ID: #{c.id}
                      </Typography>

                      {/* Row 4: Text Statement */}
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", height: "3.2em", mb: 2 }}>
                        {c.description || "No description text logged for this file asset."}
                      </Typography>

                      <Box sx={{ flexGrow: 1 }} />
                      <Divider sx={{ my: 2, borderColor: "#f1f5f9" }} />

                      {/* Row 5: Operational Macro Modification Actions */}
                      <Stack direction="row" spacing={1.5}>
                        <Button
                          variant="contained" disableElevation size="small" fullWidth
                          startIcon={<Engineering sx={{ fontSize: 14 }} />}
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(c.id, "ASSIGN"); }}
                          sx={{ 
                            borderRadius: "8px", 
                            bgcolor: "#eef2ff", // Soft indigo backdrop
                            color: "#4f46e5", // Indigo text tint
                            fontWeight: 700, 
                            fontSize: "0.75rem", 
                            textTransform: "none", 
                            py: 1, 
                            border: "1px solid #cbd5e1",
                            borderColor: "#c7d2fe",
                            "&:hover": { bgcolor: "#e0e7ff" } 
                          }}
                        >
                          Assign Tech
                        </Button>
                        <Button
                          variant="outlined" size="small" fullWidth
                          startIcon={<Update sx={{ fontSize: 14 }} />}
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(c.id, "STATUS"); }}
                          sx={{ borderRadius: "8px", fontWeight: 600, fontSize: "0.75rem", textTransform: "none", py: 1, borderColor: "#cbd5e1", color: "#475569", "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" } }}
                        >
                          Update Status
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Bottom Workspace Pagination Panel Track */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={5} mb={2}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(_, value) => setPage(value - 1)}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": { borderRadius: "8px", fontWeight: 600 },
                "& .Mui-selected": { bgcolor: "#4f46e5 !important", color: "#fff" }, // Symmetrical Indigo tracking
              }}
            />
          </Box>
        )}

        {/* Context Trigger Dropdown Selection Layer */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          elevation={3}
          slotProps={{ paper: { sx: { borderRadius: "10px", border: "1px solid #e2e8f0", minWidth: 180 } } }}
        >
          <MenuItem
            onClick={() => { navigate(`/complaints/${selectedComplaint}`); handleMenuClose(); }}
            sx={{ gap: 1.5, fontSize: "0.85rem", fontWeight: 500, color: "#334155", mx: 0.5, borderRadius: 1 }}
          >
            <VisibilityOutlined sx={{ fontSize: 18, color: "#64748b" }} />
            View Full Details
          </MenuItem>
          <MenuItem
            onClick={() => { handleOpenModal(selectedComplaint, "ASSIGN"); handleMenuClose(); }}
            sx={{ gap: 1.5, fontSize: "0.85rem", fontWeight: 500, color: "#6366f1", mx: 0.5, borderRadius: 1 }}
          >
            <AssignmentIndOutlined sx={{ fontSize: 18, color: "#6366f1" }} />
            Assign Technician
          </MenuItem>
          <MenuItem
            onClick={() => { handleOpenModal(selectedComplaint, "STATUS"); handleMenuClose(); }}
            sx={{ gap: 1.5, fontSize: "0.85rem", fontWeight: 500, color: "#d97706", mx: 0.5, borderRadius: 1 }}
          >
            <Update sx={{ fontSize: 18, color: "#d97706" }} />
            Update Status
          </MenuItem>
        </Menu>

        {/* Global Action Management Input Form Modal Overlays */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          fullWidth maxWidth="xs"
          PaperProps={{ sx: { borderRadius: 3, boxShadow: "0 24px 64px rgba(15,23,42,0.12)" } }}
        >
          <DialogTitle sx={{ fontWeight: 800, pb: 2, pt: 3, color: "#0f172a", fontSize: "1.1rem" }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {modalType === "ASSIGN"
                  ? <Engineering sx={{ fontSize: 18, color: "#16a34a" }} />
                  : <Update sx={{ fontSize: 18, color: "#16a34a" }} />
                }
              </Box>
              <span>{modalType === "ASSIGN" ? "Assign Staff Operator" : "Modify Ticket Status"}</span>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            {modalType === "ASSIGN" ? (
              <TextField
                fullWidth label="Operator Technician ID" variant="outlined"
                value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              />
            ) : (
              <TextField
                fullWidth select label="Target Status State"
                value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
              >
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
              </TextField>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
            <Button onClick={() => setOpenModal(false)} sx={{ borderRadius: "8px", color: "#64748b", fontWeight: 600, textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained" disableElevation onClick={handleModalSubmit}
              sx={{ borderRadius: "8px", bgcolor: "#10b981", fontWeight: 700, px: 3, textTransform: "none", "&:hover": { bgcolor: "#059669" } }}
            >
              Confirm Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default AdminDashboard;