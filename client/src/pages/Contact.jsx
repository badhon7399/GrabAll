import React from 'react';
import { Box, Typography, Stack, TextField, Button, Paper, Divider } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Contact = () => (
  <Box sx={{ minHeight: '70vh', background: '#f8fafc', py: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
    <Paper elevation={2} sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 5 }, borderRadius: 4 }}>
      <Typography variant="h4" fontWeight={900} color="primary" gutterBottom sx={{ letterSpacing: '-1.5px' }}>
        Contact Us
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Have a question, feedback, or need support? Our team is here to help you! Fill out the form below or use the contact details to reach us directly.
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={5}>
        {/* Contact Info */}
        <Box flex={1}>
          <Typography fontWeight={700} mb={2} color="#ffc107">Get in Touch</Typography>
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocalPhoneIcon color="primary" />
              <Typography variant="body2">+880 1324306886</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <EmailIcon color="primary" />
              <Typography variant="body2">support@graball.com</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOnIcon color="primary" />
              <Typography variant="body2">Dhaka, Bangladesh</Typography>
            </Box>
          </Stack>
          <Divider sx={{ my: 3, borderColor: '#eee' }} />
          <Typography fontWeight={700} mb={1} color="#ffc107">Follow Us</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="primary" href="https://www.facebook.com/profile.php?id=61570204013599" target="_blank">Facebook</Button>
            <Button variant="outlined" color="primary" href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fgraballgoods%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExU0hoOFNmWDQ0a0RmNWlHVwEeoh2tpOSSqWdJ8Vy-NWb7VeAsXBOW_c2mCZEpVRyFNHNvYCCnKv0JZgLHepo_aem_y_7S4hSIhQQ3Pw6suy9GqQ&h=AT343dFXOrFEzjxweStSxAoo1oCq_hTVn2q91yIagi5O3KL5WRowDjuREbwSKBuyX3IQKUn_7M6O2XniZXQx9PM447QYbjHsjt-PbokxJ-q7or2deeJ7s3j65wO_TPNPrQHW" target="_blank">Instagram</Button>
            <Button variant="outlined" color="primary" href="https://twitter.com" target="_blank">Twitter</Button>
            <Button variant="outlined" color="primary" href="https://youtube.com" target="_blank">YouTube</Button>
          </Stack>
        </Box>
        {/* Contact Form */}
        <Box flex={2}>
          <Typography fontWeight={700} mb={2} color="#ffc107">Send Us a Message</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={e => e.preventDefault()}>
            <TextField label="Your Name" variant="outlined" required fullWidth />
            <TextField label="Your Email" variant="outlined" required type="email" fullWidth />
            <TextField label="Message" variant="outlined" required multiline rows={5} fullWidth />
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 1, fontWeight: 700 }}>
              Send Message
            </Button>
          </Box>
        </Box>
      </Stack>
    </Paper>
  </Box>
);

export default Contact;
