import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Button } from '@mui/material';
import axios from 'axios';
import AdminSlides from './AdminSlides';

const ContentManager = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={900} color="#232f3e" mb={4}>
        Content Management
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 4, mb: 3 }}>
        <Typography>
          This page is reserved for future content management features.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ContentManager;
