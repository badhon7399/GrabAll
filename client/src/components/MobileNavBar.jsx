import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', icon: <HomeIcon />, to: '/' },
  { label: 'Shop', icon: <ShoppingBagIcon />, to: '/shop' },
  { label: 'Favourites', icon: <FavoriteIcon />, to: '/favourites' },
  { label: 'Account', icon: <AccountCircleIcon />, to: '/profile' }
];

export default function MobileNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const current = navItems.findIndex(item => location.pathname.startsWith(item.to));
  return (
    <Paper elevation={8} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { xs: 'block', md: 'none' }, zIndex: 1300 }}>
      <BottomNavigation
        showLabels
        value={current === -1 ? 0 : current}
        onChange={(e, newValue) => {
          navigate(navItems[newValue].to);
        }}
        sx={{ height: 58, borderTop: '1px solid #eee', background: '#fff' }}
      >
        {navItems.map((item, i) => (
          <BottomNavigationAction key={item.label} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
