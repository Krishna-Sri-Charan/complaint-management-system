import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Button,
  Stack, Chip, Grid, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, InputAdornment,
  Avatar, Divider, IconButton, Tooltip,
} from "@mui/material";
import {
  AssignmentInd, Update, FilterList,
  AdminPanelSettings, Engineering, SearchOutlined,
  MoreVert, FlagOutlined, RefreshOutlined,
} from "@mui/icons-material";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import AdminDashboardAnalytics from "../../components/AdminDashboardAnalytics";

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

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModal = (id, type) => {
    setSelectedId(id);
    setModalType(type);
    setInputValue("");
    setOpenModal(true);
  };

  const handleModalSubmit = async () => {
    try {
      if (modalType === "ASSIGN") {
        await API.put(`/admin/assign-technician?complaintId=${selectedId}&technicianId=${inputValue}`);
      } else {
        await API.put(`/admin/update-status?complaintId=${selectedId}&status=${inputValue}`);
      }
      setOpenModal(false);
      fetchComplaints();
    } catch (error) {
      alert("Action failed. Please check your inputs.");
    }
  };

  const searchComplaints = async () => {
    try {
      const res = await API.get(
        `/admin/search?keyword=${keyword}&status=${status}&priority=${priority}`
      );
      setComplaints(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case "RESOLVED":
        return { color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0", label: "Resolved" };
      case "IN_PROGRESS":
        return { color: "#d97706", bg: "#fef3c7", border: "#fde68a", label: "In Progress" };
      default:
        return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", label: "Open" };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH": return { color: "#dc2626", bg: "#fee2e2" };
      case "MEDIUM": return { color: "#d97706", bg: "#fef3c7" };
      default: return { color: "#6366f1", bg: "#eef2ff" };
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Page Header */}
        <Box
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.12)", top: -60, right: 80, pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(99,102,241,0.08)", bottom: -30, right: 30, pointerEvents: "none" }} />

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ position: "relative", zIndex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "13px",
                  bgcolor: "rgba(99,102,241,0.25)",
                  border: "1px solid rgba(99,102,241,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AdminPanelSettings sx={{ color: "#a5b4fc", fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                  Admin Control Center
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mt: 0.3 }}>
                  Review and manage all incoming complaints.
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {/* Search / Filter Bar */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
            border: "1px solid #e2e8f0",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
              <FilterList sx={{ fontSize: 18, color: "#6366f1" }} />
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                Filter Complaints
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by keyword..."
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#6366f1" },
                      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                >
                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="RESOLVED">Resolved</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={searchComplaints}
                  sx={{
                    height: "40px",
                    borderRadius: 2,
                    bgcolor: "#4f46e5",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    "&:hover": { bgcolor: "#4338ca" },
                  }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <AdminDashboardAnalytics />

        {/* Complaints List */}
        <Box sx={{ mt: 4 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
              All Complaints
            </Typography>
            {complaints.length > 0 && (
              <Chip
                label={`${complaints.length} total`}
                size="small"
                sx={{
                  bgcolor: "#eef2ff",
                  color: "#6366f1",
                  fontWeight: 700,
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  border: "1px solid #c7d2fe",
                }}
              />
            )}
          </Stack>

          <Grid container spacing={2.5}>
            {complaints.map((c) => {
              const statusCfg = getStatusConfig(c.status);
              const priorityCfg = getPriorityConfig(c.priority);
              return (
                <Grid item xs={12} key={c.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: "1px solid #f1f5f9",
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0px 12px 32px rgba(0,0,0,0.08)",
                      },
                    }}
                    onClick={() => navigate(`/complaints/${c.id}/`)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} md={7}>
                          <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Box>
                              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }} gap={0.5}>
                                <Chip
                                  label={statusCfg.label}
                                  size="small"
                                  sx={{
                                    bgcolor: statusCfg.bg,
                                    color: statusCfg.color,
                                    border: `1px solid ${statusCfg.border}`,
                                    fontWeight: 700,
                                    borderRadius: "7px",
                                    height: 22,
                                    fontSize: "0.7rem",
                                  }}
                                />
                                <Chip
                                  label={c.priority}
                                  size="small"
                                  icon={<FlagOutlined sx={{ fontSize: "12px !important" }} />}
                                  sx={{
                                    bgcolor: priorityCfg.bg,
                                    color: priorityCfg.color,
                                    fontWeight: 700,
                                    borderRadius: "7px",
                                    height: 22,
                                    fontSize: "0.7rem",
                                    "& .MuiChip-icon": { color: priorityCfg.color },
                                  }}
                                />
                              </Stack>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.3 }}>
                                {c.title}
                              </Typography>
                              <Typography variant="caption" color="textSecondary" fontWeight={500}>
                                Complaint ID: #{c.id}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={5}>
                          <Stack direction="row" spacing={1.5} justifyContent={{ md: "flex-end" }} flexWrap="wrap">
                            <Button
                              variant="contained"
                              disableElevation
                              size="small"
                              startIcon={<Engineering sx={{ fontSize: 15 }} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModal(c.id, "ASSIGN");
                              }}
                            >
                              Assign Tech
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Update sx={{ fontSize: 15 }} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModal(c.id, "STATUS");
                              }}
                              sx={{
                                borderRadius: 2,
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                px: 2,
                                borderColor: "#c7d2fe",
                                color: "#6366f1",
                                "&:hover": { borderColor: "#6366f1", bgcolor: "#eef2ff" },
                              }}
                            >
                              Update Status
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Action Dialog */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: { borderRadius: 3, boxShadow: "0 24px 64px rgba(0,0,0,0.12)" },
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, pb: 1, color: "#0f172a" }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: "#eef2ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {modalType === "ASSIGN"
                  ? <Engineering sx={{ fontSize: 18, color: "#6366f1" }} />
                  : <Update sx={{ fontSize: 18, color: "#6366f1" }} />
                }
              </Box>
              <span>{modalType === "ASSIGN" ? "Assign Technician" : "Update Complaint Status"}</span>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 2.5 }}>
            {modalType === "ASSIGN" ? (
              <TextField
                fullWidth
                label="Technician ID"
                variant="outlined"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            ) : (
              <TextField
                fullWidth
                select
                label="Select Status"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
              </TextField>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={() => setOpenModal(false)}
              sx={{ borderRadius: 2, color: "#64748b", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleModalSubmit}
              sx={{
                borderRadius: 2,
                bgcolor: "#4f46e5",
                fontWeight: 700,
                px: 3,
                "&:hover": { bgcolor: "#4338ca" },
              }}
            >
              Confirm Change
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default AdminDashboard;