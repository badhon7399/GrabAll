import { Drawer, Box, Typography, IconButton, Button, Divider, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CartDrawer = ({ open, onClose, cartItems, onRemove, onCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100vw', sm: 400 } } }} ModalProps={{ keepMounted: false }}>
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" fontWeight={900}>Your Cart</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {cartItems.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            Your cart is empty.
          </Typography>
        ) : (
          <List sx={{ flex: 1, overflowY: 'auto' }}>
            {cartItems.map((item, i) => (
              <ListItem key={i} alignItems="flex-start" secondaryAction={
                <Button color="secondary" size="small" onClick={() => onRemove(item)}>
                  Remove
                </Button>
              }>
                <ListItemAvatar>
                  <Avatar variant="rounded" src={item.image} alt={item.name} sx={{ width: 56, height: 56 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography fontWeight={700}>{item.name}</Typography>}
                  secondary={<>
                    <Typography variant="body2" color="text.secondary">Qty: {item.qty}</Typography>
                    <Typography variant="body2" color="text.secondary">৳{item.price} each</Typography>
                  </>}
                />
              </ListItem>
            ))}
          </List>
        )}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="h6" fontWeight={800} mb={2}>Total: ৳{total.toFixed(2)}</Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={cartItems.length === 0}
            onClick={onCheckout}
            sx={{ fontWeight: 700 }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
