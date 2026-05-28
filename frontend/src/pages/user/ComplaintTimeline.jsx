import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Chip,
  Avatar,
  Skeleton,
} from "@mui/material";
import {
  CheckCircle,
  RadioButtonUnchecked,
  Person,
  AccessTime,
  HistoryOutlined,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import Layout from "../../components/Layout";

function ComplaintTimeline() {
  const { id } = useParams();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const res = await API.get(`/complaints/${id}/updates`);
      setUpdates(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStepColor = (index, total) => {
    if (index === total - 1) return "#6366f1"; // latest
    if (index === total - 2) return "#10b981"; // second latest
    return "#94a3b8"; // older
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Page Header */}
        <Box
          sx={{
            mb: 5,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(99,102,241,0.15)",
              top: -50,
              right: 60,
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(99,102,241,0.1)",
              bottom: -30,
              right: 20,
              pointerEvents: "none",
            }}
          />
          <Stack direction="row" alignItems="center" spacing={2} sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "13px",
                bgcolor: "rgba(99,102,241,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(99,102,241,0.4)",
              }}
            >
              <HistoryOutlined sx={{ color: "#a5b4fc", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                Activity Timeline
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mt: 0.3 }}>
                Complaint #{id} — Full update history
              </Typography>
            </Box>
          </Stack>
        </Box>

        {loading ? (
          <Stack spacing={3}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ display: "flex", gap: 2.5 }}>
                <Stack alignItems="center" spacing={0.5}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="rectangular" width={2} height={80} />
                </Stack>
                <Skeleton variant="rounded" height={100} sx={{ flex: 1, borderRadius: 3 }} />
              </Box>
            ))}
          </Stack>
        ) : updates.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              borderRadius: 4,
              bgcolor: "#f8fafc",
              border: "2px dashed #e2e8f0",
            }}
          >
            <HistoryOutlined sx={{ fontSize: 48, color: "#cbd5e1", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#94a3b8" }}>
              No updates yet
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Updates will appear here as your complaint is processed.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0}>
            {updates.map((update, index) => {
              const isLast = index === updates.length - 1;
              const isFirst = index === 0;
              const dotColor = getStepColor(index, updates.length);
              const { date, time } = formatDate(update.createdAt);

              return (
                <Box
                  key={update.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2.5,
                  }}
                >
                  {/* Timeline Rail */}
                  <Stack
                    alignItems="center"
                    sx={{ minWidth: 32, pt: "14px", flexShrink: 0 }}
                  >
                    {/* Dot */}
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      {isLast ? (
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: dotColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 0 0 4px ${dotColor}22`,
                          }}
                        >
                          <CheckCircle sx={{ color: "#fff", fontSize: 18 }} />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: `${dotColor}18`,
                            border: `2px solid ${dotColor}55`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <RadioButtonUnchecked sx={{ color: dotColor, fontSize: 16 }} />
                        </Box>
                      )}
                    </Box>

                    {/* Vertical line */}
                    {!isFirst && (
                      <Box
                        sx={{
                          position: "absolute",
                          width: 2,
                          bgcolor: "#e2e8f0",
                          top: 0,
                          bottom: 0,
                          left: "calc(16px + 15px)",
                          transform: "translateX(-50%)",
                          zIndex: 0,
                        }}
                      />
                    )}

                    {index < updates.length - 1 && (
                      <Box
                        sx={{
                          width: 2,
                          flex: 1,
                          minHeight: 24,
                          bgcolor: "#e2e8f0",
                          mt: 1,
                          mb: 0,
                        }}
                      />
                    )}
                  </Stack>

                  {/* Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      flex: 1,
                      p: 3,
                      mb: 2.5,
                      borderRadius: 3,
                      border: isLast
                        ? "1px solid #c7d2fe"
                        : "1px solid #f1f5f9",
                      bgcolor: isLast ? "#fafaff" : "#ffffff",
                      boxShadow: isLast
                        ? "0px 4px 20px rgba(99,102,241,0.08)"
                        : "0px 2px 8px rgba(0,0,0,0.03)",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: "0px 8px 24px rgba(0,0,0,0.08)" },
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={1}
                      sx={{ mb: 1.5 }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={700}
                        color={isLast ? "#1e1b4b" : "#0f172a"}
                        sx={{ lineHeight: 1.5 }}
                      >
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
                            fontSize: "0.65rem",
                            height: 22,
                            borderRadius: "6px",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                      <Stack direction="row" alignItems="center" spacing={0.6}>
                        <AccessTime sx={{ fontSize: 13, color: "#94a3b8" }} />
                        <Typography variant="caption" color="textSecondary" fontWeight={500}>
                          {date} · {time}
                        </Typography>
                      </Stack>

                      {update.updatedBy && (
                        <Stack direction="row" alignItems="center" spacing={0.8}>
                          <Avatar
                            sx={{
                              width: 18,
                              height: 18,
                              bgcolor: "#eef2ff",
                              border: "1px solid #c7d2fe",
                            }}
                          >
                            <Person sx={{ fontSize: 12, color: "#6366f1" }} />
                          </Avatar>
                          <Typography
                            variant="caption"
                            sx={{ color: "#6366f1", fontWeight: 700 }}
                          >
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