import { useState } from "react";
import { TextField, Button, Box, Typography, Paper, Link, Divider, Stack } from "@mui/material";
import { Login as LoginIcon, ChevronRight } from "@mui/icons-material";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("userEmail", email);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", // Vibrant student vibe
      p: 2 
    }}>
      <Paper elevation={10} sx={{ 
        p: 4, 
        width: "100%", 
        maxWidth: 400, 
        borderRadius: 4,
        textAlign: "center" 
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#4F46E5", mb: 1 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Manage your complaints efficiently.
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            size="large"
            variant="contained"
            endIcon={<LoginIcon />}
            onClick={handleLogin}
            sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
          >
            Sign In
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <Link component="button" onClick={() => navigate("/register")} sx={{ fontWeight: 700, textDecoration: "none" }}>
            Register Now
          </Link>
        </Typography>

        <Divider sx={{ my: 3 }}>Quick Access (Dev Mode)</Divider>
        
        <Stack direction="row" spacing={1}>
          <Button fullWidth variant="outlined" color="secondary" size="small" onClick={() => navigate("/technician-dashboard")}>
            Technician
          </Button>
          <Button fullWidth variant="outlined" color="secondary" size="small" onClick={() => navigate("/admin-dashboard")}>
            Admin
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default LoginPage;