import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const res = await axios.get('/api/banners');
    setBanners(res.data);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await axios.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await axios.post('/api/banners', { image: uploadRes.data.url });
      fetchBanners();
    } catch (err) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/banners/${id}`);
    fetchBanners();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>Manage Banners</Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Button variant="contained" component="label" disabled={uploading}>
          Upload Banner Image
          <input type="file" accept="image/*" hidden onChange={handleUpload} />
        </Button>
      </Paper>
      <Grid container spacing={2}>
        {banners.map(banner => (
          <Grid item xs={12} md={4} key={banner._id}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <img
                src={banner.image && banner.image.startsWith('/uploads/') ? `${window.location.origin.replace(/:\d+$/, ':5000')}${banner.image}` : banner.image}
                alt="Banner"
                style={{ maxHeight: 80, maxWidth: '100%', borderRadius: 8 }}
              />
              <Button color="error" variant="outlined" onClick={() => handleDelete(banner._id)}>Delete</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
