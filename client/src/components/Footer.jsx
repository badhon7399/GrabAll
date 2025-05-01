import React from 'react';
import { Box, Typography, Link, Grid, Stack, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const paymentIcons = [
  'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visa.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mastercard.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/paypal.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amex.svg',
  'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/bkash.svg'
];

const Footer = () => (
  <Box sx={{ width: '100%', background: '#232f3e', zIndex: 0 }}>
  <Box component="footer" sx={{
    mt: 2, pt: 3, pb: 1, px: { xs: 2, md: 8 },
    color: '#fff',
    maxWidth: 1400,
    mx: 'auto',
    minHeight: 120
  }}>
    <Grid container spacing={7.9} justifyContent="start" textAlign={{ xs: 'center', md: 'left' }}>
      <Grid item xs={12} md={3}>
        <Typography variant="h5" fontWeight={900} color="#ffc107" mb={1} sx={{ letterSpacing: '-1.5px' }}>GrabAll</Typography>
        <Typography variant="body2" mb={1} color="#f1f1f1">Your trusted Bangladeshi e-commerce destination for authentic products, fast delivery, and secure payments.</Typography>
        <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
          <IconButton color="inherit" href="https://www.facebook.com/profile.php?id=61570204013599" target="_blank"><FacebookIcon /></IconButton>
          <IconButton color="inherit" href="https://twitter.com" target="_blank"><TwitterIcon /></IconButton>
          <IconButton color="inherit" href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fgraballgoods%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExU0hoOFNmWDQ0a0RmNWlHVwEeoh2tpOSSqWdJ8Vy-NWb7VeAsXBOW_c2mCZEpVRyFNHNvYCCnKv0JZgLHepo_aem_y_7S4hSIhQQ3Pw6suy9GqQ&h=AT343dFXOrFEzjxweStSxAoo1oCq_hTVn2q91yIagi5O3KL5WRowDjuREbwSKBuyX3IQKUn_7M6O2XniZXQx9PM447QYbjHsjt-PbokxJ-q7or2deeJ7s3j65wO_TPNPrQHW" target="_blank"><InstagramIcon /></IconButton>
          <IconButton color="inherit" href="https://youtube.com" target="_blank"><YouTubeIcon /></IconButton>
        </Stack>
      </Grid>
      <Grid item xs={6} md={2}>
        <Typography fontWeight={700} mb={1} color="#ffc107">Shop</Typography>
        <Stack spacing={0.5}>
          <Link href="/shop" color="inherit" underline="hover">All Products</Link>
          <Link href="/categories" color="inherit" underline="hover">Categories</Link>
          <Link href="/offers" color="inherit" underline="hover">Offers</Link>
          <Link href="/new" color="inherit" underline="hover">New Arrivals</Link>
        </Stack>
      </Grid>
      <Grid item xs={6} md={2}>
        <Typography fontWeight={700} mb={1} color="#ffc107">Customer Service</Typography>
        <Stack spacing={0.5}>
          <Link href="/help" color="inherit" underline="hover">Help Center</Link>
          <Link href="/returns" color="inherit" underline="hover">Returns</Link>
          <Link href="/shipping" color="inherit" underline="hover">Shipping</Link>
          <Link href="/faq" color="inherit" underline="hover">FAQ</Link>
        </Stack>
      </Grid>
      <Grid item xs={12} md={3}>
        <Typography fontWeight={700} mb={1} color="#ffc107">Contact Us</Typography>
        <Stack spacing={1} alignItems={{ xs: 'center', md: 'flex-start' }}>
          <Box display="flex" alignItems="center" gap={1}><LocalPhoneIcon fontSize="small" /> <Typography variant="body2">+880 1324306886</Typography></Box>
          <Box display="flex" alignItems="center" gap={1}><EmailIcon fontSize="small" /> <Typography variant="body2">graball@gmail.com</Typography></Box>
          <Box display="flex" alignItems="center" gap={1}><LocationOnIcon fontSize="small" /> <Typography variant="body2">Dhaka, Bangladesh</Typography></Box>
        </Stack>
      </Grid>
    </Grid>
    <Divider sx={{ my: 3, borderColor: '#444' }} />
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" gap={2}>
      {/* <Stack direction="row" spacing={2} mb={{ xs: 2, md: 0 }}>
        {paymentIcons.map((icon, i) => (
          <Box key={i} component="img" src={icon} alt="payment" sx={{ height: 28, width: 'auto', filter: 'brightness(0) invert(1)' }} />
        ))}
      </Stack> */}
      <Typography variant="body2" color="#f1f1f1" textAlign="center">
        &copy; {new Date().getFullYear()} GrabAll. All rights reserved.
      </Typography>
      <Typography variant="caption" color="#ffc107" textAlign="center">
        Made with <span style={{color:'#ff9800'}}>&#10084;</span> in Bangladesh
      </Typography>
    </Box>
      </Box>
  </Box>
);

export default Footer;
