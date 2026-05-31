import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Button,
  Stack, Chip, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem,
  Avatar, Divider,
} from "@mui/material";
import {
  Build, Update, RateReview,
  CheckCircle, Engineering, FlagOutlined,
  NoteAddOutlined,
} from "@mui/icons-material";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import TechnicianDashboardAnalytics from "../../components/TechnicianDashboardAnalytics";

function TechnicianDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [modalType, setModalType] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const TECH_ID = 4;

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get(`/technician/complaints?technicianId=${TECH_ID}`);
      setComplaints(res.data || []);
    } catch (error) {
      console.log(error);
      setComplaints([]);
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
      if (modalType === "STATUS") {
        await API.put(`/technician/update-status?complaintId=${selectedId}&status=${inputValue}`);
      } else {
        await API.post(`/technician/add-update?complaintId=${selectedId}&technicianId=${TECH_ID}&message=${inputValue}`);
      }
      setOpenModal(false);
      fetchComplaints();
    } catch (error) {
      alert("Action failed. Please try again.");
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
      <Box sx={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Page Header */}
        <Box
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "rgba(16,185,129,0.15)", top: -50, right: 60, pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", background: "rgba(16,185,129,0.1)", bottom: -25, right: 20, pointerEvents: "none" }} />

          <Stack direction="row" alignItems="center" spacing={2} sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "13px",
                bgcolor: "rgba(16,185,129,0.25)",
                border: "1px solid rgba(16,185,129,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Engineering sx={{ color: "#6ee7b7", fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                Technician Workspace
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mt: 0.3 }}>
                Manage your assigned tasks and provide progress updates.
              </Typography>
            </Box>
          </Stack>
        </Box>
        <TechnicianDashboardAnalytics />
        {/* Content */}
        {complaints.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              borderRadius: 4,
              bgcolor: "#f0fdf4",
              border: "2px dashed #a7f3d0",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "20px",
                bgcolor: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <CheckCircle sx={{ fontSize: 40, color: "#10b981" }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#065f46", mb: 1 }}>
              All clear! No assigned complaints.
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              You're up to date. New assignments will appear here.
            </Typography>
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
                      border: "1px solid #f1f5f9",
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0px 12px 32px rgba(0,0,0,0.08)",
                      },
                    }}
                    onClick={() => navigate(`/complaints/${c.id}/`)}>
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={7}>
                          <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Avatar
                              sx={{
                                width: 44,
                                height: 44,
                                bgcolor: "#ecfdf5",
                                color: "#10b981",
                                fontWeight: 800,
                                fontSize: "1rem",
                                borderRadius: "12px",
                                border: "1px solid #a7f3d0",
                                flexShrink: 0,
                              }}
                            >
                              {c.title?.charAt(0).toUpperCase()}
                            </Avatar>
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
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                                {c.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                  overflow: "hidden",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  lineHeight: 1.6,
                                }}
                              >
                                {c.description}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={5}>
                          <Stack direction={{ xs: "row", md: "column" }} spacing={1.5} justifyContent={{ md: "flex-end" }}>
                            <Button
                              variant="contained"
                              disableElevation
                              size="small"
                              startIcon={<Update sx={{ fontSize: 15 }} />}
                              onClick={() => handleOpenModal(c.id, "STATUS")}
                              sx={{
                                borderRadius: 2,
                                bgcolor: "#10b981",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                px: 2.5,
                                "&:hover": { bgcolor: "#059669" },
                              }}
                            >
                              Update Status
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<NoteAddOutlined sx={{ fontSize: 15 }} />}
                              onClick={() => handleOpenModal(c.id, "NOTE")}
                              sx={{
                                borderRadius: 2,
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                px: 2.5,
                                borderColor: "#a7f3d0",
                                color: "#10b981",
                                "&:hover": { borderColor: "#10b981", bgcolor: "#ecfdf5" },
                              }}
                            >
                              Add Work Note
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
        )}

        {/* Modal */}
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
                  bgcolor: "#ecfdf5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {modalType === "STATUS"
                  ? <Update sx={{ fontSize: 18, color: "#10b981" }} />
                  : <RateReview sx={{ fontSize: 18, color: "#10b981" }} />
                }
              </Box>
              <span>{modalType === "STATUS" ? "Change Status" : "Add Work Note"}</span>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 2.5 }}>
            {modalType === "STATUS" ? (
              <TextField
                fullWidth
                select
                label="Status"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
              </TextField>
            ) : (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Work Note"
                placeholder="Describe the work done so far..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
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
                bgcolor: "#10b981",
                fontWeight: 700,
                px: 3,
                "&:hover": { bgcolor: "#059669" },
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default TechnicianDashboard;