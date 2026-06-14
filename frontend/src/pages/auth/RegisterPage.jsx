import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField, Button, Box, Typography, Paper,
  Link, MenuItem, Stack, InputAdornment, IconButton,
  Chip,
} from "@mui/material";
import {
  PersonAdd, PersonOutlined, EmailOutlined,
  LockOutlined, Visibility, VisibilityOff,
  BadgeOutlined,
} from "@mui/icons-material";
import API from "../../services/api";
import logo from "../../assets/resolveflow-logo.png";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      navigate("/");
    } catch (error) {
      alert("Registration failed");
    }
  };

  const roleOptions = [
    { value: "USER", label: "User", color: "#6366f1", bg: "#eef2ff" },
    { value: "TECHNICIAN", label: "Technician", color: "#d97706", bg: "#fef3c7" },
    { value: "ADMIN", label: "Administrator", color: "#dc2626", bg: "#fee2e2" },
  ];

  const selectedRole = roleOptions.find((r) => r.value === form.role);

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
      <Box sx={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "rgba(16,185,129,0.08)", top: -80, right: -60, pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", background: "rgba(16,185,129,0.06)", bottom: -50, left: -50, pointerEvents: "none" }} />

      <Box sx={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }}>
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
              filter: "drop-shadow(0 8px 24px rgba(16,185,129,0.35))",
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
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mb: 0.5 }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Create your ResolveFlow AI account and start managing complaints efficiently.
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlined sx={{ fontSize: 18, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  "&:hover fieldset": { borderColor: "#10b981" },
                  "&.Mui-focused fieldset": { borderColor: "#10b981" },
                },
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              onChange={handleChange}
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
                  "&:hover fieldset": { borderColor: "#10b981" },
                  "&.Mui-focused fieldset": { borderColor: "#10b981" },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
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
                  "&:hover fieldset": { borderColor: "#10b981" },
                  "&.Mui-focused fieldset": { borderColor: "#10b981" },
                },
              }}
            />

            <Box>
              <TextField
                fullWidth
                select
                label="I am a..."
                name="role"
                value={form.role}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlined sx={{ fontSize: 18, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    "&:hover fieldset": { borderColor: "#10b981" },
                    "&.Mui-focused fieldset": { borderColor: "#10b981" },
                  },
                }}
              >
                {roleOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: opt.color, flexShrink: 0 }} />
                      <Typography variant="body2" fontWeight={600}>{opt.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
              {selectedRole && (
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`Registering as: ${selectedRole.label}`}
                    size="small"
                    sx={{
                      bgcolor: selectedRole.bg,
                      color: selectedRole.color,
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      borderRadius: "7px",
                      height: 22,
                    }}
                  />
                </Box>
              )}
            </Box>

            <Button
              fullWidth
              size="large"
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handleRegister}
              sx={{
                py: 1.5,
                fontWeight: 700,
                borderRadius: 2.5,
                bgcolor: "#4f46e5",
                fontSize: "0.95rem",
                boxShadow: "0 4px 16px rgba(79,70,229,0.4)",
                "&:hover": {
                  bgcolor: "#3730a3",
                  boxShadow: "0 6px 24px rgba(79,70,229,0.5)",
                },
              }}
            >
              Create Account
            </Button>

            <Typography variant="body2" textAlign="center" sx={{ mt: 3, color: "#64748b" }}>
              Already have an account?{" "}
              <Link
                component="button"
                onClick={() => navigate("/")}
                sx={{
                  fontWeight: 700,
                  textDecoration: "none",
                  color: "#4f46e5",
                  "&:hover": { color: "#3730a3" },
                }}
                >
                Sign In
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

export default RegisterPage;