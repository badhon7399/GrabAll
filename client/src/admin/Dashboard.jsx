import React from 'react';
import { Box, Grid, Paper, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const stats = [
  { label: 'Total Orders', value: 1240, icon: <ShoppingCartIcon fontSize="large" sx={{ color: '#5b86e5' }} /> },
  { label: 'Total Users', value: 812, icon: <PeopleIcon fontSize="large" sx={{ color: '#febd69' }} /> },
  { label: 'Products', value: 58, icon: <InventoryIcon fontSize="large" sx={{ color: '#232f3e' }} /> },
];

const Dashboard = () => (
  <Box>
    <Typography variant="h4" fontWeight={900} mb={4} color="primary.main">Dashboard Overview</Typography>
    <Grid container spacing={4}>
      {stats.map((stat, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Paper elevation={6} sx={{
            p: 5,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            borderRadius: 4,
            minHeight: 160,
            background: 'linear-gradient(135deg,#fff 60%,#e0e7ff 100%)',
            boxShadow: '0 4px 32px 0 rgba(91,134,229,0.15)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.05) translateY(-4px)',
              boxShadow: '0 8px 48px 0 rgba(91,134,229,0.24)',
            },
          }}>
            {stat.icon}
            <Box>
              <Typography variant="h3" fontWeight={900} color="#232f3e">{stat.value}</Typography>
              <Typography color="#5b86e5" fontWeight={700} fontSize={20}>{stat.label}</Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
    <Grid container spacing={4} sx={{ mt: 1 }}>
      {/* Sales Chart */}
      <Grid item xs={12} md={8}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg,#fff 60%,#e0e7ff 100%)', boxShadow: '0 4px 32px 0 rgba(91,134,229,0.10)', height: 320, overflow: 'hidden', '::-webkit-scrollbar': { display: 'none' } }}>
          <Typography variant="h6" fontWeight={800} mb={2} color="#232f3e">Sales This Month</Typography>
          <Line
            data={{
              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
              datasets: [{
                label: 'Sales',
                data: [3200, 4800, 3900, 5200],
                fill: true,
                backgroundColor: 'rgba(91,134,229,0.08)',
                borderColor: '#5b86e5',
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#febd69',
                pointBorderColor: '#232f3e',
              }],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, grid: { color: '#e0e7ff' } }, x: { grid: { color: '#e0e7ff' } } },
              animation: { duration: 1200 },
              responsive: true,
              maintainAspectRatio: false,
            }}
            height={220}
          />
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12} md={4}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg,#fff 60%,#e0e7ff 100%)', boxShadow: '0 4px 32px 0 rgba(91,134,229,0.10)', height: 320, overflow: 'hidden', '::-webkit-scrollbar': { display: 'none' } }}>
          <Typography variant="h6" fontWeight={800} mb={2} color="#232f3e">Recent Orders</Typography>
          <List sx={{ maxHeight: 210, overflow: 'auto', '::-webkit-scrollbar': { display: 'none' } }}>
            {[{id:'O-1241', user:'Alice', total:299}, {id:'O-1240', user:'Bob', total:129}, {id:'O-1239', user:'Priya', total:799}].map(order => (
              <ListItem key={order.id} sx={{ borderRadius: 2, mb: 1, background: '#e0e7ff', boxShadow: 1 }}>
                <ListItemText
                  primary={<b>{order.id}</b>}
                  secondary={<span>{order.user} &mdash; <span style={{color:'#5b86e5',fontWeight:700}}>৳{order.total}</span></span>}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      {/* Top Products */}
      <Grid item xs={12} md={6}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg,#fff 60%,#e0e7ff 100%)', boxShadow: '0 4px 32px 0 rgba(91,134,229,0.10)', height: 220, overflow: 'hidden', '::-webkit-scrollbar': { display: 'none' } }}>
          <Typography variant="h6" fontWeight={800} mb={2} color="#232f3e">Top Products</Typography>
          <List sx={{ maxHeight: 120, overflow: 'auto', '::-webkit-scrollbar': { display: 'none' } }}>
            {[{name:'Designer Sofa', sales:12}, {name:'Nordic Lamp', sales:9}, {name:'Modern Armchair', sales:7}].map(p => (
              <ListItem key={p.name} sx={{ borderRadius: 2, mb: 1, background: '#fff', boxShadow: 1 }}>
                <ListItemText
                  primary={<b>{p.name}</b>}
                  secondary={<span style={{color:'#febd69',fontWeight:700}}>{p.sales} sales</span>}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      {/* Summary Cards */}
      <Grid item xs={12} md={6}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg,#fff 60%,#e0e7ff 100%)', boxShadow: '0 4px 32px 0 rgba(91,134,229,0.10)', height: 220, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', '::-webkit-scrollbar': { display: 'none' } }}>
          <Typography variant="h6" fontWeight={800} mb={2} color="#232f3e">Quick Stats</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography fontWeight={700} color="#5b86e5">Avg. Order: <span style={{color:'#232f3e'}}>৳312</span></Typography></Grid>
            <Grid item xs={6}><Typography fontWeight={700} color="#febd69">Returning Users: <span style={{color:'#232f3e'}}>48%</span></Typography></Grid>
            <Grid item xs={6}><Typography fontWeight={700} color="#232f3e">Conversion Rate: <span style={{color:'#5b86e5'}}>3.8%</span></Typography></Grid>
            <Grid item xs={6}><Typography fontWeight={700} color="#232f3e">Refunds: <span style={{color:'#febd69'}}>2</span></Typography></Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

export default Dashboard;
