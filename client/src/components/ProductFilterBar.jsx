import { Box, FormControl, InputLabel, Select, MenuItem, Slider, Typography, Grid, Button } from '@mui/material';
import { useState } from 'react';

const categories = ['All', 'Furniture', 'Lighting', 'Sofas', 'Kitchen', 'Bedroom'];
const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating', value: 'rating' },
];

const ProductFilterBar = ({ filter, setFilter }) => {
  const [category, setCategory] = useState(filter.category || 'All');
  const [sort, setSort] = useState(filter.sort || 'featured');
  const [price, setPrice] = useState(filter.price || [0, 1000]);

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setFilter((f) => ({ ...f, category: e.target.value }));
  };
  const handleSort = (e) => {
    setSort(e.target.value);
    setFilter((f) => ({ ...f, sort: e.target.value }));
  };
  const handlePrice = (_, newValue) => {
    setPrice(newValue);
    setFilter((f) => ({ ...f, price: newValue }));
  };
  const handleReset = () => {
    setCategory('All');
    setSort('featured');
    setPrice([0, 1000]);
    setFilter({ category: 'All', sort: 'featured', price: [0, 1000] });
  };

  return (
    <Box sx={{ mb: 4, p: 2, background: '#fff', borderRadius: 2, boxShadow: 1 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={handleCategory}>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select value={sort} label="Sort By" onChange={handleSort}>
              {sortOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Price Range (${price[0]} - ${price[1]})
          </Typography>
          <Slider
            value={price}
            onChange={handlePrice}
            min={0}
            max={1000}
            step={10}
            valueLabelDisplay="auto"
            sx={{ color: 'primary.main' }}
          />
        </Grid>
        <Grid item xs={12} md={2} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Button variant="outlined" color="primary" onClick={handleReset} sx={{ mt: { xs: 2, md: 0 } }}>
            Reset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductFilterBar;
