export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  specs?: ProductSpec[];
  originalPrice: number;
  salePrice: number;
  category: string;
  stock: number;
  discountPercent: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  _id: string; // matches product._id for quick lookup
  product: Product;
  qty: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  role: 'customer' | 'staff' | 'manager' | 'admin' | 'super_admin' | 'demo_admin';
  permissions?: string[];
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  product: string;
  name: string;
  qty: number;
  price: number;
  image: string;
}

export interface Order {
  _id: string;
  user?: string;
  guestDetails?: {
    name: string;
    email: string;
    phone: string;
  };
  orderItems: OrderItem[];
  shippingAddress: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  paymentSignature?: string;
  createdAt: string;
}
