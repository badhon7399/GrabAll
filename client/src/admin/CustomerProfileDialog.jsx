import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Chip, Box, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const mockOrders = [
  { id: 'o1', date: '2024-03-01', amount: 120, status: 'Delivered' },
  { id: 'o2', date: '2024-04-12', amount: 55, status: 'Pending' },
];

const CustomerProfileDialog = ({ open, onClose, user }) => {
  if (!user) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Customer Profile</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{user.name}</Typography>
        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
        <Box my={2}>
          <Chip label={user.role} color={user.role === 'admin' ? 'primary' : 'default'} sx={{ mr: 1 }} />
          <Chip label={user.status} color={user.status === 'active' ? 'success' : 'warning'} />
        </Box>
        <Typography fontWeight={700} mt={3} mb={1}>Order History</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockOrders.map(o => (
              <TableRow key={o.id}>
                <TableCell>{o.date}</TableCell>
                <TableCell>${o.amount}</TableCell>
                <TableCell>{o.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography fontWeight={700} mt={3} mb={1}>Segmentation & Tags</Typography>
        <Box>
          {user.tags ? user.tags.map(tag => <Chip key={tag} label={tag} sx={{ mr: 1, mb: 1 }} />) : <Typography variant="caption">No tags</Typography>}
        </Box>
        <Typography fontWeight={700} mt={3} mb={1}>Reviews & Feedback</Typography>
        <Box>
          <Typography variant="body2" color="text.secondary">No reviews yet (mock)</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerProfileDialog;
