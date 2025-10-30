import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
import WorkIcon from "@mui/icons-material/Work";
import SearchIcon from "@mui/icons-material/Search";

const drawerWidth = 240;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const menuItems = [
    { text: "Dashboard", path: "/", icon: <HomeIcon /> },
    { text: "İşletmeler", path: "/business", icon: <WorkIcon /> },
    { text: "Müşteriler", path: "/customers", icon: <GroupsIcon /> },
    { text: "Emlaklar", path: "/properties", icon: <RealEstateAgentIcon /> },
    { text: "Emlak Arama", path: "/search", icon: <SearchIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#1976d2" }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            🏡 Emlak Yönetim Sistemi
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f4f6f8",
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path; 

            return (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: isActive ? "#1976d2" : "transparent",
                  color: isActive ? "#fff" : "inherit",
                  "&:hover": {
                    backgroundColor: isActive ? "#1565c0" : "#e0e0e0",
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: isActive ? "#fff" : "inherit", minWidth: 40 }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
