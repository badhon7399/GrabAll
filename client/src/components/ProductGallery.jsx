import { Box, Grid, Paper } from '@mui/material';
import { useState } from 'react';

const ProductGallery = ({ images }) => {
  const [selected, setSelected] = useState(0);
  if (!images || images.length === 0) return null;
  return (
    <Box>
      <Paper elevation={3} sx={{ mb: 2, borderRadius: 3, overflow: 'hidden', p: 1, background: '#fafbfc' }}>
        <img
          src={images[selected]}
          alt={"Product"}
          style={{ width: '100%', maxHeight: 340, objectFit: 'contain', borderRadius: 12, background: '#fff', display: 'block', margin: 'auto' }}
        />
      </Paper>
      <Grid container spacing={1} justifyContent="center">
        {images.map((img, i) => (
          <Grid item key={i}>
            <Paper
              elevation={selected === i ? 3 : 1}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                border: selected === i ? '2px solid #febd69' : '2px solid transparent',
                cursor: 'pointer',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
              }}
              onClick={() => setSelected(i)}
            >
              <img src={img} alt={"thumb"} style={{ width: 56, height: 56, objectFit: 'contain' }} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGallery;
