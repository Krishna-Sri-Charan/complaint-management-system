import { React, useEffect, useState } from "react";
import {
  AppBar, Toolbar, Typography, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, CssBaseline, Divider, Avatar, Snackbar, Alert,
  Stack, Chip, Tooltip,
} from "@mui/material";
import {
  Dashboard, AddCircle, ListAlt, AdminPanelSettings,
  Engineering, Logout, NotificationsOutlined, Person
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import stompClient from "../services/socket";

const drawerWidth = 260;

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [notification, setNotification] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
    text: "Profile",
    icon: <Person />,
    path: "/profile"
  });

  const getInitials = (name) =>
    (name || "U")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getRoleBadge = (role) => {
    const map = {
      ADMIN: { label: "Admin", color: "#dc2626", bg: "#fee2e2" },
      TECHNICIAN: { label: "Tech", color: "#d97706", bg: "#fef3c7" },
      USER: { label: "User", color: "#6366f1", bg: "#eef2ff" },
    };
    return map[role] || map["USER"];
  };

  const badge = getRoleBadge(user?.role);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f7fe", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Header AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          color: "#0f172a",
          boxShadow: "none",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: "64px !important" }}>
          {/* Brand */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1, letterSpacing: "-0.3px" }}
              >
                CMS Portal
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8", lineHeight: 1, fontSize: "0.65rem" }}>
                Complaint Management
              </Typography>
            </Box>
          </Stack>

          {/* Right: User */}
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                fontWeight: 800,
                fontSize: "0.78rem",
                border: "2px solid #e0e7ff",
              }}
            >
              {getInitials(user?.name)}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>
                {user?.name || "User"}
              </Typography>
              <Chip
                label={badge.label}
                size="small"
                sx={{
                  bgcolor: badge.bg,
                  color: badge.color,
                  fontWeight: 700,
                  height: 16,
                  fontSize: "0.6rem",
                  borderRadius: "4px",
                  mt: 0.3,
                  "& .MuiChip-label": { px: 0.8 },
                }}
              />
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
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
            boxShadow: "2px 0 12px rgba(0,0,0,0.03)",
          },
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important" }} />

        <Box sx={{ overflow: "auto", py: 2, px: 1.5, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Nav Section Label */}
          <Typography
            variant="caption"
            sx={{
              px: 1.5,
              mb: 1,
              color: "#94a3b8",
              fontWeight: 700,
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Navigation
          </Typography>

          <List disablePadding>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: "10px",
                      px: 1.5,
                      py: 1,
                      backgroundColor: isActive
                        ? "linear-gradient(135deg, #eef2ff, #f5f3ff)"
                        : "transparent",
                      bgcolor: isActive ? "#eef2ff" : "transparent",
                      color: isActive ? "#4f46e5" : "#475569",
                      "&:hover": {
                        bgcolor: isActive ? "#eef2ff" : "#f8fafc",
                        color: "#4f46e5",
                      },
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {isActive && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: "20%",
                          bottom: "20%",
                          width: 3,
                          borderRadius: "0 4px 4px 0",
                          bgcolor: "#4f46e5",
                        }}
                      />
                    )}
                    <ListItemIcon
                      sx={{
                        color: isActive ? "#4f46e5" : "#94a3b8",
                        minWidth: 36,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.85rem",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "#4f46e5" : "#475569",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <Divider sx={{ mb: 1.5, borderColor: "#f1f5f9" }} />

          {/* Logout */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: "10px",
                px: 1.5,
                py: 1,
                color: "#ef4444",
                "&:hover": { bgcolor: "#fee2e2", color: "#dc2626" },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, md: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {children}
      </Box>

      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="info"
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Layout;