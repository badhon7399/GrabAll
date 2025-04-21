import { Box, Typography, Grid, Paper, useMediaQuery } from '@mui/material';
import ChairIcon from '@mui/icons-material/Chair';
import LightIcon from '@mui/icons-material/Light';
import WeekendIcon from '@mui/icons-material/Weekend';
import KitchenIcon from '@mui/icons-material/Kitchen';
import BedIcon from '@mui/icons-material/Bed';
import { useTheme } from '@mui/material/styles';

const categories = [
  {
    label: 'Furniture',
    icon: <ChairIcon sx={{ fontSize: 44, color: 'primary.main' }} />, 
    bg: '#f3f4f6',
  },
  {
    label: 'Lighting',
    icon: <LightIcon sx={{ fontSize: 44, color: 'primary.main' }} />, 
    bg: '#fffbe6',
  },
  {
    label: 'Sofas',
    icon: <WeekendIcon sx={{ fontSize: 44, color: 'primary.main' }} />, 
    bg: '#e3f2fd',
  },
  {
    label: 'Kitchen',
    icon: <KitchenIcon sx={{ fontSize: 44, color: 'primary.main' }} />, 
    bg: '#fce4ec',
  },
  {
    label: 'Bedroom',
    icon: <BedIcon sx={{ fontSize: 44, color: 'primary.main' }} />, 
    bg: '#e8f5e9',
  },
];

const FeaturedCategories = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box sx={{ width: '100%', py: { xs: 4, md: 8 }, background: '#fff', px: { xs: 1, md: 0 } }}>
      <Typography variant="h3" fontWeight={900} align="center" color="primary.main" mb={4}>
        Featured Categories
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {categories.map((cat) => (
          <Grid item xs={6} sm={4} md={2.4} key={cat.label}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                background: cat.bg,
                minHeight: isMobile ? 120 : 160,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.04)',
                  boxShadow: '0 6px 32px rgba(60,72,88,0.12)',
                },
              }}
            >
              {cat.icon}
              <Typography variant="subtitle1" fontWeight={700} color="text.primary" mt={2}>
                {cat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedCategories;
