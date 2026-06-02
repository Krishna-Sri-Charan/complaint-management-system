import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
} from "@mui/material";

import {
  EmojiEventsOutlined,
  LeaderboardOutlined,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "./Layout";
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
      setData(res.data.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch technician performance data.");
    } finally {
      setLoading(false);
    }
  };

  const getCompletionConfig = (rate) => {
    if (rate >= 80) return { color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0", barColor: "#10b981" };
    if (rate >= 50) return { color: "#d97706", bg: "#fef3c7", border: "#fde68a", barColor: "#f59e0b" };
    return { color: "#dc2626", bg: "#fee2e2", border: "#fecaca", barColor: "#ef4444" };
  };

  const getAvatarColor = (name) => {
    const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  const getRankBadge = (index) => {
    if (index === 0) return { emoji: "🥇", color: "#d97706", bg: "#fef3c7", border: "#fde68a" };
    if (index === 1) return { emoji: "🥈", color: "#64748b", bg: "#f1f5f9", border: "#e2e8f0" };
    if (index === 2) return { emoji: "🥉", color: "#b45309", bg: "#fef3c7", border: "#fde68a" };
    return null;
  };

  // Sort by completion rate descending for ranking
  const sorted = [...data].sort((a, b) => b.completionRate - a.completionRate);

  if (loading) {
    return <Layout><CommonLoader /></Layout>;
  }

  if (error) {
    return <Layout><ErrorMessage message={error} /></Layout>;
  }

  return (
    <Card
      sx={{
        mt: 4,
        borderRadius: 3,
        border: "1px solid #f1f5f9",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
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
              Technician Performance
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Ranked by completion rate
            </Typography>
          </Box>
        </Stack>

        {/* Table */}
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              {["Rank", "Technician", "Assigned", "Resolved", "Completion Rate"].map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#94a3b8",
                    borderBottom: "1px solid #f1f5f9",
                    py: 1.2,
                    px: 1.5,
                    bgcolor: "#fafafa",
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
                    "&:hover": { bgcolor: "#fafafa" },
                    "&:last-child td": { borderBottom: "none" },
                    transition: "background 0.15s",
                  }}
                >
                  {/* Rank */}
                  <TableCell sx={{ borderBottom: "1px solid #f8fafc", py: 1.8, px: 1.5, width: 60 }}>
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
                          fontSize: "0.85rem",
                        }}
                      >
                        {rank.emoji}
                      </Box>
                    ) : (
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "#94a3b8",
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

                  {/* Technician */}
                  <TableCell sx={{ borderBottom: "1px solid #f8fafc", py: 1.8, px: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          bgcolor: `${avatarColor}18`,
                          color: avatarColor,
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          borderRadius: "9px",
                          border: `1px solid ${avatarColor}30`,
                          flexShrink: 0,
                        }}
                      >
                        {tech.technicianName?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight={700} color="#0f172a">
                        {tech.technicianName}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Assigned */}
                  <TableCell sx={{ borderBottom: "1px solid #f8fafc", py: 1.8, px: 1.5 }}>
                    <Chip
                      label={tech.assignedComplaints}
                      size="small"
                      sx={{
                        bgcolor: "#eef2ff",
                        color: "#6366f1",
                        fontWeight: 800,
                        borderRadius: "7px",
                        height: 24,
                        fontSize: "0.78rem",
                        border: "1px solid #c7d2fe",
                        "& .MuiChip-label": { px: 1.2 },
                      }}
                    />
                  </TableCell>

                  {/* Resolved */}
                  <TableCell sx={{ borderBottom: "1px solid #f8fafc", py: 1.8, px: 1.5 }}>
                    <Chip
                      label={tech.resolvedComplaints}
                      size="small"
                      sx={{
                        bgcolor: "#ecfdf5",
                        color: "#16a34a",
                        fontWeight: 800,
                        borderRadius: "7px",
                        height: 24,
                        fontSize: "0.78rem",
                        border: "1px solid #bbf7d0",
                        "& .MuiChip-label": { px: 1.2 },
                      }}
                    />
                  </TableCell>

                  {/* Completion Rate */}
                  <TableCell sx={{ borderBottom: "1px solid #f8fafc", py: 1.8, px: 1.5 }}>
                    <Stack spacing={0.8}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Chip
                          label={`${tech.completionRate.toFixed(1)}%`}
                          size="small"
                          sx={{
                            bgcolor: cfg.bg,
                            color: cfg.color,
                            border: `1px solid ${cfg.border}`,
                            fontWeight: 800,
                            borderRadius: "7px",
                            height: 22,
                            fontSize: "0.72rem",
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(tech.completionRate, 100)}
                        sx={{
                          height: 5,
                          borderRadius: 99,
                          bgcolor: `${cfg.barColor}18`,
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

        {/* Empty state */}
        {data.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              borderRadius: 3,
              bgcolor: "#f8fafc",
              border: "2px dashed #e2e8f0",
              mt: 1,
            }}
          >
            <EmojiEventsOutlined sx={{ fontSize: 36, color: "#cbd5e1", mb: 1 }} />
            <Typography variant="body2" color="textSecondary" fontWeight={500}>
              No performance data available yet.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default TechnicianPerformanceTable;