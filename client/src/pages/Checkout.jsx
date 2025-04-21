import { Box, Stepper, Step, StepLabel, Button, Typography, Paper, TextField, Grid } from '@mui/material';
import { useState } from 'react';

const steps = ['Shipping', 'Payment', 'Review'];

const Checkout = ({ cart, onPlaceOrder, onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', zip: '' });
  const [payment, setPayment] = useState({ card: '', expiry: '', cvc: '' });

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  const handlePlaceOrder = () => {
    onPlaceOrder({ shipping, payment });
    setActiveStep(steps.length);
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
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField label="Card Number" fullWidth required value={payment.card} onChange={e => setPayment(p => ({ ...p, card: e.target.value }))} /></Grid>
              <Grid item xs={6}><TextField label="Expiry" fullWidth required value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} /></Grid>
              <Grid item xs={6}><TextField label="CVC" fullWidth required value={payment.cvc} onChange={e => setPayment(p => ({ ...p, cvc: e.target.value }))} /></Grid>
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" color="primary" onClick={handleNext} disabled={!payment.card || !payment.expiry || !payment.cvc}>Next</Button>
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
                <Typography>{item.name} x{item.qty} - ${item.price * item.qty}</Typography>
              </Box>
            ))}
            <Typography fontWeight={700} mt={3} mb={2}>Payment</Typography>
            <Typography>Card: **** **** **** {payment.card.slice(-4)}</Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" color="primary" onClick={handlePlaceOrder}>Place Order</Button>
            </Box>
          </Box>
        )}
        {activeStep === steps.length && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h4" fontWeight={900} color="primary.main" mb={2}>Thank you for your order!</Typography>
            <Typography>Your order has been placed and will be shipped soon.</Typography>
            <Button variant="contained" color="primary" sx={{ mt: 4 }} onClick={onBack}>Back to Shop</Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Checkout;
