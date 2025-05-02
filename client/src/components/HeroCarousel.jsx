import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCachedFetch } from '../utils/useCachedFetch';

const slideVariants = {
  enter: { opacity: 0, x: 80 },
  center: { opacity: 1, x: 0, transition: { duration: 0.7 } },
  exit: { opacity: 0, x: -80, transition: { duration: 0.5 } },
};

const HeroCarousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const { data: slidesData, loading: loadingSlides } = useCachedFetch(
    'slides',
    () => fetch(`${import.meta.env.VITE_API_URL}/api/slides`).then(res => res.json())
  );
  const { data: bannersData, loading: loadingBanners } = useCachedFetch(
    'banners',
    () => fetch(`${import.meta.env.VITE_API_URL}/api/banners`).then(res => res.json())
  );

  const slides = useMemo(() => {
    if (!slidesData && !bannersData) return [];
    const slidesArr = (slidesData || []).map(s => ({ ...s, _type: 'slide' }));
    const bannersArr = (bannersData || []).map(b => ({ ...b, _type: 'banner' }));
    // Remove duplicates from slidesArr by _id (if present) or image+title fallback
    const uniqueSlidesArr = slidesArr.filter((slide, idx, arr) => {
      if (slide._id) {
        return arr.findIndex(s => s._id === slide._id) === idx;
      } else {
        // fallback: check image+title combo
        return arr.findIndex(s => s.image === slide.image && s.title === slide.title) === idx;
      }
    });
    return [...uniqueSlidesArr, ...bannersArr];
  }, [slidesData, bannersData]);

  const [idx, setIdx] = useState(0);
  const nextSlide = () => setIdx((idx + 1) % slides.length);
  const prevSlide = () => setIdx((idx - 1 + slides.length) % slides.length);

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

  if (loadingSlides && loadingBanners) return null;
  if (!slides.length) return null;

  return (
    <Box
      sx={{
        width: '100vw',
        height: { xs: 'calc(60vh - 56px)', md: 'calc(100vh - 72px)' },
        minHeight: { xs: 180, md: 300 },
        maxHeight: { xs: 320, md: '100vh' },
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
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', height: '100%', flexDirection: isMobile ? 'column' : 'row' }}
        >
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {slides[idx]._type === 'slide' && (
              <Box sx={{ zIndex: 2, color: '#fff', textAlign: 'left', px: 10, width: '50%', py: 0, background: 'none', borderRadius: 0 }}>
                <Typography variant="h2" fontWeight={900} sx={{ fontSize: '2.8rem', mb: 2 }}>
                  {slides[idx].title}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.3rem', mb: 4 }}>
                  {slides[idx].subtitle}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ mt: 2, px: 4, fontWeight: 700, fontSize: '1.15rem', borderRadius: 3 }}
                  onClick={() => handleCTAClick(slides[idx])}
                >
                  {slides[idx].cta || 'Shop Now'}
                </Button>
              </Box>
            )}
          </Box>
          {/* Mobile: SLIDE type - 50% left image, 50% right text/button; BANNER type - image only */}
          {isMobile && (
            slides[idx]._type === 'slide' ? (
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                {/* Left: Image */}
                <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img
                    src={slides[idx].image && slides[idx].image.startsWith('/uploads/')
                      ? `${import.meta.env.VITE_API_URL}${slides[idx].image}`
                      : slides[idx].image}
                    alt={slides[idx].title}
                    style={{
                      maxHeight: '26vh',
                      maxWidth: '44vw',
                      minHeight: 80,
                      minWidth: 80,
                      borderRadius: 14,
                      boxShadow: '0 8px 28px 0 rgba(60,72,88,0.16), 0 1px 4px rgba(91,134,229,0.12)',
                      display: 'block',
                      margin: '0 auto',
                    }}
                  />
                </Box>
                {/* Right: Text/Button */}
                <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', pl: 1 }}>
                  <Typography variant="h2" fontWeight={900} sx={{ fontSize: '1.06rem', mb: 0.5, color: '#fff', textAlign: 'left' }}>
                    {slides[idx].title}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '0.89rem', mb: 1, color: '#fff', textAlign: 'left' }}>
                    {slides[idx].subtitle}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    sx={{ mt: 0.5, px: 1.5, fontWeight: 700, fontSize: '0.92rem', borderRadius: 2 }}
                    onClick={() => handleCTAClick(slides[idx])}
                  >
                    {slides[idx].cta || 'Shop Now'}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <img
                  src={slides[idx].image && slides[idx].image.startsWith('/uploads/')
                    ? `${import.meta.env.VITE_API_URL}${slides[idx].image}`
                    : slides[idx].image}
                  alt={slides[idx].title}
                  style={{
                    width: '100vw',
                    height: '32vh',
                    objectFit: 'cover',
                    borderRadius: 0,
                    boxShadow: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'block',
                  }}
                />
              </Box>
            )
          )}
          {!isMobile && (
            slides[idx]._type === 'banner' ? (
              <img
                src={slides[idx].image && slides[idx].image.startsWith('/uploads/')
                  ? `${import.meta.env.VITE_API_URL}${slides[idx].image}`
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
                    ? `${import.meta.env.VITE_API_URL}${slides[idx].image}`
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
      {/* Carousel Controls - show on mobile, smaller and at bottom center */}
      {isMobile && (
        <Box sx={{ position: 'absolute', bottom: 12, width: '100%', display: 'flex', justifyContent: 'space-between', px: 2, zIndex: 4 }}>
          <Button
            onClick={prevSlide}
            sx={{
              color: '#fff',
              minWidth: 0,
              p: 0.5,
              fontSize: '1.4rem',
              background: 'rgba(0,0,0,0.18)',
              borderRadius: '50%',
              boxShadow: 1,
            }}
          >
            &#8592;
          </Button>
          <Button
            onClick={nextSlide}
            sx={{
              color: '#fff',
              minWidth: 0,
              p: 0.5,
              fontSize: '1.4rem',
              background: 'rgba(0,0,0,0.18)',
              borderRadius: '50%',
              boxShadow: 1,
            }}
          >
            &#8594;
          </Button>
        </Box>
      )}
      {/* Desktop controls */}
      {!isMobile && (
        <>
          <Button
            onClick={prevSlide}
            sx={{ position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)', color: '#fff', minWidth: 0, p: 1, zIndex: 3 }}
          >
            &#8592;
          </Button>
          <Button
            onClick={nextSlide}
            sx={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', color: '#fff', minWidth: 0, p: 1, zIndex: 3 }}
          >
            &#8594;
          </Button>
        </>
      )}
      {/* Dots */}
      <Box sx={{ position: 'absolute', bottom: 24, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 1 }}>
        {slides.map((_, i) => (
          <Box key={i} sx={{ width: 12, height: 12, borderRadius: '50%', background: i === idx ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'background 0.3s', cursor: 'pointer' }} onClick={() => setIdx(i)} />
        ))}
      </Box>
    </Box>
  );
};

export default HeroCarousel;
