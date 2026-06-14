import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Typography, Stack, Card, CardContent } from "@mui/material";
import { DonutSmallOutlined } from "@mui/icons-material";

const COLORS = [
  { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" }, // Open — indigo
  { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" }, // In Progress — amber
  { color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" }, // Resolved — emerald
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: "#0f172a",
          color: "#fff",
          px: 2,
          py: 1.2,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
          {payload[0].name}
        </Typography>
        <Typography variant="body2" fontWeight={700}>
          {payload[0].value} complaint{payload[0].value !== 1 ? "s" : ""}
        </Typography>
      </Box>
    );
  }
  return null;
};

function UserStatusChart({ analytics }) {
  const data = [
    { name: "Open", value: analytics?.openComplaints || 0, fill: COLORS[0].color },
    { name: "In Progress", value: analytics?.inProgressComplaints || 0, fill: COLORS[1].color },
    { name: "Resolved", value: analytics?.resolvedComplaints || 0, fill: COLORS[2].color },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        boxShadow: "none",
        height: "auto",
        width: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "#fff7ed", border: "1px solid #ffedd5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DonutSmallOutlined sx={{ fontSize: 20, color: "#f59e0b" }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
              Status Breakdown
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Your complaint states
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", my: 2 }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data} dataKey="value" outerRadius={85} innerRadius={50} paddingAngle={3} strokeWidth={0}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
            <Typography variant="h4" fontWeight={800} color="#0f172a" lineHeight={1}>
              {total}
            </Typography>
            <Typography variant="caption" color="textSecondary" fontWeight={600}>
              Total
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          {data.map((item, i) => {
            const cfg = COLORS[i];
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <Stack key={i} direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1.2}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "3px", bgcolor: cfg.color, flexShrink: 0 }} />
                  <Typography variant="body2" color="textSecondary" fontWeight={600}>
                    {item.name}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" fontWeight={800} color="#0f172a">{item.value}</Typography>
                  <Box sx={{ px: 0.8, py: 0.2, borderRadius: "5px", bgcolor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: cfg.color, fontSize: "0.62rem" }}>{pct}%</Typography>
                  </Box>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default UserStatusChart;