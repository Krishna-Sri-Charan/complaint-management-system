import { useState } from "react";
import { TextField, Button, Box, Typography, Paper, Link, MenuItem, Stack } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

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

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #4F46E5 0%, #10B981 100%)", // Greenish gradient for register
      p: 2 
    }}>
      <Paper elevation={10} sx={{ 
        p: 4, 
        width: "100%", 
        maxWidth: 450, 
        borderRadius: 4 
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", mb: 1 }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Join the system to start resolving issues.
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            select
            label="I am a..."
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <MenuItem value="USER">Student / User</MenuItem>
            <MenuItem value="TECHNICIAN">Technician</MenuItem>
            <MenuItem value="ADMIN">Administrator</MenuItem>
          </TextField>

          <Button
            fullWidth
            size="large"
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleRegister}
            sx={{ py: 1.5, fontWeight: 700, borderRadius: 2, bgcolor: "#10B981", '&:hover': { bgcolor: '#059669' } }}
          >
            Register
          </Button>
        </Stack>

        <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Link component="button" onClick={() => navigate("/")} sx={{ fontWeight: 700, textDecoration: "none" }}>
            Login here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default RegisterPage;