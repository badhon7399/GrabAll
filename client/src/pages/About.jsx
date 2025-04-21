import React from 'react';
import { Typography, Divider } from '@mui/material';
import { motion } from 'framer-motion';

const aboutBg = {
  background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%)', // soft off-white gradient
  minHeight: '100vh',
  width: '100vw',
  padding: 0,
  fontFamily: 'Poppins, Montserrat, Arial, sans-serif',
};

const sectionStyle = {
  maxWidth: '100vw',
  padding: '96px 0 48px 0',
  margin: 0,
  textAlign: 'center',
};

const cardStyle = {
  maxWidth: 820,
  margin: 'auto',
  padding: '48px 36px',
  background: 'rgba(255,255,255,0.95)',
  borderRadius: 24,
  boxShadow: '0 12px 36px 0 rgba(25,118,210,0.16)',
  position: 'relative',
  overflow: 'hidden',
};

const headingStyle = {
  fontFamily: 'Montserrat, Poppins, Arial, sans-serif',
  fontWeight: 900,
  color: '#1976d2',
  letterSpacing: '-1.5px',
  marginBottom: '16px',
  textShadow: '0 2px 8px #43cea2aa',
};

const subheadingStyle = {
  fontFamily: 'Poppins, Arial, sans-serif',
  fontWeight: 600,
  fontSize: 22,
  color: '#43cea2',
  marginBottom: '20px',
  letterSpacing: '.5px',
};

const About = () => (
  <div style={aboutBg}>
    <motion.div
      style={sectionStyle}
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
        <Typography variant="h2" sx={{
          fontFamily: 'Montserrat, Poppins, Arial, sans-serif',
          fontWeight: 900,
          color: '#1a365d',
          letterSpacing: '-1.5px',
          marginBottom: '16px',
          textShadow: '0 2px 8px #b9e6ff88',
          fontSize: { xs: 32, sm: 44, md: 56 },
        }} gutterBottom component={motion.h1} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
          About <span style={{ color: '#4fbcff', fontWeight: 900 }}>GrabAll</span>
        </Typography>
        <Typography variant="h5" sx={{
          fontFamily: 'Poppins, Arial, sans-serif',
          fontWeight: 600,
          fontSize: 24,
          color: '#4fbcff',
          marginBottom: '32px',
          letterSpacing: '.5px',
        }} gutterBottom component={motion.h2} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
          Your Ultimate E-commerce Destination in Bangladesh
        </Typography>
        <Divider sx={{ mb: 4, borderColor: '#4fbcff', mx: 'auto', width: '60px' }} />

        <Typography variant="body1" sx={{
          fontSize: 22,
          color: '#1a365d',
          fontFamily: 'Poppins, Arial, sans-serif',
          mb: 3,
          maxWidth: 800,
          mx: 'auto',
        }}>
          <b>GrabAll</b> is a modern e-commerce platform proudly based in Bangladesh, dedicated to bringing you the best online shopping experience. From the bustling streets of Dhaka to the serene corners of Sylhet, we connect millions of Bangladeshis to a world of products at unbeatable prices.
        </Typography>
        <Typography variant="body1" sx={{
          fontSize: 20,
          color: '#4fbcff',
          fontFamily: 'Montserrat, Arial, sans-serif',
          mb: 3,
          maxWidth: 700,
          mx: 'auto',
        }}>
          Our mission is to empower shoppers with a wide selection of authentic products, fast delivery, and secure payment options. Whether you are searching for the latest electronics, trendy fashion, home essentials, or groceries, GrabAll is your trusted partner.
        </Typography>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}>
          <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif', mb: 2, mt: 4 }}>
            Why Choose GrabAll?
          </Typography>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 auto 32px auto',
            maxWidth: 600,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '18px',
          }}>
            <motion.li whileHover={{ scale: 1.08, background: '#e0f7fa' }} style={{background:'#f3f8fc',borderRadius:12,padding:'12px 28px',fontWeight:600,fontSize:18,color:'#4fbcff',boxShadow:'0 2px 8px #b9e6ff33',transition:'background 0.2s'}}>Vast collection of local and international brands</motion.li>
            <motion.li whileHover={{ scale: 1.08, background: '#e0f7fa' }} style={{background:'#f3f8fc',borderRadius:12,padding:'12px 28px',fontWeight:600,fontSize:18,color:'#4fbcff',boxShadow:'0 2px 8px #b9e6ff33',transition:'background 0.2s'}}>Lightning-fast and reliable delivery across Bangladesh</motion.li>
            <motion.li whileHover={{ scale: 1.08, background: '#e0f7fa' }} style={{background:'#f3f8fc',borderRadius:12,padding:'12px 28px',fontWeight:600,fontSize:18,color:'#4fbcff',boxShadow:'0 2px 8px #b9e6ff33',transition:'background 0.2s'}}>Easy returns & 24/7 customer support</motion.li>
            <motion.li whileHover={{ scale: 1.08, background: '#e0f7fa' }} style={{background:'#f3f8fc',borderRadius:12,padding:'12px 28px',fontWeight:600,fontSize:18,color:'#4fbcff',boxShadow:'0 2px 8px #b9e6ff33',transition:'background 0.2s'}}>Exciting deals, discounts, and seasonal offers</motion.li>
            <motion.li whileHover={{ scale: 1.08, background: '#e0f7fa' }} style={{background:'#f3f8fc',borderRadius:12,padding:'12px 28px',fontWeight:600,fontSize:18,color:'#4fbcff',boxShadow:'0 2px 8px #b9e6ff33',transition:'background 0.2s'}}>Safe and seamless payment methods</motion.li>
          </ul>
        </motion.div>

        <Typography variant="body1" sx={{ fontSize: 18, color: '#444', fontFamily: 'Poppins, Arial, sans-serif', mt: 1 }}>
          At GrabAll, we believe in making online shopping simple, joyful, and accessible for everyone in Bangladesh.<br />
          <span style={{ color: '#1976d2', fontWeight: 700 }}>Thank you for being a part of our journey!</span>
        </Typography>

        {/* Bangladesh and Palestine themed accents */}
        <div style={{ position: 'absolute', bottom: 18, right: 28, opacity: 0.9, display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 8 }}>
          {/* Bangladesh Flag (vivid colors) */}
          <svg width="90" height="54" viewBox="0 0 90 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', marginBottom: 6 }}>
            <rect width="90" height="54" rx="12" fill="#006B3F" />
            <circle cx="38" cy="27" r="13" fill="#F42A41" />
            <rect x="0.5" y="0.5" width="89" height="53" rx="11.5" stroke="#222" strokeWidth="1" opacity="0.05" />
          </svg>
          {/* Palestine Flag */}
          <svg width="90" height="54" viewBox="0 0 90 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            {/* White background */}
            <rect width="90" height="54" rx="12" fill="#fff" />
            {/* Black stripe */}
            <rect y="0" width="90" height="18" rx="12" fill="#000" />
            {/* Green stripe */}
            <rect y="36" width="90" height="18" rx="12" fill="#009639" />
            {/* Red triangle */}
            <polygon points="0,0 45,27 0,54" fill="#EF3340" />
            <rect x="0.5" y="0.5" width="89" height="53" rx="11.5" stroke="#222" strokeWidth="1" opacity="0.05" />
          </svg>
        </div>
      </motion.div>
    </div>
 );

export default About;
