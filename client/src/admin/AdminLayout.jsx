import React, { useState } from 'react';
import { Box, Drawer, List, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Divider, ListItemButton } from '@mui/material';
import Footer from '../components/Footer';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa', overflow: 'hidden', '::-webkit-scrollbar': { display: 'none' } }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #232f3e 60%, #5b86e5 100%)',
            color: '#fff',
            borderRight: 0,
            boxShadow: '4px 0 32px 0 rgba(91,134,229,0.20)',
            transition: 'background 0.4s',
          },
          display: { xs: 'none', md: 'block' },
        }}
        open
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
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
        </Box>
      </Drawer>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            background: '#232f3e',
            color: '#fff',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.value}
                component={NavLink}
                to={`/admin/${item.value}`}
                onClick={() => setDrawerOpen(false)}
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
        </Box>
      </Drawer>
      {/* Topbar */}
      <AppBar position="fixed" sx={{ zIndex: 1201, background: '#fff', color: '#232f3e', boxShadow: 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { md: 'none' } }} onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={900} color="primary.main" sx={{ flexGrow: 1, letterSpacing: '-1.5px' }}>
            Admin Panel
          </Typography>

          <IconButton onClick={() => navigate('/')} sx={{ ml: 2, background: 'linear-gradient(90deg,#5b86e5,#febd69)', color: '#232f3e', boxShadow: 2, borderRadius: 2 }} title="Go to Home">
            <HomeIcon />
          </IconButton>
        </Toolbar>
        <Divider />
      </AppBar>
      {/* Main Content + Footer */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml: { md: `${drawerWidth}px` }, width: '100%' }}>
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, mt: 10, overflow: 'hidden', '::-webkit-scrollbar': { display: 'none' }, pb: { xs: 14, md: 14 } }}>
  <Outlet />
</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
