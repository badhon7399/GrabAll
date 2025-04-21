import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Stack, InputAdornment, Switch, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', category: '', stock: '', tags: [], tagInput: '', metaTitle: '', metaDescription: '', images: [], detail: '' });
  const [categories, setCategories] = useState(["Furniture", "Lighting", "Decor"]); // Example default categories
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch products from backend
  useEffect(() => {
    setLoading(true);
    axios.get('/api/products')
      .then(res => {
        // Ensure products is always an array
        setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setError('Failed to fetch products');
        setProducts([]); // fallback to empty array
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOpenDialog = (product = null) => {
    setEditProduct(product);
    setForm(product || { name: '', price: '', category: '', stock: '', tags: [], tagInput: '', metaTitle: '', metaDescription: '', images: [], detail: '' });
    setDialogOpen(true);
  };

  // Bulk CSV export via backend
  const handleExportCSV = () => {
    window.open('/api/products/export', '_blank');
  };
  // Bulk CSV import via backend
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    axios.post('/api/products/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to import CSV'))
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(images => {
      setForm(f => ({ ...f, images: [...(f.images || []), ...images] }));
    });
  };

  const handleRemoveImage = (idx) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleCloseDialog = () => setDialogOpen(false);

  // Add or update product via backend
  const handleSave = () => {
    setLoading(true);
    // Sanitize and validate payload
    const payload = { ...form };
    payload.price = Number(form.price) || 0;
    payload.stock = Number(form.stock) || 0;
    payload.name = (form.name || '').trim();
    payload.category = (form.category || '').trim();
    payload.images = Array.isArray(form.images) ? form.images : [];
    if (payload.images.length > 0) {
      payload.image = payload.images[0];
    }
    payload.detail = form.detail || '';

    // Required field validation
    if (!payload.name || !payload.category || !payload.price) {
      setError('Name, category, and price are required and must be valid.');
      setLoading(false);
      return;
    }
    if (editProduct) {
      axios.put(`/api/products/${editProduct._id}`, payload)
        .then(res => setProducts(products.map(p => p._id === editProduct._id ? res.data : p)))
        .catch(() => setError('Failed to update product'))
        .finally(() => { setDialogOpen(false); setLoading(false); });
    } else {
      axios.post('/api/products', payload)
        .then(res => setProducts([...products, res.data]))
        .catch(err => {
          const backendMsg = err?.response?.data?.message;
          setError(backendMsg ? `Failed to add product: ${backendMsg}` : 'Failed to add product');
        })
        .finally(() => { setDialogOpen(false); setLoading(false); });
    }
  };
  // Delete product via backend
  const handleDelete = (product) => {
    setLoading(true);
    axios.delete(`/api/products/${product._id}`)
      .then(() => setProducts(products.filter(p => p._id !== product._id)))
      .catch(() => setError('Failed to delete product'))
      .finally(() => setLoading(false));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" fontWeight={900} color="#232f3e">Products</Typography>
        <Stack direction="row" spacing={2}>
          <Button component="label" variant="outlined">Import CSV<input type="file" hidden accept=".csv" onChange={handleImportCSV} /></Button>
          <Button variant="outlined" onClick={handleExportCSV}>Export CSV</Button>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ fontWeight: 700, background: 'linear-gradient(90deg,#5b86e5,#febd69)', color: '#232f3e', boxShadow: 3, px: 3, py: 1.5, borderRadius: 3 }} onClick={() => handleOpenDialog()}>
            Add Product
          </Button>
        </Stack>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 32px 0 rgba(91,134,229,0.10)' }}>
        <Table size="large">
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg,#5b86e5,#febd69)' }}>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Name</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Category</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Price</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Stock</TableCell>
              <TableCell sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Featured</TableCell>
              <TableCell align="right" sx={{ color: '#232f3e', fontWeight: 900, fontSize: 18 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(products) && products.map((p) => (
              <TableRow key={p._id} sx={{
                transition: 'background 0.18s, transform 0.18s',
                '&:hover': {
                  background: 'linear-gradient(90deg,#e0e7ff 0%,#fff 100%)',
                  transform: 'scale(1.012) translateY(-2px)',
                  boxShadow: 3,
                },
              }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 17 }}>{p.name}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{p.category}</TableCell>
                <TableCell sx={{ color: '#5b86e5', fontWeight: 700 }}>৳{p.price}</TableCell>
                <TableCell sx={{ color: p.stock < 10 ? 'red' : '#febd69', fontWeight: 700 }}>
                  {p.stock}
                  {p.stock < 10 && <Chip label="Low" color="error" size="small" sx={{ ml: 1, fontWeight: 700 }} />}
                </TableCell>
                <TableCell>
                  <Tooltip title={p.featured ? 'Unmark as Featured' : 'Mark as Featured'}>
                    <IconButton
                      color={p.featured ? 'warning' : 'default'}
                      onClick={async () => {
                        try {
                          const res = await axios.put(`/api/products/${p._id}`, { ...p, featured: !p.featured });
                          setProducts(products => products.map(prod => prod._id === p._id ? res.data : prod));
                        } catch {
                          setError('Failed to update featured status');
                        }
                      }}
                    >
                      {p.featured ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenDialog(p)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent sx={{ minWidth: 340 }}>
          <TextField label="Name" fullWidth margin="normal" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          {/* Category Section */}
          <Box sx={{ mb: 2 }}>
            <Typography fontWeight={700} mb={1}>Category</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <TextField
                label="Add New Category"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                size="small"
                sx={{ flex: 2 }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newCategory.trim()) {
                    if (!categories.includes(newCategory.trim())) setCategories([...categories, newCategory.trim()]);
                    setForm(f => ({ ...f, category: newCategory.trim() }));
                    setNewCategory("");
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  if (newCategory.trim() && !categories.includes(newCategory.trim())) {
                    setCategories([...categories, newCategory.trim()]);
                    setForm(f => ({ ...f, category: newCategory.trim() }));
                    setNewCategory("");
                  }
                }}
              >Add</Button>
            </Box>
            <TextField
              select
              label="Select Category"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              fullWidth
              SelectProps={{ native: true }}
              margin="normal"
            >
              <option value="">Select a category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </TextField>
          </Box>
          <TextField label="Tags (add & press enter)" fullWidth margin="normal" value={form.tagInput || ''} onChange={e => setForm(f => ({ ...f, tagInput: e.target.value }))} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} InputProps={{ endAdornment: <InputAdornment position="end"><Button size="small" onClick={handleAddTag}>Add</Button></InputAdornment> }} />
          <Box sx={{ mb: 2, minHeight: 36 }}>
            {form.tags && form.tags.map(tag => <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} sx={{ mr: 1, mb: 1 }} />)}
          </Box>
          <TextField label="Price" type="number" fullWidth margin="normal" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          <TextField label="Stock" type="number" fullWidth margin="normal" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
          
          <TextField label="Product Detail" fullWidth margin="normal" multiline minRows={2} value={form.detail || ''} onChange={e => setForm(f => ({ ...f, detail: e.target.value }))} />

          <TextField label="SEO Meta Description" fullWidth margin="normal" multiline minRows={2} value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} />
          <Box sx={{ mt: 2 }}>
            <Typography fontWeight={700} mb={1}>Product Images</Typography>
            <Button variant="outlined" component="label" sx={{ mb: 1 }}>
              Upload Images
              <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
            </Button>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
              {form.images && form.images.map((img, i) => (
                <Box key={i} sx={{ width: 64, height: 64, border: '2px solid #5b86e5', borderRadius: 2, p: 0.5, background: i === 0 ? '#e0e7ff' : '#fff', position: 'relative' }}>
                  <img src={img} alt={i === 0 ? 'Main' : 'Gallery'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                  {i === 0 && <Typography fontSize={10} color="#5b86e5" align="center">Main</Typography>}
                  <Button size="small" color="error" sx={{ position: 'absolute', top: 0, right: 0, minWidth: 0, p: 0.2, fontSize: 10 }} onClick={() => handleRemoveImage(i)}>✕</Button>
                </Box>
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              First image will be used as the main product photo. Others will be shown in product details.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editProduct ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTable;
