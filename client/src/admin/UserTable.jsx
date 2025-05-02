import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import CustomerProfileDialog from './CustomerProfileDialog';
import axios from 'axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'customer', status: 'active', tags: [], tagInput: '' });
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [emailDialog, setEmailDialog] = useState(false);
  const [emailTarget, setEmailTarget] = useState(null);
  const [emailContent, setEmailContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users from backend
  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/users`)
      .then(res => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to fetch users'))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenDialog = (user = null) => {
    setEditUser(user);
    setForm(user || { name: '', email: '', role: 'customer', status: 'active', tags: [], tagInput: '' });
    setDialogOpen(true);
  };
  const handleCloseDialog = () => setDialogOpen(false);

  // Add or update user via backend
  const handleSave = () => {
    setLoading(true);
    if (editUser) {
      axios.put(`${import.meta.env.VITE_API_URL}/api/users/${editUser._id}`, form)
        .then(res => setUsers(users.map(u => u._id === editUser._id ? res.data : u)))
        .catch(() => setError('Failed to update user'))
        .finally(() => { setDialogOpen(false); setLoading(false); });
    } else {
      axios.post(`${import.meta.env.VITE_API_URL}/api/users`, form)
        .then(res => setUsers([...users, res.data]))
        .catch(() => setError('Failed to add user'))
        .finally(() => { setDialogOpen(false); setLoading(false); });
    }
  };
  // Delete user via backend
  const handleDelete = (user) => {
    setLoading(true);
    axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${user._id}`)
      .then(() => setUsers(users.filter(u => u._id !== user._id)))
      .catch(() => setError('Failed to delete user'))
      .finally(() => setLoading(false));
  };

  // Tag logic
  const handleAddTag = () => {
    if (form.tagInput && !form.tags.includes(form.tagInput)) {
      setForm(f => ({ ...f, tags: [...f.tags, f.tagInput], tagInput: '' }));
    }
  };
  const handleRemoveTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  // Profile dialog
  const handleOpenProfile = (user) => {
    setProfileUser(user);
    setProfileOpen(true);
  };
  const handleCloseProfile = () => setProfileOpen(false);

  // Email dialog
  const handleOpenEmail = (user) => {
    setEmailTarget(user);
    setEmailDialog(true);
    setEmailContent('');
  };
  const handleCloseEmail = () => setEmailDialog(false);
  const handleSendEmail = () => {
    setEmailDialog(false);
    alert('Mock: Email sent to ' + emailTarget.email);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" fontWeight={900} color="#232f3e">Users</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ fontWeight: 700, background: 'linear-gradient(90deg,#5b86e5,#febd69)', color: '#232f3e', boxShadow: 3, px: 3, py: 1.5, borderRadius: 3 }} onClick={() => handleOpenDialog()}>
          Add User
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 32px 0 rgba(91,134,229,0.10)' }}>
        <Table size="large">
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg,#5b86e5,#febd69)' }}>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Name</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Email</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Role</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Status</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Tags</TableCell>
              <TableCell align="right" sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(Array.isArray(users) ? users : []).map((u) => (
              <TableRow key={u._id} sx={{
                transition: 'background 0.18s, transform 0.18s',
                '&:hover': {
                  background: 'linear-gradient(90deg,#e0e7ff 0%,#fff 100%)',
                  transform: 'scale(1.012) translateY(-2px)',
                  boxShadow: 3,
                },
              }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>
                  <Button variant="text" onClick={() => handleOpenProfile(u)}>{u.name}</Button>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{u.email}</TableCell>
                <TableCell>
                  <Chip label={u.role} color={u.role === 'admin' ? 'primary' : 'default'} sx={{ fontWeight: 700, textTransform: 'capitalize' }} />
                </TableCell>
                <TableCell>
                  <Chip label={u.status} color={u.status === 'active' ? 'success' : 'warning'} sx={{ fontWeight: 700, textTransform: 'capitalize' }} />
                </TableCell>
                <TableCell>
                  {u.tags && u.tags.map(tag => <Chip key={tag} label={tag} sx={{ mr: 0.5, mb: 0.5 }} />)}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton color="primary" onClick={() => handleOpenDialog(u)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(u)}><DeleteIcon /></IconButton>
                    <IconButton color="info" onClick={() => handleOpenEmail(u)}><EmailIcon /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent sx={{ minWidth: 340 }}>
          <TextField label="Name" fullWidth margin="normal" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <TextField label="Email" fullWidth margin="normal" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <TextField label="Role" fullWidth margin="normal" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <TextField label="Status" fullWidth margin="normal" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
          <TextField label="Tags (add & press enter)" fullWidth margin="normal" value={form.tagInput || ''} onChange={e => setForm(f => ({ ...f, tagInput: e.target.value }))} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} />
          <Box sx={{ mb: 2, minHeight: 36 }}>
            {form.tags && form.tags.map(tag => <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} sx={{ mr: 1, mb: 1 }} />)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editUser ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
      {/* Customer Profile Dialog */}
      <CustomerProfileDialog open={profileOpen} onClose={handleCloseProfile} user={profileUser} />
      {/* Email Dialog (mock) */}
      <Dialog open={emailDialog} onClose={handleCloseEmail}>
        <DialogTitle>Send Email / Newsletter</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>To: {emailTarget?.email}</Typography>
          <TextField label="Message" fullWidth multiline minRows={4} value={emailContent} onChange={e => setEmailContent(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmail}>Cancel</Button>
          <Button variant="contained" onClick={handleSendEmail}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserTable;
