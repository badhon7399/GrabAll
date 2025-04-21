import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import StarRating from './StarRating';

const getBadge = (product) => {
  if (product.rating >= 4.7) return { label: 'New', color: 'success' };
  if (product.price < 100) return { label: 'Sale', color: 'secondary' };
  return null;
};

import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
const ProductCard = ({ product, onView, onQuickView }) => {
  const badge = getBadge(product);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Card
      component={motion.div}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(60,72,88,0.18)' }}
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        background: '#fff',
        minHeight: 370,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'visible',
        transition: 'box-shadow 0.2s',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12, width: '100%' }}
        />
        {badge && (
          <Chip
            label={badge.label}
            color={badge.color}
            size="small"
            sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 700, fontSize: '0.9rem', zIndex: 2 }}
          />
        )}
      </Box>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.97rem', minHeight: 24 }} noWrap>
          {product.category || 'General'}
        </Typography>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ minHeight: 48 }} noWrap>{product.name}</Typography>
        <StarRating value={product.rating} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minHeight: 36 }} noWrap>{product.detail}</Typography>
        <Typography variant="h5" color="primary.main" fontWeight={900} sx={{ mt: 1 }}>
          ${product.price}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
        <Button
          fullWidth={isMobile}
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => onView(product)}
          component={motion.button}
          whileHover={{ scale: 1.04 }}
          sx={{ fontWeight: 700 }}
        >
          View Details
        </Button>
        <Button
          fullWidth={isMobile}
          variant={isMobile ? 'contained' : 'outlined'}
          color="primary"
          size="large"
          onClick={() => onQuickView(product)}
          component={motion.button}
          whileHover={{ scale: 1.04 }}
          sx={{ fontWeight: 700, display: { xs: 'inline-flex', sm: 'none', md: 'inline-flex' }, ml: isMobile ? 0 : 1 }}
        >
          Quick View
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
