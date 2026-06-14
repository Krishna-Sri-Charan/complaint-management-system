import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Paper, Stack, Chip, Avatar } from "@mui/material";
import { CheckCircle, RadioButtonUnchecked, AccessTime, HistoryOutlined } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import Layout from "../../components/Layout";
import CommonLoader from "../../components/CommonLoader";
import ErrorMessage from "../../components/ErrorMessage";

function ComplaintTimeline() {
  const { id } = useParams();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTimeline = useCallback(async () => {
    try {
      const res = await API.get(`/complaints/${id}/updates`);
      setUpdates(res.data || []);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch timeline updates");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  const getStepColor = (index, total) => {
    if (index === total - 1) return "#6366f1"; // Latest event color stamp accent
    if (index === total - 2) return "#10b981"; 
    return "#94a3b8"; 
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  if (loading) return <Layout><CommonLoader /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  return (
    <Layout>
      <Box sx={{ maxWidth: 780, margin: "0 auto", px: { xs: 1, sm: 2 } }}>
        
        {/* Page Header Header */}
        <Box
          sx={{
            mb: 5,
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
          <Box sx={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "rgba(99,102,241,0.08)", top: -50, right: 60, pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", background: "rgba(99,102,241,0.04)", bottom: -30, right: 20, pointerEvents: "none" }} />
          <Stack direction="row" alignItems="center" spacing={2.5} sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: "13px", bgcolor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HistoryOutlined sx={{ color: "#818cf8", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                Lifecycle Audit Timeline
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.3 }}>
                Complaint Reference Tracking ID: #{id} — Real-time event logging metrics
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Empty Activity History View */}
        {updates.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10, borderRadius: 4, bgcolor: "#fff", border: "1px dashed #cbd5e1" }}>
            <HistoryOutlined sx={{ fontSize: 44, color: "#94a3b8", mb: 1.5 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>No operational event items logged</Typography>
            <Typography variant="body2" color="textSecondary">Updates will register automatically here once engineering teams assign your ticket.</Typography>
          </Box>
        ) : (
          /* Core Step Tracker Rail Container */
          <Stack spacing={0} sx={{ position: "relative" }}>
            {updates.map((update, index) => {
              const isLast = index === updates.length - 1;
              const isFirst = index === 0;
              const dotColor = getStepColor(index, updates.length);
              const { date, time } = formatDate(update.createdAt);

              return (
                <Box key={update.id} sx={{ display: "flex", alignItems: "flex-start", gap: 3, position: "relative" }}>
                  
                  {/* Symmetrical Vertical Rail Tracks lines */}
                  <Stack alignItems="center" sx={{ minWidth: 32, pt: "10px", position: "relative", alignSelf: "stretch" }}>
                    <Box sx={{ position: "relative", zIndex: 2 }}>
                      {isLast ? (
                        <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: dotColor, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 4px ${dotColor}22` }}>
                          <CheckCircle sx={{ color: "#fff", fontSize: 18 }} />
                        </Box>
                      ) : (
                        <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: "#fff", border: `2px solid ${dotColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <RadioButtonUnchecked sx={{ color: dotColor, fontSize: 13, strokeWidth: 2 }} />
                        </Box>
                      )}
                    </Box>

                    {/* Linking Line bars segments */}
                    {!isFirst && (
                      <Box sx={{ position: "absolute", width: 2, bgcolor: "#e2e8f0", top: 0, bottom: isLast ? "50%" : 0, left: "50%", transform: "translateX(-50%)", zIndex: 1 }} />
                    )}
                    {!isLast && (
                      <Box sx={{ position: "absolute", width: 2, bgcolor: "#e2e8f0", top: "50%", bottom: 0, left: "50%", transform: "translateX(-50%)", zIndex: 1 }} />
                    )}
                  </Stack>

                  {/* Operational Event Text Cards */}
                  <Paper
                    elevation={0}
                    sx={{
                      flex: 1, p: 3, mb: 3, borderRadius: 3,
                      border: isLast ? "1px solid #c7d2fe" : "1px solid #e2e8f0",
                      bgcolor: isLast ? "#fbfbfe" : "#ffffff",
                      boxShadow: "none",
                      transition: "transform 0.15s ease-in-out",
                      "&:hover": { boxShadow: "0px 6px 20px rgba(0,0,0,0.03)" },
                    }}
                  >
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1} sx={{ mb: 1.5 }}>
                      <Typography variant="body1" fontWeight={700} sx={{ color: "#1e293b", fontSize: "0.92rem", lineHeight: 1.5 }}>
                        {update.message}
                      </Typography>
                      {isLast && (
                        <Chip label="Current State" size="small" sx={{ bgcolor: "#eef2ff", color: "#6366f1", fontWeight: 700, fontSize: "0.62rem", height: 20, borderRadius: "4px" }} />
                      )}
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2.5} flexWrap="wrap" gap={1}>
                      <Stack direction="row" alignItems="center" spacing={0.6}>
                        <AccessTime sx={{ fontSize: 13, color: "#94a3b8" }} />
                        <Typography variant="caption" color="textSecondary" fontWeight={600}>
                          {date} · {time}
                        </Typography>
                      </Stack>

                      {update.updatedBy && (
                        <Stack direction="row" alignItems="center" spacing={0.8}>
                          <Avatar sx={{ width: 20, height: 20, bgcolor: "#eef2ff", border: "1px solid #c7d2fe", fontSize: "0.65rem", fontWeight: 700, color: "#6366f1" }}>
                            {update.updatedBy.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="caption" sx={{ color: "#6366f1", fontWeight: 700 }}>
                            {update.updatedBy.name}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Paper>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
    </Layout>
  );
}

export default ComplaintTimeline;