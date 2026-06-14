import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button, 
  Grid, Alert, Stack, Avatar, Chip, Divider, InputAdornment, IconButton
} from "@mui/material";
import {
  PersonOutlined, EmailOutlined, LockOutlined, BadgeOutlined,
  Visibility, VisibilityOff, SaveOutlined, KeyOutlined, CheckCircleOutline, EditOutlined
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import API from "../../services/api";

function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "", role: "" });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setProfile(res.data.data);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to fetch profile in ResolveFlow AI");
    }
  };

  const updateProfile = async () => {
    try {
      await API.put("/users/profile", { name: profile.name, email: profile.email });
      setSuccessMessage("Profile updated successfully in ResolveFlow AI");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to update profile in ResolveFlow AI");
    }
  };

  const changePassword = async () => {
    try {
      await API.post("/users/change-password", passwordData);
      setSuccessMessage("Password updated successfully in ResolveFlow AI");
      setErrorMessage("");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      setErrorMessage("Failed to update password in ResolveFlow AI.");
    }
  };

  const getRoleConfig = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN": return { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" };
      case "TECHNICIAN": return { color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
      default: return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" };
    }
  };

  const getInitials = (name) =>
    (name || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const roleConfig = getRoleConfig(profile.role);

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "&:hover fieldset": { borderColor: "#6366f1" },
      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#6366f1" },
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 1, sm: 2 } }}>

        {/* Page Header */}
        <Box
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            border: "1px solid #334155",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
          }}
        >
          <Box sx={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.08)", top: -60, right: 80, pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(99,102,241,0.04)", bottom: -30, right: 30, pointerEvents: "none" }} />

          <Stack direction="row" alignItems="center" spacing={2.5} sx={{ position: "relative", zIndex: 1 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                fontWeight: 900,
                fontSize: "1.3rem",
                borderRadius: "14px",
                border: "2px solid rgba(255,255,255,0.25)",
                flexShrink: 0,
              }}
            >
              {getInitials(profile.name)}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                {profile.name || "User Profile"}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 0.5, flexWrap: "wrap", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  {profile.email}
                </Typography>
                {profile.role && (
                  <Chip
                    label={profile.role}
                    size="small"
                    sx={{
                      bgcolor: roleConfig.bg,
                      color: roleConfig.color,
                      border: `1px solid ${roleConfig.border}`,
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      height: 20,
                      borderRadius: "4px",
                    }}
                  />
                )}
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.45)",
                  display: "block",
                  mt: 0.3,
                }}
              >
                ResolveFlow AI Workspace
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Global Feedback Notifiers */}
        {successMessage && (
          <Alert severity="success" icon={<CheckCircleOutline fontSize="small" />} onClose={() => setSuccessMessage("")} sx={{ mb: 3, borderRadius: "8px", fontWeight: 600, border: "1px solid #a7f3d0", bgcolor: "#ecfdf5", color: "#065f46" }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" onClose={() => setErrorMessage("")} sx={{ mb: 3, borderRadius: "8px", fontWeight: 600 }}>
            {errorMessage}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Profile Information Block */}
          <Grid size={{ xs: 12 }}>
            <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "none" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3.5 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <EditOutlined sx={{ fontSize: 18, color: "#6366f1" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a">Account Settings</Typography>
                    <Typography variant="caption" color="textSecondary">Modify account identity tokens and sync profile communications</Typography>
                  </Box>
                </Stack>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem", display: "block", mb: 1 }}>Full Identity Name</Typography>
                    <TextField fullWidth placeholder="Name string" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlined sx={{ fontSize: 18, color: "#94a3b8" }} /></InputAdornment> }} sx={fieldSx} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem", display: "block", mb: 1 }}>Communication Email</Typography>
                    <TextField fullWidth placeholder="Email link" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ fontSize: 18, color: "#94a3b8" }} /></InputAdornment> }} sx={fieldSx} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem", display: "block", mb: 1 }}>Assigned Operational Scope Role</Typography>
                    <TextField fullWidth value={profile.role} disabled InputProps={{ startAdornment: <InputAdornment position="start"><BadgeOutlined sx={{ fontSize: 18, color: "#94a3b8" }} /></InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "#f8fafc" }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#64748b", fontWeight: 600 } }} />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3.5, borderColor: "#f1f5f9" }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button 
                    variant="contained" 
                    disableElevation 
                    startIcon={<SaveOutlined sx={{ fontSize: 16 }} />} 
                    onClick={updateProfile} 
                    sx={{ 
                      borderRadius: "8px", 
                      bgcolor: "#4f46e5", // Refactored to Theme Indigo
                      fontWeight: 600, 
                      px: 4, 
                      textTransform: "none", 
                      fontSize: "0.85rem", 
                      "&:hover": { bgcolor: "#4338ca" } 
                    }}
                  >
                    Save Profile Updates
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Secure Access Modification Block */}
          <Grid size={{ xs: 12 }}>
            <Card sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "none" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3.5 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <KeyOutlined sx={{ fontSize: 18, color: "#d97706" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a">Security Parameters</Typography>
                    <Typography variant="caption" color="textSecondary">Update password credentials regularly to protect access endpoints</Typography>
                  </Box>
                </Stack>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem", display: "block", mb: 1 }}>Current Credential Password</Typography>
                    <TextField fullWidth type={showOld ? "text" : "password"} placeholder="Verify current secret" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlined sx={{ fontSize: 18, color: "#94a3b8" }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowOld(!showOld)} edge="end">{showOld ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}</IconButton></InputAdornment> }} sx={fieldSx} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem", display: "block", mb: 1 }}>Target Fresh Password Vector</Typography>
                    <TextField fullWidth type={showNew ? "text" : "password"} placeholder="Establish complex alphanumeric" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlined sx={{ fontSize: 18, color: "#94a3b8" }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowNew(!showNew)} edge="end">{showNew ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}</IconButton></InputAdornment> }} sx={fieldSx} />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3.5, borderColor: "#f1f5f9" }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button 
                    variant="contained" 
                    disableElevation 
                    startIcon={<KeyOutlined sx={{ fontSize: 16 }} />} 
                    onClick={changePassword} 
                    sx={{ 
                      borderRadius: "8px", 
                      bgcolor: "#b45309", // Polished to Premium Deep Bronze/Amber
                      fontWeight: 600, 
                      px: 4, 
                      textTransform: "none", 
                      fontSize: "0.85rem", 
                      "&:hover": { bgcolor: "#9a4004" } 
                    }}
                  >
                    Update Password
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default ProfilePage;