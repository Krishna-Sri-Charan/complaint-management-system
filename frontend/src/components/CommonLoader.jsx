import { Box, CircularProgress, Typography } from "@mui/material";

function CommonLoader({ message = "Synchronizing environment assets..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "340px",
        gap: 2.5,
      }}
    >
      <CircularProgress size={36} thickness={4.5} sx={{ color: "#6366f1" }} />
      <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, letterSpacing: "0.2px" }}>
        {message}
      </Typography>
    </Box>
  );
}

export default CommonLoader;