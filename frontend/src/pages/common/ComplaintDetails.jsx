import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Card, CardContent, Typography, Chip, Grid, Stack, Divider, Button,
  CircularProgress, Alert, Avatar, TextField
} from "@mui/material";
import {
  AttachFile, CategoryOutlined, FlagOutlined,
  CheckCircleOutline, PendingActions, ErrorOutline,
  HistoryOutlined, InfoOutlined, ChatBubbleOutline
} from "@mui/icons-material";
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

  const fetchData = useCallback(async () => {
    try {
      const [complaintRes, updatesRes, commentsRes] = await Promise.all([
        API.get(`/complaints/${id}`),
        API.get(`/complaints/${id}/updates`),
        API.get(`/comments/${id}`)
      ]);
      setComplaint(complaintRes.data.data);
      setUpdates(updatesRes.data || []);
      setComments(commentsRes.data.data || []);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch complaint details.");
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case "OPEN":
        return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", label: "Open", icon: <ErrorOutline sx={{ fontSize: 14 }} /> };
      case "IN_PROGRESS":
        return { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "In Progress", icon: <PendingActions sx={{ fontSize: 14 }} /> };
      case "RESOLVED":
        return { color: "#16a34a", bg: "#ecfdf5", border: "#a7f3d0", label: "Resolved", icon: <CheckCircleOutline sx={{ fontSize: 14 }} /> };
      default:
        return { color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0", label: status, icon: null };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH": return { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" };
      case "MEDIUM": return { color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
      default: return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" };
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const InfoRow = ({ label, children }) => (
    <Box>
      <Typography
        variant="caption"
        sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem", display: "block", mb: 0.5 }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );

  const addComment = async () => {
    if (!commentText.trim()) return;
    try {
      await API.post("/comments", { complaintId: id, message: commentText });
      setCommentText("");
      fetchData();
    } catch(error) {
      console.log(error);
      setError("Failed to add comment.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Stack alignItems="center" spacing={2}>
            <CircularProgress sx={{ color: "#6366f1" }} />
            <Typography variant="body2" color="textSecondary" fontWeight={600}>
              Loading complaint details...
            </Typography>
          </Stack>
        </Box>
      </Layout>
    );
  }

  if (error) return <Layout><Box sx={{ maxWidth: 600, mx: "auto", mt: 6 }}><ErrorMessage message={error} /></Box></Layout>;
  if (!complaint) return <Layout><Box sx={{ maxWidth: 600, mx: "auto", mt: 6 }}><Alert severity="error" sx={{ borderRadius: 3, fontWeight: 600 }}>Complaint not found.</Alert></Box></Layout>;

  const statusCfg = getStatusConfig(complaint.status);
  const priorityCfg = getPriorityConfig(complaint.priority);
  const createdAt = formatDate(complaint.createdAt);

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1, sm: 2 } }}>

        {/* Dynamic Page Header */}
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
          <Box sx={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.08)", top: -60, right: 80, pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(99,102,241,0.04)", bottom: -30, right: 30, pointerEvents: "none" }} />

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ position: "relative", zIndex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2.5}>
              <Box sx={{ width: 48, height: 48, borderRadius: "13px", bgcolor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <InfoOutlined sx={{ color: "#818cf8", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                  Ticket Reference #{complaint.id}
                </Typography>
                <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.3 }}>
                  Submitted {createdAt.date} at {createdAt.time}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Chip label={statusCfg.label} icon={statusCfg.icon} size="small" sx={{ bgcolor: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}`, fontWeight: 700, borderRadius: "6px" }} />
              <Chip label={`${complaint.priority} Priority`} size="small" icon={<FlagOutlined sx={{ fontSize: "13px !important" }} />} sx={{ bgcolor: priorityCfg.bg, color: priorityCfg.color, border: `1px solid ${priorityCfg.border}`, fontWeight: 700, borderRadius: "6px" }} />
            </Stack>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* Main Left Column */}
          <Grid size={{ xs: 12, md: 8 }}>
            
            {/* Complaint Text & Data Body */}
            <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "none", mb: 3 }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight={800} color="#0f172a" sx={{ mb: 2, letterSpacing: "-0.3px" }}>
                  {complaint.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#334155", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                  {complaint.description || "No description description logged."}
                </Typography>
                
                {complaint.attachmentUrl && (
                  <Box sx={{ mt: 3, p: 2, borderRadius: 2, border: "1px solid #e2e8f0", bgcolor: "#f8fafc", display: "inline-flex", alignItems: "center" }}>
                    <AttachFile sx={{ color: "#64748b", mr: 1, fontSize: 18 }} />
                    <Button variant="text" size="small" href={`http://localhost:8080/uploads/${complaint.attachmentUrl}`} target="_blank" sx={{ textTransform: "none", fontWeight: 700, color: "#4f46e5" }}>
                      View Filed Attachment Document
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Timeline Process Updates History Tracking Box */}
            <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "none", mb: 3 }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <HistoryOutlined sx={{ fontSize: 18, color: "#6366f1" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a">Ticket Journey Log</Typography>
                    <Typography variant="caption" color="textSecondary">{updates.length} updates recorded</Typography>
                  </Box>
                </Stack>

                {updates.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4, borderRadius: 2, bgcolor: "#f8fafc", border: "1px dashed #cbd5e1" }}>
                    <Typography variant="body2" color="textSecondary" fontWeight={500}>No transaction events recorded yet.</Typography>
                  </Box>
                ) : (
                  <Stack spacing={0}>
                    {updates.map((update, index) => {
                      const isLast = index === updates.length - 1;
                      const { date, time } = formatDate(update.createdAt);
                      return (
                        <Box key={update.id} sx={{ display: "flex", gap: 3 }}>
                          <Stack alignItems="center" sx={{ minWidth: 24, position: "relative", alignSelf: "stretch" }}>
                            <Box sx={{ width: isLast ? 14 : 10, height: isLast ? 14 : 10, borderRadius: "50%", bgcolor: isLast ? "#6366f1" : "#cbd5e1", mt: "18px", zIndex: 2, boxShadow: isLast ? "0 0 0 4px rgba(99,102,241,0.15)" : "none" }} />
                            {index < updates.length - 1 && (
                              <Box sx={{ width: 2, flexGrow: 1, bgcolor: "#e2e8f0", position: "absolute", top: "24px", bottom: 0, left: "50%", transform: "translateX(-50%)", zIndex: 1 }} />
                            )}
                          </Stack>
                          <Box sx={{ pb: 3, pt: 1.5, flexGrow: 1 }}>
                            <Typography variant="body2" fontWeight={700} color="#1e293b" sx={{ lineHeight: 1.5, mb: 0.5 }}>
                              {update.message}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {date} · {time} {update.updatedBy && `by ${update.updatedBy.name}`}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </CardContent>
            </Card>

            {/* Comments Message Feeds Section */}
            <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "none" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChatBubbleOutline sx={{ fontSize: 18, color: "#10b981" }} />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={800} color="#0f172a">Discussion Activity Log</Typography>
                </Stack>

                <Stack spacing={2.5} sx={{ mb: 3 }}>
                  {comments.map((comment) => (
                    <Box key={comment.id} sx={{ p: 2, borderRadius: 2.5, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", maxWidth: "85%" }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.8 }}>
                        <Typography variant="subtitle2" fontWeight={800} color="#1e293b">{comment.user?.name}</Typography>
                        <Typography variant="caption" color="textSecondary">· {formatDate(comment.createdAt).date} {formatDate(comment.createdAt).time}</Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6 }}>{comment.message}</Typography>
                    </Box>
                  ))}
                </Stack>

                <TextField fullWidth multiline rows={3} placeholder="Type team updates, internal log notes, or inquiries here..." value={commentText} onChange={(e) => setCommentText(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }} />
                <Button variant="contained" disableElevation onClick={addComment} sx={{ mt: 2, borderRadius: "8px", bgcolor: "#0f172a", textTransform: "none", fontWeight: 600, px: 3, "&:hover": { bgcolor: "#1e293b" } }}>
                  Dispatch Comment
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side sticky Context Meta Sidebar Info Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "none", position: { md: "sticky" }, top: { md: 24 } }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ mb: 3 }}>Core Meta Properties</Typography>
                <Stack spacing={2.5}>
                  <InfoRow label="System Audit Category">
                    <Chip label={complaint.category?.name || complaint.aiCategory || "Uncategorized"} size="small" icon={<CategoryOutlined sx={{ fontSize: "12px !important" }} />} sx={{ mt: 0.5, bgcolor: "#f1f5f9", color: "#334155", fontWeight: 700, borderRadius: "6px" }} />
                  </InfoRow>
                  <Divider />
                  <InfoRow label="Filing User Profile">
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "#eef2ff", color: "#6366f1", fontWeight: 800, fontSize: "0.8rem", borderRadius: "8px", border: "1px solid #c7d2fe" }}>
                        {complaint.user?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#0f172a">{complaint.user?.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{complaint.user?.email}</Typography>
                      </Box>
                    </Stack>
                  </InfoRow>
                  <Divider />
                  <InfoRow label="Assigned Technician">
                    {complaint.technician?.name ? (
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#ecfdf5", color: "#10b981", fontWeight: 800, fontSize: "0.8rem", borderRadius: "8px", border: "1px solid #a7f3d0" }}>
                          {complaint.technician.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" fontWeight={700} color="#0f172a">{complaint.technician.name}</Typography>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="textSecondary" fontWeight={600} sx={{ mt: 0.5 }}>Unassigned</Typography>
                    )}
                  </InfoRow>
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