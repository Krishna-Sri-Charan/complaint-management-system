import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
} from "@mui/material";
import { EmojiEventsOutlined, LeaderboardOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import API from "../services/api";
import CommonLoader from "./CommonLoader";
import ErrorMessage from "./ErrorMessage";

function TechnicianPerformanceTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const res = await API.get("/analytics/technician-performance");
      setData(res.data.data || []);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch technician performance data.");
    } finally {
      setLoading(false);
    }
  };

  const getCompletionConfig = (rate) => {
    if (rate >= 80) return { color: "#16a34a", bg: "#ecfdf5", border: "#a7f3d0", barColor: "#10b981" };
    if (rate >= 50) return { color: "#d97706", bg: "#fffbeb", border: "#fde68a", barColor: "#f59e0b" };
    return { color: "#dc2626", bg: "#fee2e2", border: "#fecaca", barColor: "#ef4444" };
  };

  const getAvatarColor = (name) => {
    const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  const getRankBadge = (index) => {
    if (index === 0) return { emoji: "🥇", bg: "#fef3c7", border: "#fde68a" };
    if (index === 1) return { emoji: "🥈", bg: "#f1f5f9", border: "#e2e8f0" };
    if (index === 2) return { emoji: "🥉", bg: "#fff7ed", border: "#ffedd5" };
    return null;
  };

  const sorted = [...data].sort((a, b) => b.completionRate - a.completionRate);

  if (loading) return <CommonLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Card
      sx={{
        mt: 4,
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header Block */}
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
            <LeaderboardOutlined sx={{ fontSize: 20, color: "#6366f1" }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
              Technician Performance Leaderboard
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Ranked dynamically by operational completion speed metrics
            </Typography>
          </Box>
        </Stack>

        {/* Table Matrix Framework View */}
        {sorted.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, borderRadius: 3, bgcolor: "#f8fafc", border: "2px dashed #e2e8f0" }}>
            <EmojiEventsOutlined sx={{ fontSize: 36, color: "#cbd5e1", mb: 1 }} />
            <Typography variant="body2" color="textSecondary" fontWeight={500}>
              No performance data available yet.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Rank", "Technician", "Assigned", "Resolved", "Completion Rate"].map((col, index) => (
                    <TableCell
                      key={col}
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        color: "#64748b",
                        borderBottom: "1px solid #e2e8f0",
                        py: 1.5,
                        px: 2,
                        bgcolor: "#f8fafc",
                        "&:first-of-type": { borderRadius: "8px 0 0 8px" },
                        "&:last-of-type": { borderRadius: "0 8px 8px 0" },
                      }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {sorted.map((tech, index) => {
                  const cfg = getCompletionConfig(tech.completionRate);
                  const rank = getRankBadge(index);
                  const avatarColor = getAvatarColor(tech.technicianName);

                  return (
                    <TableRow
                      key={tech.technicianId}
                      sx={{
                        "&:hover": { bgcolor: "#f8fafc" },
                        "&:last-child td": { borderBottom: "none" },
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Rank Column */}
                      <TableCell sx={{ borderBottom: "1px solid #f1f5f9", py: 2, px: 2, width: 80 }}>
                        {rank ? (
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: "8px",
                              bgcolor: rank.bg,
                              border: `1px solid ${rank.border}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.9rem",
                            }}
                          >
                            {rank.emoji}
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: "#64748b",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 28,
                              height: 28,
                            }}
                          >
                            {index + 1}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Name Card Profile Column */}
                      <TableCell sx={{ borderBottom: "1px solid #f1f5f9", py: 2, px: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 34,
                              bgcolor: `${avatarColor}15`,
                              color: avatarColor,
                              fontWeight: 800,
                              fontSize: "0.78rem",
                              borderRadius: "8px",
                              border: `1px solid ${avatarColor}25`,
                              flexShrink: 0,
                            }}
                          >
                            {tech.technicianName?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" fontWeight={700} color="#1e293b">
                            {tech.technicianName}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Ticket Volume Column */}
                      <TableCell sx={{ borderBottom: "1px solid #f1f5f9", py: 2, px: 2 }}>
                        <Chip
                          label={tech.assignedComplaints}
                          size="small"
                          sx={{
                            bgcolor: "#eef2ff",
                            color: "#6366f1",
                            fontWeight: 700,
                            borderRadius: "6px",
                            height: 24,
                            border: "1px solid #c7d2fe",
                          }}
                        />
                      </TableCell>

                      {/* Resolved Track Column */}
                      <TableCell sx={{ borderBottom: "1px solid #f1f5f9", py: 2, px: 2 }}>
                        <Chip
                          label={tech.resolvedComplaints}
                          size="small"
                          sx={{
                            bgcolor: "#ecfdf5",
                            color: "#10b981",
                            fontWeight: 700,
                            borderRadius: "6px",
                            height: 24,
                            border: "1px solid #a7f3d0",
                          }}
                        />
                      </TableCell>

                      {/* Progress Metrics Column */}
                      <TableCell sx={{ borderBottom: "1px solid #f1f5f9", py: 2, px: 2, width: 200 }}>
                        <Stack spacing={0.6}>
                          <Chip
                            label={`${tech.completionRate.toFixed(1)}%`}
                            size="small"
                            sx={{
                              bgcolor: cfg.bg,
                              color: cfg.color,
                              border: `1px solid ${cfg.border}`,
                              fontWeight: 700,
                              borderRadius: "6px",
                              height: 20,
                              fontSize: "0.68rem",
                              alignSelf: "flex-start"
                            }}
                          />
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(tech.completionRate, 100)}
                            sx={{
                              height: 6,
                              borderRadius: 99,
                              bgcolor: `${cfg.barColor}15`,
                              "& .MuiLinearProgress-bar": {
                                bgcolor: cfg.barColor,
                                borderRadius: 99,
                              },
                            }}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default TechnicianPerformanceTable;