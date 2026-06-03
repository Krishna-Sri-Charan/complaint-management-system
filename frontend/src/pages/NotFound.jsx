import { Box, Typography, Button, Stack, Chip } from "@mui/material";
import { HomeOutlined, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box sx={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(99,102,241,0.07)", top: -150, right: -100, pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "rgba(139,92,246,0.06)", bottom: -80, left: -80, pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.05)", bottom: 120, right: 120, pointerEvents: "none" }} />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* 404 large text */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "7rem", md: "10rem" },
            lineHeight: 1,
            letterSpacing: "-4px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mb: 1,
            userSelect: "none",
          }}
        >
          404
        </Typography>

        {/* Badge */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Chip
            label="Page Not Found"
            size="small"
            sx={{
              bgcolor: "rgba(99,102,241,0.2)",
              color: "#a5b4fc",
              fontWeight: 700,
              fontSize: "0.75rem",
              borderRadius: "8px",
              height: 28,
              border: "1px solid rgba(99,102,241,0.3)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          />
        </Box>

        {/* Heading */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#fff",
            mb: 1.5,
            letterSpacing: "-0.5px",
          }}
        >
          Oops! Lost in space.
        </Typography>

        {/* Subtext */}
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.5)",
            mb: 5,
            maxWidth: 420,
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </Typography>

        {/* Actions */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeOutlined />}
            onClick={() => navigate("/dashboard")}
            sx={{
              borderRadius: 2.5,
              bgcolor: "#6366f1",
              fontWeight: 700,
              px: 4,
              py: 1.4,
              fontSize: "0.9rem",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
              "&:hover": {
                bgcolor: "#4f46e5",
                boxShadow: "0 6px 28px rgba(99,102,241,0.5)",
              },
            }}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              px: 4,
              py: 1.4,
              fontSize: "0.9rem",
              borderColor: "rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.7)",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.4)",
                bgcolor: "rgba(255,255,255,0.06)",
                color: "#fff",
              },
            }}
          >
            Go Back
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default NotFound;