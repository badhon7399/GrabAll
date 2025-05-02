import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Chip, Stack, Tooltip, TextField, InputAdornment, Avatar, Checkbox, TablePagination, FormControl, InputLabel
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';

const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
const paymentOptions = ['All', 'Paid', 'Unpaid'];
const deliveryOptions = ['All', 'Delivered', 'Shipped', 'Pending'];

function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleString();
}

function exportToCSV(orders) {
  if (!orders.length) return;
  const header = [
    'Order ID', 'Customer', 'Email', 'Date', 'Items', 'Total', 'Payment', 'Delivery', 'Status', 'Shipping Address'
  ];
  const rows = orders.map(o => [
    o._id,
    o.customer?.name || o.customer?.email || o.customer || '-',
    o.customer?.email || '-',
    formatDate(o.createdAt || o.date),
    Array.isArray(o.orderItems) ? o.orderItems.length : o.items || '-',
    o.totalPrice ?? o.total ?? '-',
    o.isPaid ? 'Paid' : 'Unpaid',
    o.isDelivered ? 'Delivered' : (o.status === 'Shipped' ? 'Shipped' : 'Pending'),
    o.status,
    o.shippingAddress ? `${o.shippingAddress.address}, ${o.shippingAddress.city}, ${o.shippingAddress.postalCode}, ${o.shippingAddress.country}` : '-'
  ]);
  const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orders_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const OrderTable = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [deliveryFilter, setDeliveryFilter] = useState('All');
  const [selected, setSelected] = useState([]); // For bulk actions
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, order: null, newStatus: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setErrorMsg('Failed to fetch orders'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleStatusChange = (order, newStatus) => {
    setConfirmDialog({ open: true, order, newStatus });
  };

  const confirmStatusChange = async () => {
    if (!confirmDialog.order || !confirmDialog.newStatus) return;
    console.log('Sending PATCH to backend:', confirmDialog.order._id, confirmDialog.newStatus);
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/orders/${confirmDialog.order._id}/status`, { status: confirmDialog.newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('PATCH response:', res.data);
      setOrders(orders.map(o => o._id === confirmDialog.order._id ? { ...o, status: confirmDialog.newStatus } : o));
    } catch (err) {
      console.error('PATCH error:', err?.response || err);
      setErrorMsg(err?.response?.data?.message || 'Failed to update order status');
      alert(err?.response?.data?.message || 'Failed to update order status');
    }
    setConfirmDialog({ open: false, order: null, newStatus: '' });
  };

  const cancelStatusChange = () => setConfirmDialog({ open: false, order: null, newStatus: '' });

  const handleBulkStatusChange = (newStatus) => {
    setOrders(orders.map(o => selected.includes(o._id) ? { ...o, status: newStatus } : o));
    setSelected([]);
    // TODO: Optionally update backend here
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredOrders.map(o => o._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (orderId) => {
    setSelected(sel => sel.includes(orderId) ? sel.filter(id => id !== orderId) : [...sel, orderId]);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => setDialogOpen(false);

  // Defensive: always filter on an array
  const filteredOrders = (Array.isArray(orders) ? orders : []).filter(o => {
    const customer = o.customer?.name || o.customer?.email || o.customer || '';
    let match = (
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      customer?.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'All') match = match && o.status === statusFilter;
    if (paymentFilter !== 'All') match = match && ((paymentFilter === 'Paid' && o.isPaid) || (paymentFilter === 'Unpaid' && !o.isPaid));
    if (deliveryFilter !== 'All') {
      if (deliveryFilter === 'Delivered') match = match && o.isDelivered;
      else if (deliveryFilter === 'Shipped') match = match && o.status === 'Shipped';
      else if (deliveryFilter === 'Pending') match = match && !o.isDelivered && o.status !== 'Shipped';
    }
    return match;
  });

  // Pagination
  const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={900} color="#232f3e">Orders</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by Order ID or Customer"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
              <MenuItem value="All">All</MenuItem>
              {statusOptions.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Payment</InputLabel>
            <Select value={paymentFilter} label="Payment" onChange={e => setPaymentFilter(e.target.value)}>
              {paymentOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Delivery</InputLabel>
            <Select value={deliveryFilter} label="Delivery" onChange={e => setDeliveryFilter(e.target.value)}>
              {deliveryOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<GetAppIcon />} onClick={() => exportToCSV(filteredOrders)}>
            Export CSV
          </Button>
        </Stack>
      </Stack>
      {selected.length > 0 && (
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Typography fontWeight={700}>{selected.length} selected</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Bulk Status</InputLabel>
            <Select label="Bulk Status" onChange={e => handleBulkStatusChange(e.target.value)} defaultValue="">
              <MenuItem value="">Choose...</MenuItem>
              {statusOptions.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </Select>
          </FormControl>
          <Button onClick={() => setSelected([])}>Clear</Button>
        </Stack>
      )}
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 32px 0 rgba(91,134,229,0.10)' }}>
        <Table size="large">
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg,#5b86e5,#febd69)', boxShadow: '0 2px 8px 0 rgba(91,134,229,0.10)' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < paginatedOrders.length}
                  checked={paginatedOrders.length > 0 && selected.length === paginatedOrders.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Order ID</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Customer</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Date</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Items</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18, textAlign: 'right' }}>Total</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Payment</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Delivery</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Status</TableCell>
              <TableCell align="right" sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(Array.isArray(orders) ? orders : []).map((o) => {
              const customer = o.customer?.name || o.customer?.email || o.customer || '-';
              const itemsCount = Array.isArray(o.orderItems) ? o.orderItems.length : o.items || '-';
              const paymentStatus = o.isPaid ? 'Paid' : 'Unpaid';
              const deliveryStatus = o.isDelivered ? 'Delivered' : (o.status === 'Shipped' ? 'Shipped' : 'Pending');
              return (
                <TableRow key={o._id} sx={{
                  transition: 'background 0.18s, transform 0.18s',
                  '&:hover': {
                    background: 'linear-gradient(90deg,#e0e7ff 0%,#fff 100%)',
                    transform: 'scale(1.012) translateY(-2px)',
                    boxShadow: 3,
                  },
                }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selected.includes(o._id)}
                      onChange={() => handleSelect(o._id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 17, cursor: 'pointer', color: '#3b5bdb' }} onClick={() => handleView(o)}>
                    {o._id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {o.customer?.avatar && <Avatar src={o.customer.avatar} alt={customer} sx={{ width: 28, height: 28, mr: 1 }} />}
                    <span>{customer}</span>
                  </TableCell>
                  <TableCell sx={{ color: '#5b86e5', fontWeight: 700 }}>{formatDate(o.createdAt || o.date)}</TableCell>
                  <TableCell sx={{ color: '#febd69', fontWeight: 700 }}>{itemsCount}</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>৳{o.totalPrice ?? o.total ?? '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={paymentStatus}
                      color={o.isPaid ? 'success' : 'warning'}
                      variant="outlined"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={deliveryStatus}
                      color={deliveryStatus === 'Delivered' ? 'success' : deliveryStatus === 'Shipped' ? 'info' : 'warning'}
                      variant="outlined"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={statusOptions.includes(o.status) ? o.status : ''}
                      onChange={e => handleStatusChange(o, e.target.value)}
                      size="small"
                      sx={{ fontWeight: 700, color: '#232f3e', background: '#e0e7ff', borderRadius: 1 }}
                    >
                      <MenuItem value="">Unknown</MenuItem>
                      {statusOptions.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton color="primary" onClick={() => handleView(o)}><VisibilityIcon /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography><b>Order ID:</b> {selectedOrder._id}</Typography>
                <Typography><b>Date:</b> {formatDate(selectedOrder.createdAt || selectedOrder.date)}</Typography>
              </Stack>
              <Typography><b>Customer:</b> {selectedOrder.user?.name || selectedOrder.user?.email || selectedOrder.customer?.name || selectedOrder.customer?.email || selectedOrder.customer || '-'}</Typography>
              <Typography><b>Email:</b> {selectedOrder.user?.email || selectedOrder.customer?.email || '-'}</Typography>
              {(selectedOrder.paymentMobile || selectedOrder.payment?.mobile) && (
                <Typography><b>Mobile Number:</b> {selectedOrder.paymentMobile || selectedOrder.payment?.mobile}</Typography>
              )}
              {(selectedOrder.paymentTrxId || selectedOrder.payment?.trxid) && (
                <Typography><b>TrxID:</b> {selectedOrder.paymentTrxId || selectedOrder.payment?.trxid}</Typography>
              )}
              <Typography><b>Payment:</b> {selectedOrder.paymentMethod || '-'}</Typography>
              <Typography><b>Payment Status:</b> <Chip label={selectedOrder.isPaid ? 'Paid' : 'Unpaid'} color={selectedOrder.isPaid ? 'success' : 'warning'} size="small" /></Typography>
              <Typography><b>Delivery Status:</b> <Chip label={selectedOrder.isDelivered ? 'Delivered' : (selectedOrder.status === 'Shipped' ? 'Shipped' : 'Pending')} color={selectedOrder.isDelivered ? 'success' : selectedOrder.status === 'Shipped' ? 'info' : 'warning'} size="small" /></Typography>
              <Typography><b>Shipping Address:</b> {selectedOrder.shippingAddress ? `${selectedOrder.shippingAddress.address}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.postalCode}, ${selectedOrder.shippingAddress.country}` : '-'}</Typography>
              <Box mt={2}>
                <Typography fontWeight={700} mb={1}>Items:</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedOrder.orderItems || []).map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {item.image && <img src={item.image} alt={item.name} style={{ width: 40, height: 40, objectFit: 'cover', marginRight: 8, borderRadius: 4, verticalAlign: 'middle' }} />}
                          {item.name}
                        </TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>৳{item.price}</TableCell>
                        <TableCell>৳{(item.price * item.qty).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Stack direction="row" justifyContent="flex-end" spacing={4} mt={3}>
                <Typography fontWeight={700}>Subtotal: ৳{selectedOrder.itemsPrice ?? '-'}</Typography>
                <Typography fontWeight={700}>Tax: ৳{selectedOrder.taxPrice ?? 0}</Typography>
                <Typography fontWeight={700}>Shipping: ৳{selectedOrder.shippingPrice ?? 0}</Typography>
                <Typography fontWeight={700}>Total: ৳{selectedOrder.totalPrice ?? selectedOrder.total ?? '-'}</Typography>
              </Stack>
              <Stack direction="row" spacing={4} mt={2}>
                <Typography fontSize={13} color="text.secondary">Placed: {formatDate(selectedOrder.createdAt)}</Typography>
                <Typography fontSize={13} color="text.secondary">Paid: {selectedOrder.paidAt ? formatDate(selectedOrder.paidAt) : '-'}</Typography>
                <Typography fontSize={13} color="text.secondary">Delivered: {selectedOrder.deliveredAt ? formatDate(selectedOrder.deliveredAt) : '-'}</Typography>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDialog.open} onClose={cancelStatusChange}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to change the status of order <b>{confirmDialog.order?._id}</b> to <b>{confirmDialog.newStatus}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelStatusChange} color="secondary">Cancel</Button>
          <Button onClick={confirmStatusChange} color="primary" variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
      {/* Show error message if present */}
      {errorMsg && (
        <Box sx={{ mt: 2 }}>
          <Typography color="error">{errorMsg}</Typography>
        </Box>
      )}
      {loading && (
        <Box sx={{ mt: 2 }}>
          <Typography>Loading...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default OrderTable;
