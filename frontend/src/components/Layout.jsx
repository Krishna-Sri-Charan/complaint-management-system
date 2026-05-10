import React from "react";
import { 
  AppBar, Toolbar, Typography, Drawer, List, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Box, CssBaseline, Divider, Avatar 
} from "@mui/material";
import { 
  Dashboard, AddCircle, ListAlt, AdminPanelSettings, 
  Engineering, Logout 
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 260; // Slightly wider for better text breathing room

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Navigation items array for cleaner code
  const menuItems = [];

  if (user?.role === "USER") {

    menuItems.push(
      { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
      { text: "Create Complaint", icon: <AddCircle />, path: "/create-complaint" },
      { text: "My Complaints", icon: <ListAlt />, path: "/my-complaints" }
    );
  }

  if (user?.role === "ADMIN") {

    menuItems.push(
      { text: "Admin Dashboard", icon: <AdminPanelSettings />, path: "/admin-dashboard" }
    );
  }

  if (user?.role === "TECHNICIAN") {

    menuItems.push(
      { text: "Technician Dashboard", icon: <Engineering />, path: "/technician-dashboard" }
    );
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f7fe", minHeight: "100vh" }}>
      <CssBaseline />
      
      {/* Header AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)", // Modern "Glass" effect
          color: "#2D3748",
          boxShadow: "none",
          borderBottom: "1px solid #e2e8f0"
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#4F46E5" }}>
            CMS <span style={{ color: "#2D3748", fontWeight: 400 }}>| Portal</span>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
             <Typography variant="body2" sx={{ fontWeight: 600 }}>Hello, Student</Typography>
             <Avatar sx={{ bgcolor: "#4F46E5", width: 35, height: 35 }}>S</Avatar>
          </Box>
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
            borderRight: "1px dashed #e2e8f0",
            bgcolor: "#f4f7fe"
          },
        }}
      >
        <Toolbar /> {/* Spacer */}
        <Box sx={{ overflow: "auto", mt: 2, px: 2 }}>
          <List>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton 
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: isActive ? "#ffffff" : "transparent",
                      boxShadow: isActive ? "0px 4px 12px rgba(0,0,0,0.05)" : "none",
                      color: isActive ? "#4F46E5" : "#718096",
                      "&:hover": {
                        backgroundColor: "#ffffff",
                        color: "#4F46E5",
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: isActive ? "#4F46E5" : "#718096", minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 700 : 500 }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          
          <Divider sx={{ my: 2, borderStyle: "dashed" }} />
          
          {/* Logout Button */}
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => navigate("/")}
              sx={{ borderRadius: "12px", color: "#E53E3E" }}
            >
              <ListItemIcon sx={{ color: "#E53E3E", minWidth: 40 }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 4, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px" 
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;