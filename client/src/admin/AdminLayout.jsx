import React from 'react';
import { Box, Drawer, List, ListItemIcon, ListItemText, ListItemButton, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', value: 'dashboard', icon: <DashboardIcon /> },
  { label: 'Products', value: 'products', icon: <InventoryIcon /> },
  { label: 'Orders', value: 'orders', icon: <ShoppingCartIcon /> },
  { label: 'Users', value: 'users', icon: <PeopleIcon /> },
  { label: 'Content', value: 'content', icon: <ArticleIcon /> },
  { label: 'Slides', value: 'slides', icon: <ArticleIcon /> },
  { label: 'Settings', value: 'settings', icon: <SettingsIcon /> },
];

const drawerWidth = 270;

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            height: '100vh',
            overflowY: 'auto',
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #232f3e 60%, #5b86e5 100%)',
            color: '#fff',
            borderRight: 0,
            boxShadow: '4px 0 32px 0 rgba(91,134,229,0.20)',
            transition: 'background 0.4s',
          },
          display: 'block',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1300,
        }}
        open
      >
        <Toolbar />
        <List>
          {/* Home Button */}
          <ListItemButton
            key="home"
            component={NavLink}
            to="/"
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              transition: 'background 0.2s, transform 0.2s',
              background: 'linear-gradient(90deg,#febd69 0%,#5b86e5 100%)',
              color: '#232f3e',
              boxShadow: 6,
              '&:hover': {
                background: 'linear-gradient(90deg,#5b86e5 0%,#febd69 100%)',
                color: '#fff',
                transform: 'scale(1.04) translateX(4px)',
                boxShadow: 4,
              },
            }}
          >
            <ListItemIcon sx={{ color: '#232f3e' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Back to Home" />
          </ListItemButton>
          {/* Admin nav items */}
          {navItems.map((item) => (
            <ListItemButton
              key={item.value}
              component={NavLink}
              to={`/admin/${item.value}`}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                transition: 'background 0.2s, transform 0.2s',
                '&:hover': {
                  background: 'linear-gradient(90deg,#febd69 0%,#5b86e5 100%)',
                  color: '#232f3e',
                  transform: 'scale(1.04) translateX(4px)',
                  boxShadow: 4,
                },
                '&.active': {
                  background: 'linear-gradient(90deg,#febd69 0%,#5b86e5 100%)',
                  color: '#232f3e',
                  boxShadow: 6,
                },
              }}
            >
              <ListItemIcon sx={{ color: '#febd69' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml: `${drawerWidth}px`, width: `calc(100% - ${drawerWidth}px)`, minHeight: '100vh', overflow: 'auto' }}>
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, mt: 2, minHeight: '100vh', overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
