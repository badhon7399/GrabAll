import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, Chip, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';
import { useState } from 'react';

const getBadge = (product) => {
  if (product.rating >= 4.7) return { label: 'New', color: 'success' };
  if (product.price < 100) return { label: 'Sale', color: 'secondary' };
  return null;
};

import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
const ProductCard = ({ product, onView, onQuickView, isFavourite: initialIsFavourite }) => {
  const badge = getBadge(product);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { token, user } = useAuth();
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite || false);
  const [loadingFav, setLoadingFav] = useState(false);

  const handleToggleFavourite = async () => {
    if (!user || !token) return;
    setLoadingFav(true);
    try {
      if (isFavourite) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/favourites/${product._id}`, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/users/favourites/${product._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      setIsFavourite(!isFavourite);
    } catch (e) {
      // Optionally: show error
    } finally {
      setLoadingFav(false);
    }
  };

  return (
    <Card
      component={motion.div}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(60,72,88,0.18)' }}
      sx={{
        borderRadius: { xs: 2, sm: 3, md: 4 },
        boxShadow: 3,
        background: '#fff',
        minHeight: { xs: 340, sm: 370 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'visible',
        transition: 'box-shadow 0.2s',
        p: { xs: 0.5, sm: 0, md: 2 },
        width: { xs: '100%', sm: 'auto', md: '100%' },
        margin: { xs: '0 0 8px 0', sm: 'initial' },
        maxWidth: { xs: '100%', sm: 370, md: 'none' },
        height: { xs: 370, sm: 'auto' },
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'cover', borderTopLeftRadius: { xs: 8, sm: 12 }, borderTopRightRadius: { xs: 8, sm: 12 }, width: '100%', height: { xs: 180, sm: 180 } }}
        />
        {badge && (
          <Chip
            label={badge.label}
            color={badge.color}
            size="small"
            sx={{ position: 'absolute', top: { xs: 8, sm: 12 }, left: { xs: 8, sm: 12 }, fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem' }, zIndex: 2, px: { xs: 1, sm: 2 }, py: { xs: 0.5, sm: 1 } }}
          />
        )}
        {user && (
          <IconButton
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            onClick={handleToggleFavourite}
            color={isFavourite ? 'error' : 'default'}
            disabled={loadingFav}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: '#fff',
              boxShadow: 2,
              zIndex: 3,
              '&:hover': { background: '#ffeaea' }
            }}
          >
            {isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        )}
      </Box>
      <CardContent sx={{ flex: 1, px: { xs: 0.5, sm: 2 }, py: { xs: 0.5, sm: 2 } }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.2, fontSize: { xs: '0.80rem', sm: '0.97rem' }, minHeight: { xs: 14, sm: 24 } }}>
          {product.category || 'General'}
        </Typography>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ minHeight: { xs: 18, sm: 48 }, fontSize: { xs: '0.98rem', sm: '1.25rem' } }}>
          {product.name}
        </Typography>
        <StarRating value={product.rating} size={16} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, minHeight: { xs: 10, sm: 36 }, fontSize: { xs: '0.80rem', sm: '1rem' } }}>
          {product.detail}
        </Typography>
        <Typography variant="h5" color="primary.main" fontWeight={900} sx={{ mt: 0.5, fontSize: { xs: '1.02rem', sm: '1.5rem' } }}>
          ৳{product.price}
        </Typography>
      </CardContent>
      <CardActions sx={{
        p: { xs: 0.5, sm: 2 },
        pt: 0,
        flexDirection: { xs: 'row', sm: 'row' },
        gap: 1,
        justifyContent: { xs: 'space-between', sm: 'flex-start' },
        alignItems: 'center',
        mt: { xs: -1, sm: 0 }
      }}>
        <Button
          fullWidth={isMobile}
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => onView(product)}
          component={motion.button}
          whileHover={{ scale: 1.04 }}
          sx={{ fontWeight: 700, flex: 1, mr: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.82rem', sm: '1rem' }, py: { xs: 0.7, sm: 1.2 } }}
        >
          View Details
        </Button>
        {/* Only show Add to Cart icon button on mobile */}
        {isMobile ? (
          <IconButton
            color="primary"
            size="medium"
            aria-label="Add to cart"
            onClick={() => onQuickView(product)}
            sx={{ ml: 0.5, background: '#f5f5f5', borderRadius: 2, boxShadow: 1, p: 0.6 }}
          >
            <AddShoppingCartIcon sx={{ fontSize: 22 }} />
          </IconButton>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => onQuickView(product)}
            component={motion.button}
            whileHover={{ scale: 1.04 }}
            sx={{ fontWeight: 700, ml: 1, display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Quick View
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
