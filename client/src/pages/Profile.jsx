import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ name: user?.name || '', email: user?.email || '', password: '', confirmPassword: '' });
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await updateProfile({ name: form.name, email: form.email, password: form.password });
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Update failed');
    }
    setLoading(false);
  };

  return (
    <div style={{maxWidth: 400, margin: '48px auto 0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px 0 rgba(31, 38, 135, 0.12)', padding: '2.5rem 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h2 style={{fontWeight: 800, marginBottom: '1.5rem', color: '#222'}}>My Profile</h2>
      <form style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem'}} onSubmit={handleSubmit}>
        <label style={{fontWeight: 600, color: '#333', marginBottom: '0.3rem', marginTop: '0.5rem'}}>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required style={{padding: '0.7rem 1rem', borderRadius: 7, border: '1.5px solid #cfd8dc', fontSize: '1rem', transition: 'border-color 0.2s'}} />
        <label style={{fontWeight: 600, color: '#333', marginBottom: '0.3rem', marginTop: '0.5rem'}}>Email</label>
        <input name="email" value={form.email} onChange={handleChange} required style={{padding: '0.7rem 1rem', borderRadius: 7, border: '1.5px solid #cfd8dc', fontSize: '1rem', transition: 'border-color 0.2s'}} />
        <label style={{fontWeight: 600, color: '#333', marginBottom: '0.3rem', marginTop: '0.5rem'}}>New Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} style={{padding: '0.7rem 1rem', borderRadius: 7, border: '1.5px solid #cfd8dc', fontSize: '1rem', transition: 'border-color 0.2s'}} />
        <label style={{fontWeight: 600, color: '#333', marginBottom: '0.3rem', marginTop: '0.5rem'}}>Confirm New Password</label>
        <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} style={{padding: '0.7rem 1rem', borderRadius: 7, border: '1.5px solid #cfd8dc', fontSize: '1rem', transition: 'border-color 0.2s'}} />
        {error && <div style={{color: '#d32f2f', background: '#ffebee', padding: '0.7rem 1rem', borderRadius: 6, marginTop: '0.5rem', fontSize: '0.98rem', fontWeight: 600}}>{error}</div>}
        {message && <div style={{color: '#388e3c', background: '#e8f5e9', padding: '0.7rem 1rem', borderRadius: 6, marginTop: '0.5rem', fontSize: '0.98rem', fontWeight: 600}}>{message}</div>}
        <button type="submit" disabled={loading} style={{marginTop: '1.2rem', padding: '0.85rem 0', background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', color: '#fff', fontWeight: 700, fontSize: '1.1rem', border: 'none', borderRadius: 7, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', boxShadow: '0 2px 12px rgba(33, 150, 243, 0.08)'}}>{loading ? 'Updating...' : 'Update Profile'}</button>
      </form>
      <div style={{marginTop: '2rem', fontSize: '0.98rem', color: '#666', textAlign: 'left', width: '100%'}}>
        <div><b>Account Created:</b> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</div>
        <div><b>Last Updated:</b> {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : ''}</div>
      </div>
      <button onClick={logout} style={{marginTop: '2.2rem', background: '#fff', color: '#1976d2', border: '1.5px solid #1976d2', borderRadius: 7, padding: '0.7rem 0', width: '100%', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', transition: 'background 0.18s, color 0.18s'}} onMouseOver={e => {e.target.style.background='#1976d2';e.target.style.color='#fff';}} onMouseOut={e => {e.target.style.background='#fff';e.target.style.color='#1976d2';}}>Log out</button>
    </div>
  );
};

export default Profile;
