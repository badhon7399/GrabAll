import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const AnimatedHero = () => (
  <Box
    sx={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: 4,
      boxShadow: 2,
      mt: 4,
    }}
  >
    <Container maxWidth="md" sx={{ px: { xs: 1, sm: 3 } }}>
      <motion.div
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '4rem' },
            color: 'primary.main',
            mb: { xs: 1, sm: 2 },
            letterSpacing: '-2px',
            textShadow: '0 4px 24px rgba(127,90,240,0.08)',
            wordBreak: 'break-word',
          }}
        >
          Elevate Your Space<br />with World-Class Design
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 }, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
        >
          Discover premium furniture and decor with stunning aesthetics and seamless shopping.
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          sx={{ px: { xs: 3, sm: 5 }, py: { xs: 1, sm: 1.5 }, fontSize: { xs: '1rem', sm: '1.1rem' }, boxShadow: 3 }}
          component={motion.button}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.98 }}
        >
          Shop Now
        </Button>
      </motion.div>
    </Container>
  </Box>
);

export default AnimatedHero;
