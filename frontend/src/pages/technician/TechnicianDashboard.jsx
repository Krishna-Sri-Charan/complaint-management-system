import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Button,
  Stack, Chip, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem,
  Divider, IconButton, Tooltip,
} from "@mui/material";
import {
  Update, RateReview,
  CheckCircle, Engineering, FlagOutlined,
  NoteAddOutlined, MoreVert,
} from "@mui/icons-material";
import API from "../../services/api";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import TechnicianDashboardAnalytics from "../../components/TechnicianDashboardAnalytics";
import Menu from "@mui/material/Menu";
import Pagination from "@mui/material/Pagination";
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

  useEffect(() => {
    fetchComplaints();
  }, [page]);

  const handleMenuOpen = (event, complaintId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedComplaint(complaintId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/technician/complaints?technicianId=${user.id}&&page=${page}&size=12`);
      setComplaints(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.log(error);
      setComplaints([]);
      setError("Failed to fetch complaints");
    } finally {
      setLoading(false);
      setError("");
    }
  };

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
      setError("");
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
      case "HIGH": return { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" };
      case "MEDIUM": return { color: "#d97706", bg: "#fef3c7", border: "#fde68a" };
      default: return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" };
    }
  };

  if (loading) {
    return (
      <Layout>
        <CommonLoader />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 1100, margin: "0 auto" }}>

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

        {/* Section label */}
        {complaints.length > 0 && (
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 4, mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
              Assigned Complaints
            </Typography>
            <Chip
              label={`${complaints.length} total`}
              size="small"
              sx={{
                bgcolor: "#ecfdf5",
                color: "#10b981",
                fontWeight: 700,
                borderRadius: "8px",
                fontSize: "0.75rem",
                border: "1px solid #a7f3d0",
              }}
            />
          </Stack>
        )}

        {/* Empty state */}
        {complaints.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              mt: 4,
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

        /* Cards grid — 2 per row */
        ) : (
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
                      cursor: "pointer",
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
                            label={`${c.priority || "LOW"} Priority`}
                            size="small"
                            icon={<FlagOutlined sx={{ fontSize: "12px !important" }} />}
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

                      {/* Row 3: Description — hard 2-line cap */}
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
                          height: "3.2em",
                          flexShrink: 0,
                        }}
                      >
                        {c.description || "No description provided."}
                      </Typography>

                      {/* Spacer: pushes divider + buttons to bottom */}
                      <Box sx={{ flexGrow: 1 }} />

                      <Divider sx={{ my: 2, borderColor: "#f1f5f9" }} />

                      {/* Row 4: Action buttons */}
                      <Stack direction="row" spacing={1}>
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
                            borderRadius: 2,
                            bgcolor: "#10b981",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            "&:hover": { bgcolor: "#059669" },
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
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            borderColor: "#a7f3d0",
                            color: "#10b981",
                            "&:hover": { borderColor: "#10b981", bgcolor: "#ecfdf5" },
                          }}
                        >
                          Add Note
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Box
          display="flex"
          justifyContent="center"
          mt={4}
        >

          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => {

              setPage(value - 1);

            }}
            color="primary"
          />

        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              navigate(
                `/complaints/${selectedComplaint}`
              );
              handleMenuClose();
            }}
          >
            View Details
          </MenuItem>
        </Menu>

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