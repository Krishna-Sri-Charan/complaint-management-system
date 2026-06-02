import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography,
  TextField, Button, Grid, Alert, Stack,
  Avatar, Chip, Divider, InputAdornment,
  IconButton,
} from "@mui/material";
import {
  PersonOutlined, EmailOutlined,
  LockOutlined, BadgeOutlined,
  Visibility, VisibilityOff,
  SaveOutlined, KeyOutlined,
  CheckCircleOutline, EditOutlined,
} from "@mui/icons-material";
import Layout from "../../components/Layout";
import API from "../../services/api";
import ErrorMessage from "../../components/ErrorMessage";

function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "", role: "" });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setProfile(res.data.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch profile");
    }
    finally {
      setError("");
    }
  };

  const updateProfile = async () => {
    try {
      await API.put("/users/profile", { name: profile.name, email: profile.email });
      setSuccessMessage("Profile updated successfully");
      setErrorMessage("");
    } catch (error) {
      setError("Failed to update profile");
    }
    finally {
      setError("");
    }
  };

  const changePassword = async () => {
    try {
      await API.post("/users/change-password", passwordData);
      setSuccessMessage("Password changed successfully");
      setErrorMessage("");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      setError("Failed to change password");
    }
    finally {
      setError("");
    }
  };

  const getRoleConfig = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN": return { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" };
      case "TECHNICIAN": return { color: "#d97706", bg: "#fef3c7", border: "#fde68a" };
      default: return { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" };
    }
  };

  const getInitials = (name) =>
    (name || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const roleConfig = getRoleConfig(profile.role);

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      "&:hover fieldset": { borderColor: "#6366f1" },
      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#6366f1" },
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 860, mx: "auto" }}>

        {/* Page Header */}
        <Box
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.1)", top: -60, right: 80, pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(99,102,241,0.07)", bottom: -30, right: 30, pointerEvents: "none" }} />

          <Stack direction="row" alignItems="center" spacing={2.5} sx={{ position: "relative", zIndex: 1 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                fontWeight: 900,
                fontSize: "1.4rem",
                borderRadius: "18px",
                border: "2px solid rgba(255,255,255,0.2)",
                flexShrink: 0,
              }}
            >
              {getInitials(profile.name)}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
                {profile.name || "My Profile"}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.55)" }}>
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
                      borderRadius: "5px",
                      "& .MuiChip-label": { px: 0.8 },
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Alerts */}
        {successMessage && (
          <Alert
            severity="success"
            icon={<CheckCircleOutline fontSize="small" />}
            onClose={() => setSuccessMessage("")}
            sx={{ mb: 3, borderRadius: 2.5, fontWeight: 600, border: "1px solid #bbf7d0" }}
          >
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert
            severity="error"
            onClose={() => setErrorMessage("")}
            sx={{ mb: 3, borderRadius: 2.5, fontWeight: 600 }}
          >
            {errorMessage}
          </Alert>
        )}

        <Grid container spacing={3}>

          {/* Profile Info Card */}
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #f1f5f9",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                {/* Section Header */}
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
                    <EditOutlined sx={{ fontSize: 18, color: "#6366f1" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                      Profile Information
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Update your name and email address
                    </Typography>
                  </Box>
                </Stack>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem", display: "block", mb: 0.8 }}>
                      Full Name
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Your full name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlined sx={{ fontSize: 18, color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem", display: "block", mb: 0.8 }}>
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Your email address"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined sx={{ fontSize: 18, color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem", display: "block", mb: 0.8 }}>
                      Role
                    </Typography>
                    <TextField
                      fullWidth
                      value={profile.role}
                      disabled
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeOutlined sx={{ fontSize: 18, color: "#cbd5e1" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2.5,
                          bgcolor: "#f8fafc",
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#94a3b8",
                          fontWeight: 600,
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: "#f1f5f9" }} />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveOutlined sx={{ fontSize: 17 }} />}
                    onClick={updateProfile}
                    sx={{
                      borderRadius: 2.5,
                      bgcolor: "#4f46e5",
                      fontWeight: 700,
                      px: 3.5,
                      boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
                      "&:hover": { bgcolor: "#4338ca", boxShadow: "0 6px 20px rgba(79,70,229,0.45)" },
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Change Password Card */}
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #f1f5f9",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                {/* Section Header */}
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      bgcolor: "#fef3c7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <KeyOutlined sx={{ fontSize: 18, color: "#f59e0b" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                      Change Password
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Keep your account secure with a strong password
                    </Typography>
                  </Box>
                </Stack>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem", display: "block", mb: 0.8 }}>
                      Current Password
                    </Typography>
                    <TextField
                      fullWidth
                      type={showOld ? "text" : "password"}
                      placeholder="Enter current password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined sx={{ fontSize: 18, color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setShowOld(!showOld)} edge="end">
                              {showOld
                                ? <VisibilityOff sx={{ fontSize: 17, color: "#94a3b8" }} />
                                : <Visibility sx={{ fontSize: 17, color: "#94a3b8" }} />
                              }
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.65rem", display: "block", mb: 0.8 }}>
                      New Password
                    </Typography>
                    <TextField
                      fullWidth
                      type={showNew ? "text" : "password"}
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined sx={{ fontSize: 18, color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setShowNew(!showNew)} edge="end">
                              {showNew
                                ? <VisibilityOff sx={{ fontSize: 17, color: "#94a3b8" }} />
                                : <Visibility sx={{ fontSize: 17, color: "#94a3b8" }} />
                              }
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: "#f1f5f9" }} />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<KeyOutlined sx={{ fontSize: 17 }} />}
                    onClick={changePassword}
                    sx={{
                      borderRadius: 2.5,
                      bgcolor: "#f59e0b",
                      fontWeight: 700,
                      px: 3.5,
                      color: "#fff",
                      boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
                      "&:hover": { bgcolor: "#d97706", boxShadow: "0 6px 20px rgba(245,158,11,0.45)" },
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