import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../utils/AuthContext';

const Favourites = () => {
  const { user, token } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/favourites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavourites(data);
      } catch (err) {
        setError('Failed to load favourites');
      } finally {
        setLoading(false);
      }
    };
    if (user && token) fetchFavourites();
  }, [user, token]);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>Favourites</Typography>
      {favourites.length === 0 ? (
        <Typography>No favourite products yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {favourites.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard product={product} isFavourite />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Favourites;
