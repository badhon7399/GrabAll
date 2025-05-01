import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Badge, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, useMediaQuery, InputBase, alpha } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

// New robust SearchBar component
function SearchBar({ sx = {}, onSearch }) {
  const [query, setQuery] = useState("");
  const handleChange = (e) => setQuery(e.target.value);
  const handleClear = () => setQuery("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    // You can add navigation or search logic here
    // Example: navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        position: 'relative',
        borderRadius: 3,
        background: `linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.10) 100%)`,
        backgroundColor: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)', // for Safari
        border: '1.5px solid rgba(255,255,255,0.4)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.28)',
        },
        ml: 2,
        mr: 2,
        width: { xs: '100%', sm: 340 },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <InputBase
        placeholder="Search products…"
        value={query}
        onChange={handleChange}
        sx={{ ml: 2, flex: 1, fontSize: 16, fontWeight: 500 }}
        inputProps={{ 'aria-label': 'search' }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleClear();
        }}
      />
      {query && (
        <IconButton size="small" onClick={handleClear} sx={{ mr: 0.5 }} aria-label="clear search">
          <ClearIcon fontSize="small" />
        </IconButton>
      )}
      <IconButton type="submit" color="primary" sx={{ mr: 1 }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Box>
  );
}

import { useAuth } from '../utils/AuthContext';

const baseNavItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About us', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

const Header = ({ cartCount = 0, onCartClick }) => {
  const { user } = useAuth();
  const navItems = user?.isAdmin
    ? [...baseNavItems.slice(0, 2), { label: 'Admin', to: '/admin' }, ...baseNavItems.slice(2)]
    : baseNavItems;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the main nav bar on admin panel routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <AppBar position="fixed" color="inherit" elevation={1} sx={{ zIndex: 1201, px: { xs: 0, sm: 2 }, height: { xs: 58, sm: 72 } }}>
        <Toolbar sx={{ minHeight: { xs: 58, sm: 72 }, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: 'inline-flex', md: 'none' }, mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src={logo} alt="Logo" style={{ height: 38, marginRight: 12 }} />
              <Typography variant="h5" fontWeight={900} color="primary" sx={{ letterSpacing: '-1.5px', display: { xs: 'none', sm: 'block' } }}>
                GrabAll
              </Typography>
            </Box>

            {/* Search bar - always show beside logo, on both desktop and mobile */}
            <Box sx={{
              flexGrow: 1,
              ml: { xs: 0.5, sm: 4 },
              maxWidth: { xs: 'calc(100vw - 60px)', sm: 420 }, // Even longer on mobile
              minWidth: { xs: 0, sm: 200 },
              display: { xs: 'flex', sm: 'flex' },
              alignItems: 'center',
              transition: 'max-width 0.2s',
            }}>
              <SearchBar sx={{ width: '100%', minWidth: 0, fontSize: { xs: 14, sm: 16 }, px: { xs: 0.25, sm: 2 }, py: { xs: 0.5, sm: 1 } }} onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            {navItems.map((item) => (
              <Button key={item.label} component={RouterLink} to={item.to} color="inherit" sx={{ fontWeight: 700, fontSize: { xs: '0.95rem', sm: '1.08rem' } }}>
                {item.label}
              </Button>
            ))}
            <IconButton color="primary" component={RouterLink} to="/profile" sx={{ ml: 1, display: { xs: 'none', md: 'inline-flex' } }}>
              <AccountCircleIcon />
            </IconButton>
          </Box>
          <IconButton color="primary" onClick={onCartClick ? onCartClick : () => {window.location.href = '/cart';}} sx={{ ml: { xs: 0, sm: 2 } }}>
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Spacer to prevent content from being hidden behind the fixed navbar */}
      <Box sx={{ height: { xs: 58, sm: 72 } }} />
      {isMobile && (
        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}>
          <Box sx={{ width: 260, p: 2 }} role="presentation">
            {/* Mobile Search Bar (optional duplicate for Drawer quick access) */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', ml: 2 }}>
              <SearchBar sx={{ width: '100%' }} onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />
            </Box>
            <List>
              {navItems.map((item) => (
                <ListItemButton key={item.to} onClick={() => {
                  handleDrawerToggle();
                  navigate(item.to);
                }}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
              <Divider />
              <ListItemButton component={RouterLink} to="/cart" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <ShoppingCartIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Cart" />
              </ListItemButton>
              <ListItemButton component={RouterLink} to="/profile" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <AccountCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default Header;
