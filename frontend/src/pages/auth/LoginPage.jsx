import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField, Button, Box, Typography, Paper,
  Link, Stack, InputAdornment, IconButton,
} from "@mui/material";
import {
  Login as LoginIcon, EmailOutlined,
  LockOutlined, Visibility, VisibilityOff,
} from "@mui/icons-material";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/resolveflow-logo.png";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("cms_token");
    const storedUser = localStorage.getItem("cms_user");
    if (!token || !storedUser) return;
    const user = JSON.parse(storedUser);
    if (user.role === "ADMIN") navigate("/admin-dashboard");
    else if (user.role === "TECHNICIAN") navigate("/technician-dashboard");
    else navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const userData = res.data.data;
      login(userData);
      if (userData.role === "ADMIN") navigate("/admin-dashboard");
      else if (userData.role === "TECHNICIAN") navigate("/technician-dashboard");
      else navigate("/dashboard");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(99,102,241,0.08)", top: -100, right: -80, pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "rgba(139,92,246,0.07)", bottom: -60, left: -60, pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "rgba(99,102,241,0.05)", bottom: 100, right: 100, pointerEvents: "none" }} />

      <Box sx={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <Stack alignItems="center" sx={{ mb: 3 }}>
          <Box
            component="img"
            src={logo}
            alt="ResolveFlow AI"
            sx={{
              width: 100,
              height: 100,
              mb: 1.5,
              objectFit: "contain",
              filter: "drop-shadow(0 8px 24px rgba(59,130,246,0.35))",
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.5px",
            }}
          >
            ResolveFlow AI
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.7)",
              mt: 0.5,
              textAlign: "center",
            }}
          >
            AI-Powered Complaint Resolution Platform
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                mb: 0.5,
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
            >
              Sign in to access your ResolveFlow AI workspace.
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ fontSize: 18, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  "&:hover fieldset": { borderColor: "#6366f1" },
                  "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ fontSize: 18, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword
                        ? <VisibilityOff sx={{ fontSize: 18, color: "#94a3b8" }} />
                        : <Visibility sx={{ fontSize: 18, color: "#94a3b8" }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  "&:hover fieldset": { borderColor: "#6366f1" },
                  "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                },
              }}
            />

            <Button
              fullWidth
              size="large"
              variant="contained"
              endIcon={<LoginIcon />}
              onClick={handleLogin}
              sx={{
                py: 1.5,
                fontWeight: 700,
                borderRadius: 2.5,
                bgcolor: "#4f46e5",
                fontSize: "0.95rem",
                boxShadow: "0 4px 16px rgba(79,70,229,0.4)",
                "&:hover": {
                  bgcolor: "#4338ca",
                  boxShadow: "0 6px 24px rgba(79,70,229,0.5)",
                },
              }}
            >
              Sign In
            </Button>

            <Typography variant="body2" textAlign="center" sx={{ mt: 3, color: "#64748b" }}>
              Don't have an account?{" "}
              <Link
                component="button"
                onClick={() => navigate("/register")}
                sx={{
                  fontWeight: 700,
                  textDecoration: "none",
                  color: "#6366f1",
                  "&:hover": { color: "#4f46e5" },
                }}
                >
                Create Account
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

export default LoginPage;