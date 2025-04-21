import { AppBar, Toolbar, Typography, Box, Button, IconButton, Badge, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, useMediaQuery } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Admin', to: '/admin' },
  { label: 'About us', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

const Header = ({ cartCount = 0, onCartClick }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  return (
    <AppBar position="sticky" color="inherit" elevation={1} sx={{ zIndex: 1201 }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
  {/* Logo SVG Placeholder */}
  <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', mr: 1 }}>
    <img src={logo} alt="GrabAll Logo" style={{ height: 48, width: 'auto', display: 'block' }} />
    <Typography
      variant="h4"
      fontWeight={900}
      color="primary.main"
      sx={{ letterSpacing: '-1.5px', cursor: 'pointer', userSelect: 'none', ml: 1 }}
    >
      GrabAll
    </Typography>
  </Box>
</Box>
        {/* Desktop Nav */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navItems.map((item) => (
              <Button key={item.to} color="primary" component={RouterLink} to={item.to} sx={{ fontWeight: 700 }}>
                {item.label}
              </Button>
            ))}
            <IconButton color="primary" component={RouterLink} to="/cart" sx={{ ml: 1 }}>
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton color="primary" sx={{ ml: 1 }}>
              <AccountCircleIcon />
            </IconButton>
          </Box>
        )}
        {/* Mobile Nav */}
        {isMobile && (
          <>
            <IconButton color="primary" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
              <Box sx={{ width: 240 }} role="presentation" onClick={handleDrawerToggle}>
                <List>
                  {navItems.map((item) => (
                    <ListItemButton key={item.to} onClick={() => navigate(item.to)}>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  ))}
                  <Divider />
                  <ListItemButton component={RouterLink} to="/cart">
                    <ListItemIcon>
                      <ShoppingCartIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Cart" />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <AccountCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Account" />
                  </ListItemButton>
                </List>
              </Box>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
