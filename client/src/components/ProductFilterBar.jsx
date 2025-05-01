import { Box, FormControl, InputLabel, Select, MenuItem, Slider, Typography, Button } from '@mui/material';
import { useState } from 'react';

const categories = ['All', 'Furniture', 'Lighting', 'Sofas', 'Kitchen', 'Bedroom'];
const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating', value: 'rating' },
];

const PRICE_MIN = 0;
const PRICE_MAX = 1000;
const PRICE_STEP = 5;

const ProductFilterBar = ({ filter, setFilter }) => {
  const [category, setCategory] = useState(filter.category || 'All');
  const [sort, setSort] = useState(filter.sort || 'featured');
  const [price, setPrice] = useState(
    Array.isArray(filter.price) && filter.price.length === 2 ? filter.price : [PRICE_MIN, PRICE_MAX]
  );

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setFilter((f) => ({ ...f, category: e.target.value }));
  };
  const handleSort = (e) => {
    setSort(e.target.value);
    setFilter((f) => ({ ...f, sort: e.target.value }));
  };
  const handlePrice = (_, newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      setPrice(newValue);
    }
  };

  // Only update filter when user stops dragging (better for performance)
  const handlePriceCommitted = (_, newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      setFilter((f) => ({ ...f, price: newValue }));
    }
  };

  const handleReset = () => {
    setCategory('All');
    setSort('featured');
    setPrice([0, 1000]);
    setFilter({ category: 'All', sort: 'featured', price: [0, 1000] });
  };

  return (
    <Box sx={{ mb: 4, p: 2, background: '#fff', borderRadius: 2, boxShadow: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 3, md: 4 },
          width: '100%',
        }}
      >
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={handleCategory}>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sort} label="Sort By" onChange={handleSort}>
            {sortOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ flex: 1, minWidth: 180 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Price Range (৳{price[0]} - ৳{price[1]})
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 32 }}>
              ৳{PRICE_MIN}
            </Typography>
            <Slider
              value={price}
              onChange={handlePrice}
              onChangeCommitted={handlePriceCommitted}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              valueLabelDisplay="auto"
              sx={{ color: 'primary.main', flex: 1, mt: { xs: 1, sm: 0 } }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 32, textAlign: 'right' }}>
              ৳{PRICE_MAX}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, minWidth: 100 }}>
          <Button variant="outlined" color="primary" onClick={handleReset} sx={{ minWidth: 88, mt: { xs: 2, sm: 0 } }}>
            Reset
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductFilterBar;
