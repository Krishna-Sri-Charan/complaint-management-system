import { useEffect, useState } from "react";
import {
  AppBar, Toolbar, Typography, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, CssBaseline, Divider, Avatar, Snackbar, Alert, Stack, Chip
} from "@mui/material";
import {
  Dashboard, AddCircle, ListAlt, AdminPanelSettings,
  Engineering, Logout, Person, NotificationsActiveOutlined
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import stompClient from "../services/socket";
import logo from "../assets/resolveflow-logo.png";

const drawerWidth = 260;

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    stompClient.onConnect = () => {
      stompClient.subscribe("/topic/notifications", (message) => {
        setNotification(message.body);
      });
    };
    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, []);

  const menuItems = [];

  if (user?.role === "USER") {
    menuItems.push(
      { text: "Dashboard", icon: <Dashboard fontSize="small" />, path: "/dashboard" },
      { text: "Create Complaint", icon: <AddCircle fontSize="small" />, path: "/create-complaint" },
      { text: "My Complaints", icon: <ListAlt fontSize="small" />, path: "/my-complaints" }
    );
  }

  if (user?.role === "ADMIN") {
    menuItems.push(
      { text: "Admin Dashboard", icon: <AdminPanelSettings fontSize="small" />, path: "/admin-dashboard" }
    );
  }

  if (user?.role === "TECHNICIAN") {
    menuItems.push(
      { text: "Technician Dashboard", icon: <Engineering fontSize="small" />, path: "/technician-dashboard" }
    );
  }

  menuItems.push({
    text: "My Account Profile",
    icon: <Person fontSize="small" />,
    path: "/profile"
  });

  const getInitials = (name) =>
    (name || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const getRoleBadge = (role) => {
    const map = {
      ADMIN: { label: "Admin", color: "#dc2626", bg: "#fee2e2", border: "#fecaca" },
      TECHNICIAN: { label: "Technician", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
      USER: { label: "User", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
    };
    return map[role?.toUpperCase()] || map["USER"];
  };

  const badge = getRoleBadge(user?.role);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Modern High-End Top Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          color: "#0f172a",
          boxShadow: "none",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: "64px !important", px: { xs: 2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box component="img" src={logo} alt="ResolveFlow AI" sx={{ width: 44, height: 44, objectFit: "contain" }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.1, letterSpacing: "-0.3px", fontSize: "0.95rem" }}>
                ResolveFlow AI
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", lineHeight: 1, fontSize: "0.65rem", fontWeight: 500 }}>
                Smart Complaint Resolution
              </Typography>
            </Box>
          </Stack>

          {/* Right Header Controls */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ width: 34, height: 34, background: "linear-gradient(135deg, #4f46e5, #7c3aed)", fontWeight: 800, fontSize: "0.78rem", border: "2px solid #fff", boxShadow: "0 2px 8px rgba(79,70,229,0.15)" }}>
              {getInitials(user?.name)}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>
                {user?.name || "Active Session"}
              </Typography>
              <Chip label={badge.label} size="small" sx={{ bgcolor: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, fontWeight: 700, height: 16, fontSize: "0.58rem", mt: 0.4, borderRadius: "4px" }} />
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Persistent Left Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            boxShadow: "none"
          },
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important" }} />
        <Box sx={{ overflow: "auto", py: 3, px: 2, display: "flex", flexDirection: "column", height: "100%" }}>
          <Typography variant="caption" sx={{ px: 1.5, mb: 1.5, color: "#94a3b8", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", display: "block" }}>
            Workspace Hub
          </Typography>

          <List disablePadding sx={{ gap: 0.5, display: "flex", flexDirection: "column" }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: "8px",
                      px: 2,
                      py: 1.2,
                      bgcolor: isActive ? "#f0fdf4" : "transparent", // Soft modern color tracking background context
                      color: isActive ? "#16a34a" : "#475569",
                      "&:hover": {
                        bgcolor: isActive ? "#f0fdf4" : "#f8fafc",
                        color: "#16a34a",
                        "& .MuiListItemIcon-root": { color: "#16a34a" }
                      },
                      transition: "all 0.15s ease-in-out"
                    }}
                  >
                    <ListItemIcon sx={{ color: isActive ? "#16a34a" : "#64748b", minWidth: 32, transition: "color 0.15s" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: isActive ? 700 : 500 }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Box sx={{ flexGrow: 1 }} />
          <Divider sx={{ mb: 2, borderColor: "#f1f5f9" }} />

          {/* Secure Logout Endpoint Row */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={logout}
              sx={{
                borderRadius: "8px",
                px: 2,
                py: 1.2,
                color: "#dc2626",
                "&:hover": { bgcolor: "#fee2e2", color: "#b91c1c" },
                transition: "all 0.15s ease-in-out"
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sign out" primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      {/* Main Framework Layout Container Element Context View */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 3, md: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: "64px", minHeight: "calc(100vh - 64px)" }}>
        {children}
      </Box>

      {/* Async Notification Dispatch Broker Toast Layer Overlay */}
      <Snackbar open={!!notification} autoHideDuration={4500} onClose={() => setNotification("")} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity="info" icon={<NotificationsActiveOutlined fontSize="small" />} sx={{ borderRadius: "8px", fontWeight: 600, bgcolor: "#0f172a", color: "#fff", boxShadow: "0 12px 32px rgba(0,0,0,0.15)", "& .MuiAlert-icon": { color: "#818cf8" } }}>
          ResolveFlow Engine: {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Layout;