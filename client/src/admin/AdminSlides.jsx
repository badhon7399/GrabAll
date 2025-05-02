import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BannerManager from './BannerManager';
import {
  Box, Typography, Button, TextField, Paper, Grid, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';

const BG_PRESETS = [
  { label: 'Blue Gradient', value: 'linear-gradient(135deg, #232f3e 60%, #5b86e5 100%)' },
  { label: 'Orange Gradient', value: 'linear-gradient(135deg, #ff9966 60%, #ff5e62 100%)' },
  { label: 'Green Gradient', value: 'linear-gradient(135deg, #11998e 60%, #38ef7d 100%)' },
  { label: 'Dark', value: '#232f3e' },
  { label: 'White', value: '#fff' }
];

const initialSlide = {
  title: '',
  subtitle: '',
  cta: '',
  bg: BG_PRESETS[0].value,
  image: '',
  product: '',
  order: 0,
};

export default function AdminSlides({ products }) {
  const [slides, setSlides] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialSlide);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/slides`);
      setSlides(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setSlides([]);
    }
  };

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      // Handle file upload
      const file = files[0];
      const formData = new FormData();
      formData.append('image', file);
      axios.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(res => setForm(f => ({ ...f, image: res.data.url })))
        .catch(() => alert('Image upload failed'));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleEdit = slide => {
    setEditing(slide._id);
    setForm(slide);
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(initialSlide);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await axios.put(`/api/slides/${editing}`, form);
    } else {
      await axios.post('/api/slides', form);
    }
    fetchSlides();
    handleCancel();
  };

  const handleDelete = async id => {
    await axios.delete(`/api/slides/${id}`);
    fetchSlides();
  };

  return (
    <Box>
      <BannerManager />
      <Typography variant="h4" fontWeight={900} mb={3}>Manage Hero Slides</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Subtitle" name="subtitle" value={form.subtitle} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="CTA Button Text" name="cta" value={form.cta} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Background</InputLabel>
                <Select name="bg" value={form.bg} label="Background" onChange={handleChange}>
                  {BG_PRESETS.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="outlined" component="label" fullWidth>
                {form.image ? 'Change Image' : 'Upload Image'}
                <input type="file" accept="image/*" name="image" hidden onChange={handleChange} />
              </Button>
              {form.image && (
                <Box mt={1}>
                  <img
                    src={form.image.startsWith('/uploads/') ? `${window.location.origin.replace(/:\d+$/, ':5000')}${form.image}` : form.image}
                    alt="Slide"
                    style={{ maxWidth: '100%', maxHeight: 80, borderRadius: 8 }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Product</InputLabel>
                <Select name="product" value={form.product} onChange={handleChange} label="Product">
                  {products.map(p => (
                    <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField label="Order" name="order" type="number" value={form.order} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">{editing ? 'Update' : 'Add'} Slide</Button>
              {editing && <Button onClick={handleCancel} color="secondary">Cancel</Button>}
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Typography variant="h6" fontWeight={700} mb={2}>Existing Slides</Typography>
      <Grid container spacing={2}>
        {slides.map(slide => (
          <Grid item xs={12} md={6} key={slide._id}>
            <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>{slide.title}</Typography>
                <Typography variant="body2">{slide.subtitle}</Typography>
                <Typography variant="caption">CTA: {slide.cta}</Typography><br/>
                <Typography variant="caption">Product: {slide.product?.name || slide.product}</Typography>
                <Typography variant="caption">Order: {slide.order}</Typography>
              </Box>
              <Box>
                <Button onClick={() => handleEdit(slide)} variant="outlined" sx={{ mr: 1 }}>Edit</Button>
                <Button onClick={() => handleDelete(slide._id)} color="error" variant="contained">Delete</Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
