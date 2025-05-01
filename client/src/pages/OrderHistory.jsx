import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import axios from 'axios';

const statusColors = {
  Pending: '#ff9800',
  Shipped: '#1976d2',
  Delivered: '#388e3c',
  Cancelled: '#d32f2f',
};

const OrderHistory = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !token) return;
    setLoading(true);
    axios.get('/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setOrders(res.data))
      .catch(e => setError(e.response?.data?.message || 'Failed to fetch orders'))
      .finally(() => setLoading(false));
  }, [user, token]);

  return (
    <div style={{ maxWidth: 900, margin: '48px auto', background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px 0 rgba(31, 38, 135, 0.10)', padding: '2.5rem 2rem' }}>
      <h2 style={{ fontWeight: 800, marginBottom: '2rem', color: '#222' }}>My Orders</h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: '#d32f2f', background: '#ffebee', padding: '1rem', borderRadius: 8 }}>{error}</div>
      ) : orders.length === 0 ? (
        <div style={{ color: '#555', textAlign: 'center', fontWeight: 600 }}>You have not placed any orders yet.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr style={{ background: '#e3f2fd' }}>
              <th style={{ padding: 12, fontWeight: 700 }}>Order ID</th>
              <th style={{ padding: 12, fontWeight: 700 }}>Date</th>
              <th style={{ padding: 12, fontWeight: 700 }}>Items</th>
              <th style={{ padding: 12, fontWeight: 700 }}>Total</th>
              <th style={{ padding: 12, fontWeight: 700 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: 12, fontWeight: 600, color: '#1976d2' }}>{order._id}</td>
                <td style={{ padding: 12 }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                <td style={{ padding: 12 }}>{Array.isArray(order.orderItems) ? order.orderItems.length : '-'}</td>
                <td style={{ padding: 12, fontWeight: 700 }}>৳{order.totalPrice ?? order.total ?? '-'}</td>
                <td style={{ padding: 12 }}>
                  <span style={{
                    padding: '6px 16px',
                    borderRadius: 16,
                    background: statusColors[order.status] || '#bdbdbd',
                    color: '#fff',
                    fontWeight: 700,
                  }}>{order.status || 'Unknown'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
