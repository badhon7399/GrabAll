import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { motion } from 'framer-motion';

const headerVariants = {
  hidden: { y: -80, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7 } },
};

const AnimatedHeader = ({ onNavigate }) => (
  <AppBar
    component={motion.header}
    position="sticky"
    color="inherit"
    elevation={0}
    variants={headerVariants}
    initial="hidden"
    animate="visible"
    sx={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', boxShadow: 2 }}
  >
    <Container maxWidth="lg">
      <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: 72 }}>
        <Typography
          variant="h4"
          fontWeight={900}
          color="primary.main"
          sx={{ letterSpacing: '-1.5px', cursor: 'pointer', userSelect: 'none' }}
          onClick={() => onNavigate('home')}
        >
          Aesthetica
        </Typography>
        <Box>
          <Button color="primary" onClick={() => onNavigate('shop')} sx={{ fontWeight: 700, mr: 2 }}>
            Shop
          </Button>
          <Button color="secondary" onClick={() => onNavigate('admin')} sx={{ fontWeight: 700, mr: 2 }}>
            Admin
          </Button>
          <Button color="primary" variant="outlined" onClick={() => onNavigate('cart')} sx={{ fontWeight: 700 }}>
            Cart
          </Button>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);

export default AnimatedHeader;
