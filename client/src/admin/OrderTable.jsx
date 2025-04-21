import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const initialOrders = [
  { _id: 'o1', customer: 'Alice', total: 299, status: 'Pending', items: 2, date: '2025-04-19' },
  { _id: 'o2', customer: 'Bob', total: 129, status: 'Shipped', items: 1, date: '2025-04-18' },
  { _id: 'o3', customer: 'Priya', total: 799, status: 'Delivered', items: 4, date: '2025-04-17' },
];

const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

const OrderTable = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStatusChange = (order, newStatus) => {
    setOrders(orders.map(o => o._id === order._id ? { ...o, status: newStatus } : o));
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <Box>
      <Typography variant="h4" fontWeight={900} color="#232f3e" mb={4}>Orders</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 32px 0 rgba(91,134,229,0.10)' }}>
        <Table size="large">
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg,#5b86e5,#febd69)' }}>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Order ID</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Customer</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Date</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Items</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Total</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Status</TableCell>
              <TableCell align="right" sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o._id} sx={{
                transition: 'background 0.18s, transform 0.18s',
                '&:hover': {
                  background: 'linear-gradient(90deg,#e0e7ff 0%,#fff 100%)',
                  transform: 'scale(1.012) translateY(-2px)',
                  boxShadow: 3,
                },
              }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>{o._id}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{o.customer}</TableCell>
                <TableCell sx={{ color: '#5b86e5', fontWeight: 700 }}>{o.date}</TableCell>
                <TableCell sx={{ color: '#febd69', fontWeight: 700 }}>{o.items}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>${o.total}</TableCell>
                <TableCell>
                  <Select
                    value={o.status}
                    onChange={e => handleStatusChange(o, e.target.value)}
                    size="small"
                    sx={{ fontWeight: 700, color: '#232f3e', background: '#e0e7ff', borderRadius: 1 }}
                  >
                    {statusOptions.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                  </Select>
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleView(o)}><VisibilityIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography><b>Order ID:</b> {selectedOrder._id}</Typography>
              <Typography><b>Customer:</b> {selectedOrder.customer}</Typography>
              <Typography><b>Date:</b> {selectedOrder.date}</Typography>
              <Typography><b>Items:</b> {selectedOrder.items}</Typography>
              <Typography><b>Total:</b> ${selectedOrder.total}</Typography>
              <Typography><b>Status:</b> {selectedOrder.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderTable;
