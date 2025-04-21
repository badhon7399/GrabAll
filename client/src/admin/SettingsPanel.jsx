import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Grid, TextField, Button, Switch, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const SettingsPanel = () => {
  const [tab, setTab] = useState(0);
  const [general, setGeneral] = useState({ siteName: '', currency: 'BDT (৳)', language: 'bn' });
  const [payment, setPayment] = useState({ gateway: 'Stripe', enabled: true });
  const [shipping, setShipping] = useState({ method: 'Standard', rate: 5.99 });
  const [email, setEmail] = useState({ notifications: true, newsletter: false });
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all settings on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('/api/settings/general'),
      axios.get('/api/settings/payment'),
      axios.get('/api/settings/shipping'),
      axios.get('/api/settings/email'),
    ]).then(([g, p, s, e]) => {
      setGeneral(g.data?.data || general);
      setPayment(p.data?.data || payment);
      setShipping(s.data?.data || shipping);
      setEmail(e.data?.data || email);
      setLoading(false);
    }).catch(() => { setError('Failed to fetch settings'); setLoading(false); });
    // eslint-disable-next-line
  }, []);

  // Save settings
  const handleSave = (type) => {
    setLoading(true);
    let key, data;
    if (type === 'General') { key = 'general'; data = general; }
    else if (type === 'Payment') { key = 'payment'; data = payment; }
    else if (type === 'Shipping') { key = 'shipping'; data = shipping; }
    else if (type === 'Email/Notification') { key = 'email'; data = email; }
    axios.put(`/api/settings/${key}`, data)
      .then(() => setAlert(type + ' settings saved'))
      .catch((err) => {
        setError('Failed to save ' + type + ' settings');
        console.error('Settings save error:', err?.response || err);
      })
      .finally(() => setLoading(false));
    setTimeout(() => setAlert(''), 1800);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={900} color="#232f3e" mb={4}>Settings & Configuration</Typography>
      <Paper sx={{ p: 3, borderRadius: 4, mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="General" />
          <Tab label="Payment" />
          <Tab label="Shipping" />
          <Tab label="Email/Notifications" />
        </Tabs>
        <Box sx={{ mt: 3 }}>
          {loading && <Typography color="primary">Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          {tab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><TextField label="Site Name" fullWidth value={general.siteName} onChange={e => setGeneral(g => ({ ...g, siteName: e.target.value }))} /></Grid>
              <Grid item xs={12} md={4}><TextField label="Currency" fullWidth value={general.currency} onChange={e => setGeneral(g => ({ ...g, currency: e.target.value }))} /></Grid>
              <Grid item xs={12} md={4}><TextField label="Language" fullWidth value={general.language} onChange={e => setGeneral(g => ({ ...g, language: e.target.value }))} /></Grid>
              <Grid item xs={12}><Button variant="contained" onClick={() => handleSave('General')}>Save General Settings</Button></Grid>
            </Grid>
          )}
          {tab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}><TextField label="Payment Gateway" fullWidth value={payment.gateway} onChange={e => setPayment(p => ({ ...p, gateway: e.target.value }))} /></Grid>
              <Grid item xs={12} md={6}><Typography>Enabled <Switch checked={payment.enabled} onChange={e => setPayment(p => ({ ...p, enabled: e.target.checked }))} /></Typography></Grid>
              <Grid item xs={12}><Button variant="contained" onClick={() => handleSave('Payment')}>Save Payment Settings</Button></Grid>
            </Grid>
          )}
          {tab === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}><TextField label="Shipping Method" fullWidth value={shipping.method} onChange={e => setShipping(s => ({ ...s, method: e.target.value }))} /></Grid>
              <Grid item xs={12} md={6}><TextField label="Delivery Charge (৳)" fullWidth value={shipping.rate} onChange={e => setShipping(s => ({ ...s, rate: e.target.value }))} /></Grid>
              <Grid item xs={12}><Button variant="contained" onClick={() => handleSave('Shipping')}>Save Shipping Settings</Button></Grid>
            </Grid>
          )}
          {tab === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}><Typography>Email Notifications <Switch checked={email.notifications} onChange={e => setEmail(em => ({ ...em, notifications: e.target.checked }))} /></Typography></Grid>
              <Grid item xs={12} md={6}><Typography>Newsletter <Switch checked={email.newsletter} onChange={e => setEmail(em => ({ ...em, newsletter: e.target.checked }))} /></Typography></Grid>
              <Grid item xs={12}><Button variant="contained" onClick={() => handleSave('Email/Notification')}>Save Email/Notification Settings</Button></Grid>
            </Grid>
          )}
        </Box>
      </Paper>
      <Snackbar open={!!alert} autoHideDuration={1800} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>{alert}</Alert>
      </Snackbar>
      <Typography variant="body2" color="text.secondary">All configuration features are now available here.</Typography>
    </Box>
  );
};

export default SettingsPanel;
