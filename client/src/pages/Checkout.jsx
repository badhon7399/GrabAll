import { Box, Stepper, Step, StepLabel, Button, Typography, Paper, TextField, Grid } from '@mui/material';
import { useState } from 'react';

const steps = ['Shipping', 'Payment', 'Review'];

const Checkout = ({ cart, onPlaceOrder, onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', zip: '' });
  const [payment, setPayment] = useState({ mobile: '', trxid: '' });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  const handlePlaceOrder = async () => {
    setOrderError('');
    setPlacingOrder(true);
    try {
      await onPlaceOrder({ shipping, payment });
      setActiveStep(steps.length);
    } catch (err) {
      setOrderError(err?.message || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }} elevation={3}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" mb={2}>Shipping Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField label="Full Name" fullWidth required value={shipping.name} onChange={e => setShipping(s => ({ ...s, name: e.target.value }))} /></Grid>
              <Grid item xs={12}><TextField label="Address" fullWidth required value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} /></Grid>
              <Grid item xs={6}><TextField label="City" fullWidth required value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} /></Grid>
              <Grid item xs={6}><TextField label="ZIP Code" fullWidth required value={shipping.zip} onChange={e => setShipping(s => ({ ...s, zip: e.target.value }))} /></Grid>
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={handleNext} disabled={!shipping.name || !shipping.address || !shipping.city || !shipping.zip}>Next</Button>
            </Box>
          </Box>
        )}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" mb={2}>Payment Details</Typography>
            <Typography variant="body1" color="primary" mb={2}>Bkash: 01712345678</Typography>
            <Typography variant="body1" color="primary" mb={2}>Nagad: 01712345678</Typography>
            <Typography variant="body1" color="error" mb={2}>Note: Please send money in the given numbers and fill the number and trxid</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField label="Mobile Number" fullWidth required value={payment.mobile} onChange={e => setPayment(p => ({ ...p, mobile: e.target.value }))} /></Grid>
              <Grid item xs={6}><TextField label="TrxID" fullWidth required value={payment.trxid} onChange={e => setPayment(p => ({ ...p, trxid: e.target.value }))} /></Grid>
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" color="primary" onClick={handleNext} disabled={!payment.mobile || !payment.trxid}>Next</Button>
            </Box>
          </Box>
        )}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" mb={2}>Review & Place Order</Typography>
            <Typography fontWeight={700} mb={2}>Shipping</Typography>
            <Typography>Name: {shipping.name}</Typography>
            <Typography>Address: {shipping.address}, {shipping.city}, {shipping.zip}</Typography>
            <Typography fontWeight={700} mt={3} mb={2}>Items</Typography>
            {cart.map((item, i) => (
              <Box key={i} sx={{ mb: 1 }}>
                <Typography>{item.name} x{item.qty} - ৳{item.price * item.qty}</Typography>
              </Box>
            ))}
            <Typography fontWeight={700} mt={3} mb={2}>Payment</Typography>
            <Typography>Mobile Number: {payment.mobile}</Typography>
            <Typography>TrxID: {payment.trxid}</Typography>
            {orderError && <Typography color="error" sx={{ mt: 2 }}>{orderError}</Typography>}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" color="primary" onClick={handlePlaceOrder} disabled={placingOrder}>
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
            </Box>
          </Box>
        )}
        {activeStep === steps.length && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h4" fontWeight={900} color="primary.main" mb={2}>Thank you for your order!</Typography>
            <Typography variant="h6" mb={3}>Your payment has been received and your order is being processed.</Typography>
            <Button variant="contained" color="primary" size="large" onClick={() => window.location.href = '/shop'}>
              Start Shopping
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Checkout;
