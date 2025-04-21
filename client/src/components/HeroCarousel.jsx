import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const slideVariants = {
  enter: { opacity: 0, x: 80 },
  center: { opacity: 1, x: 0, transition: { duration: 0.7 } },
  exit: { opacity: 0, x: -80, transition: { duration: 0.5 } },
};
const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [idx, setIdx] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('/api/slides').then(res => res.json()).catch(() => []),
      fetch('/api/banners').then(res => res.json()).catch(() => [])
    ]).then(([slidesData, bannersData]) => {
      // Mark type for rendering
      const slidesArr = (slidesData || []).map(s => ({ ...s, _type: 'slide' }));
      const bannersArr = (bannersData || []).map(b => ({ ...b, _type: 'banner' }));
      setSlides([...slidesArr, ...bannersArr]);
    });
  }, []);

  const nextSlide = () => setIdx((idx + 1) % slides.length);
  const prevSlide = () => setIdx((idx - 1 + slides.length) % slides.length);

  // Auto-play
  useEffect(() => {
    if (!slides.length) return;
    const timer = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timer);
  }, [idx, slides.length]);

  const handleCTAClick = (slide) => {
    if (slide.product?._id || slide.product) {
      navigate(`/product/${slide.product._id || slide.product}`);
    }
  };
  if (!slides.length) return null;

  return (
    <Box
      sx={{
        width: '100vw',
        height: { xs: 'calc(100vh - 56px)', md: 'calc(100vh - 72px)' },
        minHeight: 300,
        maxHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
        m: 0,
        p: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: slides[idx]._type === 'banner' ? undefined : slides[idx].bg,
        transition: 'background 0.6s',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', height: '100%' }}
        >
          <Box sx={{
            zIndex: 2,
            color: '#fff',
            textAlign: isMobile ? 'center' : 'left',
            px: { xs: 2, md: 10 },
            width: { xs: '100%', md: '50%' },
          }}>
            {slides[idx]._type === 'slide' ? (
              <>
                <Typography variant="h1" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
                  {slides[idx].title}
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255,255,255,0.95)' }}>
                  {slides[idx].subtitle}
                </Typography>
                <Button variant="contained" color="secondary" size="large" sx={{ fontWeight: 700, px: 5 }} onClick={() => handleCTAClick(slides[idx])}>
                  {slides[idx].cta}
                </Button>
              </>
            ) : null} 
          </Box>
          {!isMobile && (
            slides[idx]._type === 'banner' ? (
              <img
                src={slides[idx].image && slides[idx].image.startsWith('/uploads/')
                  ? `${window.location.origin.replace(/:\d+$/, ':5000')}${slides[idx].image}`
                  : slides[idx].image}
                alt="Banner"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1,
                  borderRadius: 0,
                  boxShadow: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'block',
                }}
              />
            ) : (
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <img
                  src={slides[idx].image && slides[idx].image.startsWith('/uploads/')
                    ? `${window.location.origin.replace(/:\d+$/, ':5000')}${slides[idx].image}`
                    : slides[idx].image}
                  alt={slides[idx].title}
                  style={{
                    maxHeight: '85vh',
                    maxWidth: '98vw',
                    minHeight: 320,
                    minWidth: 320,
                    borderRadius: 24,
                    boxShadow: '0 12px 48px 0 rgba(60,72,88,0.22), 0 2px 8px rgba(91,134,229,0.18)',
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </Box>
            )
          )}
        </motion.div>
      </AnimatePresence>
      {/* Carousel Controls */}
      <Button
        onClick={prevSlide}
        sx={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', color: '#fff', minWidth: 0, p: 1, zIndex: 3, display: { xs: 'none', md: 'inline-flex' } }}
      >
        &#8592;
      </Button>
      <Button
        onClick={nextSlide}
        sx={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', color: '#fff', minWidth: 0, p: 1, zIndex: 3, display: { xs: 'none', md: 'inline-flex' } }}
      >
        &#8594;
      </Button>
      {/* Dots */}
      <Box sx={{ position: 'absolute', bottom: 24, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 1 }}>
        {slides.map((_, i) => (
          <Box key={i} sx={{ width: 12, height: 12, borderRadius: '50%', background: i === idx ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'background 0.3s', cursor: 'pointer' }} onClick={() => setIdx(i)} />
        ))}
      </Box>
    </Box>
  );
}

export default HeroCarousel;

