import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Stack,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Avatar, TextField, Menu, MenuItem
} from "@mui/material";

import {
  Person,
  Engineering,
  AttachFile,
  AccessTime,
  CategoryOutlined,
  FlagOutlined,
  CheckCircleOutline,
  PendingActions,
  ErrorOutline,
  RadioButtonUnchecked,
  HistoryOutlined,
  InfoOutlined, Timeline, History, AccessTimeOutlined
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../../components/Layout";
import API from "../../services/api";
import ErrorMessage from "../../components/ErrorMessage";

function ComplaintDetails() {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const complaintRes = await API.get(`/complaints/${id}`);
      const updatesRes = await API.get(`/complaints/${id}/updates`);
      const commentsRes = await API.get(`/comments/${id}`);
      setComplaint(complaintRes.data.data);
      setUpdates(updatesRes.data || []);
      setComments(commentsRes.data.data || []);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch complaint details.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "OPEN":
        return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", label: "Open", icon: <ErrorOutline sx={{ fontSize: 14 }} /> };
      case "IN_PROGRESS":
        return { color: "#d97706", bg: "#fef3c7", border: "#fde68a", label: "In Progress", icon: <PendingActions sx={{ fontSize: 14 }} /> };
      case "RESOLVED":
        return { color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0", label: "Resolved", icon: <CheckCircleOutline sx={{ fontSize: 14 }} /> };
      default:
        return { color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0", label: status, icon: null };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "HIGH":
        return { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" };
      case "MEDIUM":
        return { color: "#d97706", bg: "#fef3c7", border: "#fde68a" };
      case "LOW":
        return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" };
      default:
        return { color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0" };
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const InfoRow = ({ label, children }) => (
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: "#94a3b8",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: "0.62rem",
          display: "block",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );

  const addComment = async () => {

    try {

      await API.post(
        "/comments",
        {
          complaintId: id,
          message: commentText
        }
      );

      setCommentText("");

      fetchData();

    } catch(error) {

      console.log(error);
      setError("Failed to add comment.");
    }
    finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Stack alignItems="center" spacing={2}>
            <CircularProgress sx={{ color: "#6366f1" }} />
            <Typography variant="body2" color="textSecondary" fontWeight={600}>
              Loading complaint...
            </Typography>
          </Stack>
        </Box>
      </Layout>
    );
  }

  if (!complaint) {
    return (
      <Layout>
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 6 }}>
          <Alert
            severity="error"
            sx={{ borderRadius: 3, fontWeight: 600 }}
          >
            Complaint not found. It may have been removed or you don't have access.
          </Alert>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 6 }}>
          <ErrorMessage message={error} />
        </Box>
      </Layout>
    );
  }

  const statusCfg = getStatusConfig(complaint.status);
  const priorityCfg = getPriorityConfig(complaint.priority);
  const createdAt = formatDate(complaint.createdAt);

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>

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
          <Box sx={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.1)", top: -60, right: 80, pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(99,102,241,0.07)", bottom: -30, right: 30, pointerEvents: "none" }} />

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
                <InfoOutlined sx={{ color: "#a5b4fc", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                  Complaint #{complaint.id}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.55)", mt: 0.3 }}>
                  Submitted {createdAt.date} at {createdAt.time}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Chip
                label={statusCfg.label}
                icon={statusCfg.icon}
                size="small"
                sx={{
                  bgcolor: statusCfg.bg,
                  color: statusCfg.color,
                  border: `1px solid ${statusCfg.border}`,
                  fontWeight: 700,
                  borderRadius: "8px",
                  "& .MuiChip-icon": { color: statusCfg.color },
                }}
              />
              <Chip
                label={complaint.priority}
                size="small"
                icon={<FlagOutlined sx={{ fontSize: "13px !important" }} />}
                sx={{
                  bgcolor: priorityCfg.bg,
                  color: priorityCfg.color,
                  border: `1px solid ${priorityCfg.border}`,
                  fontWeight: 700,
                  borderRadius: "8px",
                  "& .MuiChip-icon": { color: priorityCfg.color },
                }}
              />
            </Stack>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>

            {/* Main Complaint Card */}
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #f1f5f9",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ mb: 1.5, letterSpacing: "-0.3px" }}>
                  {complaint.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ lineHeight: 1.8, mb: 3 }}
                >
                  {complaint.description || "No description provided."}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  <Chip
                    label={statusCfg.label}
                    icon={statusCfg.icon}
                    size="small"
                    sx={{
                      bgcolor: statusCfg.bg,
                      color: statusCfg.color,
                      border: `1px solid ${statusCfg.border}`,
                      fontWeight: 700,
                      borderRadius: "7px",
                      height: 26,
                      "& .MuiChip-icon": { color: statusCfg.color },
                    }}
                  />
                  <Chip
                    label={complaint.priority}
                    size="small"
                    icon={<FlagOutlined sx={{ fontSize: "12px !important" }} />}
                    sx={{
                      bgcolor: priorityCfg.bg,
                      color: priorityCfg.color,
                      border: `1px solid ${priorityCfg.border}`,
                      fontWeight: 700,
                      borderRadius: "7px",
                      height: 26,
                      "& .MuiChip-icon": { color: priorityCfg.color },
                    }}
                  />
                  <Chip
                    label={complaint.category?.name || complaint.aiCategory || "Uncategorized"}
                    size="small"
                    icon={<CategoryOutlined sx={{ fontSize: "12px !important" }} />}
                    sx={{
                      bgcolor: "#f8fafc",
                      color: "#475569",
                      border: "1px solid #e2e8f0",
                      fontWeight: 600,
                      borderRadius: "7px",
                      height: 26,
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Timeline Card */}
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #f1f5f9",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
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
                    <HistoryOutlined sx={{ fontSize: 18, color: "#6366f1" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                      Activity Timeline
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {updates.length} update{updates.length !== 1 ? "s" : ""}
                    </Typography>
                  </Box>
                </Stack>

                {updates.length === 0 ? (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                      borderRadius: 3,
                      bgcolor: "#f8fafc",
                      border: "2px dashed #e2e8f0",
                    }}
                  >
                    <HistoryOutlined sx={{ fontSize: 36, color: "#cbd5e1", mb: 1 }} />
                    <Typography variant="body2" color="textSecondary" fontWeight={500}>
                      No updates yet. Check back soon.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={0}>
                    {updates.map((update, index) => {
                      const isLast = index === updates.length - 1;
                      const { date, time } = formatDate(update.createdAt);
                      return (
                        <Box key={update.id} sx={{ display: "flex", gap: 2.5 }}>
                          {/* Rail */}
                          <Stack alignItems="center" sx={{ minWidth: 28, pt: "14px", flexShrink: 0 }}>
                            <Box
                              sx={{
                                width: isLast ? 28 : 24,
                                height: isLast ? 28 : 24,
                                borderRadius: "50%",
                                bgcolor: isLast ? "#6366f1" : "#eef2ff",
                                border: isLast ? "none" : "2px solid #c7d2fe",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                boxShadow: isLast ? "0 0 0 4px rgba(99,102,241,0.15)" : "none",
                                zIndex: 1,
                              }}
                            >
                              {isLast
                                ? <CheckCircleOutline sx={{ color: "#fff", fontSize: 15 }} />
                                : <RadioButtonUnchecked sx={{ color: "#6366f1", fontSize: 13 }} />
                              }
                            </Box>
                            {index < updates.length - 1 && (
                              <Box sx={{ width: 2, flex: 1, minHeight: 20, bgcolor: "#e2e8f0", mt: 1 }} />
                            )}
                          </Stack>

                          {/* Content */}
                          <Box
                            sx={{
                              flex: 1,
                              pb: 3,
                              pt: "10px",
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
                              <Typography variant="body2" fontWeight={700} color="#0f172a" sx={{ lineHeight: 1.5, flex: 1, pr: 2 }}>
                                {update.message}
                              </Typography>
                              {isLast && (
                                <Chip
                                  label="Latest"
                                  size="small"
                                  sx={{
                                    bgcolor: "#eef2ff",
                                    color: "#6366f1",
                                    fontWeight: 700,
                                    fontSize: "0.6rem",
                                    height: 20,
                                    borderRadius: "5px",
                                    flexShrink: 0,
                                    "& .MuiChip-label": { px: 0.8 },
                                  }}
                                />
                              )}
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <AccessTime sx={{ fontSize: 12, color: "#94a3b8" }} />
                                <Typography variant="caption" color="textSecondary">
                                  {date} · {time}
                                </Typography>
                              </Stack>
                              {update.updatedBy && (
                                <Stack direction="row" alignItems="center" spacing={0.6}>
                                  <Avatar
                                    sx={{ width: 16, height: 16, bgcolor: "#eef2ff", border: "1px solid #c7d2fe" }}
                                  >
                                    <Person sx={{ fontSize: 10, color: "#6366f1" }} />
                                  </Avatar>
                                  <Typography variant="caption" sx={{ color: "#6366f1", fontWeight: 700 }}>
                                    {update.updatedBy.name}
                                  </Typography>
                                </Stack>
                              )}
                            </Stack>
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: 4,
                mt: 3
              }}
            >

              <CardContent>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  mb={2}
                >
                  Comments
                </Typography>

                {comments.map(comment => (

                  <Box
                    key={comment.id}
                    mb={2}
                  >

                    <Typography
                      fontWeight={600}
                    >
                      {comment.user?.name}
                    </Typography>

                    <Typography>
                      {comment.message}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {
                        new Date(
                          comment.createdAt
                        ).toLocaleString()
                      }
                    </Typography>

                    <Divider
                      sx={{ mt: 1 }}
                    />

                  </Box>

                ))}

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Add Comment"
                  value={commentText}
                  onChange={(e) =>
                    setCommentText(
                      e.target.value
                    )
                  }
                  sx={{ mt: 2 }}
                />

                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={addComment}
                >
                  Post Comment
                </Button>

              </CardContent>

            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #f1f5f9",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
                position: { md: "sticky" },
                top: { md: 88 },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InfoOutlined sx={{ fontSize: 18, color: "#64748b" }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                    Complaint Info
                  </Typography>
                </Stack>

                <Stack spacing={2.5}>
                  {/* Created At */}
                  <InfoRow label="Created At">
                    <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mt: 0.3 }}>
                      <AccessTime sx={{ fontSize: 14, color: "#94a3b8" }} />
                      <Typography variant="body2" fontWeight={600} color="#0f172a">
                        {createdAt.date}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {createdAt.time}
                      </Typography>
                    </Stack>
                  </InfoRow>

                  <Divider sx={{ borderColor: "#f1f5f9" }} />

                  {/* Reporter */}
                  <InfoRow label="Reporter">
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 0.5 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: "#eef2ff",
                          color: "#6366f1",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          borderRadius: "10px",
                          border: "1px solid #c7d2fe",
                        }}
                      >
                        {complaint.user?.name?.charAt(0).toUpperCase() || "U"}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#0f172a">
                          {complaint.user?.name || "Unknown"}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {complaint.user?.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </InfoRow>

                  <Divider sx={{ borderColor: "#f1f5f9" }} />

                  {/* Technician */}
                  <InfoRow label="Assigned Technician">
                    {complaint.technician?.name ? (
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 0.5 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "#ecfdf5",
                            color: "#10b981",
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            borderRadius: "10px",
                            border: "1px solid #a7f3d0",
                          }}
                        >
                          {complaint.technician.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700} color="#0f172a">
                            {complaint.technician.name}
                          </Typography>
                          <Chip
                            label="Assigned"
                            size="small"
                            sx={{
                              bgcolor: "#ecfdf5",
                              color: "#16a34a",
                              fontWeight: 700,
                              fontSize: "0.62rem",
                              height: 18,
                              borderRadius: "5px",
                              mt: 0.3,
                              "& .MuiChip-label": { px: 0.8 },
                            }}
                          />
                        </Box>
                      </Stack>
                    ) : (
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            bgcolor: "#f8fafc",
                            border: "2px dashed #e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Engineering sx={{ fontSize: 18, color: "#cbd5e1" }} />
                        </Box>
                        <Typography variant="body2" color="textSecondary" fontWeight={500}>
                          Not yet assigned
                        </Typography>
                      </Stack>
                    )}
                  </InfoRow>

                  <Divider sx={{ borderColor: "#f1f5f9" }} />

                  {/* AI Category */}
                  <InfoRow label="AI Category">
                    {complaint.aiCategory ? (
                      <Chip
                        label={complaint.aiCategory}
                        size="small"
                        icon={<CategoryOutlined sx={{ fontSize: "13px !important" }} />}
                        sx={{
                          mt: 0.5,
                          bgcolor: "#f5f3ff",
                          color: "#7c3aed",
                          border: "1px solid #ddd6fe",
                          fontWeight: 700,
                          borderRadius: "7px",
                          height: 26,
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary" fontWeight={500} sx={{ mt: 0.3 }}>
                        Not available
                      </Typography>
                    )}
                  </InfoRow>

                  {/* Attachment */}
                  {complaint.attachmentUrl && (
                    <>
                      <Divider sx={{ borderColor: "#f1f5f9" }} />
                      <InfoRow label="Attachment">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AttachFile sx={{ fontSize: 15 }} />}
                          href={complaint.attachmentUrl}
                          target="_blank"
                          sx={{
                            mt: 0.5,
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            borderColor: "#c7d2fe",
                            color: "#6366f1",
                            "&:hover": { borderColor: "#6366f1", bgcolor: "#eef2ff" },
                          }}
                        >
                          View Attachment
                        </Button>
                      </InfoRow>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default ComplaintDetails;