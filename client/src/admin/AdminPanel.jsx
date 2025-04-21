import React from 'react';
import AdminLayout from './AdminLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';

const navItems = [
  { label: 'Dashboard', value: 'dashboard', icon: <DashboardIcon /> },
  { label: 'Products', value: 'products', icon: <InventoryIcon /> },
  { label: 'Orders', value: 'orders', icon: <ShoppingCartIcon /> },
  { label: 'Users', value: 'users', icon: <PeopleIcon /> },
  { label: 'Content', value: 'content', icon: <ArticleIcon /> },
  { label: 'Slides', value: 'slides', icon: <ArticleIcon /> },
  { label: 'Settings', value: 'settings', icon: <SettingsIcon /> },
];

const AdminPanel = ({ onHome }) => {
  return <AdminLayout onHome={onHome} navItems={navItems} />;
};

export default AdminPanel;
