import { Dialog, DialogContent, DialogTitle, Typography, Box, Button, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarRating from './StarRating';

const ProductQuickView = ({ open, product, onClose, onAddToCart = () => {}, onViewDetail = () => {} }) => {
  if (!product) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0 }}>
        <Typography component="span" variant="h6" fontWeight={900}>{product.name}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 2 }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', display: 'block', maxHeight: 280, objectFit: 'cover' }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>{product.category}</Typography>
            <StarRating value={product.rating} />
            <Typography variant="body1" color="text.secondary" mt={2} mb={2}>
              {product.description}
            </Typography>
            <Typography variant="h4" color="primary.main" fontWeight={900} mb={2}>
              ${product.price}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2 }}
              onClick={() => onAddToCart && onAddToCart(product)}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => onViewDetail && onViewDetail(product)}
            >
              View Details
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
