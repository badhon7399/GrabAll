import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";

const mockOrders = [
  { id: "o1", date: "2024-03-01", amount: 120, status: "Delivered" },
  { id: "o2", date: "2024-04-12", amount: 55, status: "Pending" },
];

const CustomerProfileDialog = ({ open, onClose, user }) => {
  if (!user) return null;
  const orders =
    user.orders && user.orders.length > 0 ? user.orders : mockOrders;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          background: "linear-gradient(90deg, #7f53ac 0%, #647dee 100%)",
          color: "#fff",
          fontWeight: 700,
        }}
      >
        Customer Profile
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar
            sx={{ width: 56, height: 56, bgcolor: "#7f53ac", fontWeight: 700 }}
          >
            {user.name ? user.name[0].toUpperCase() : "U"}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              {user.name || "Unknown User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email || "No email"}
            </Typography>
            <Box mt={1}>
              <Chip
                label={user.role || "customer"}
                color={user.role === "admin" ? "primary" : "default"}
                sx={{ mr: 1, fontWeight: 600 }}
              />
              <Chip
                label={user.status === "active" ? "Active" : "Inactive"}
                color={user.status === "active" ? "success" : "warning"}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography fontWeight={700} mt={2} mb={1} color="#7f53ac">
          Order History
        </Typography>
        <Table size="small" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.date}</TableCell>
                  <TableCell>${o.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={o.status}
                      color={
                        o.status === "Delivered"
                          ? "success"
                          : o.status === "Pending"
                          ? "warning"
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No orders found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Typography fontWeight={700} mt={2} mb={1} color="#7f53ac">
          Segmentation & Tags
        </Typography>
        <Box mb={2}>
          {user.tags && user.tags.length > 0 ? (
            user.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                sx={{
                  mr: 1,
                  mb: 1,
                  bgcolor: "#ede7f6",
                  color: "#7f53ac",
                  fontWeight: 600,
                }}
              />
            ))
          ) : (
            <Typography variant="caption" color="text.secondary">
              No tags
            </Typography>
          )}
        </Box>
        <Typography fontWeight={700} mt={2} mb={1} color="#7f53ac">
          Reviews & Feedback
        </Typography>
        <Box>
          <Typography variant="body2" color="text.secondary">
            No reviews yet (mock)
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerProfileDialog;
