import { Schema, model, Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  qty: number;
  price: number;
  image: string;
}

export interface IGuestDetails {
  name: string;
  email: string;
  phone: string;
}

export interface IOrder {
  user?: Types.ObjectId;
  guestDetails?: IGuestDetails;
  orderItems: IOrderItem[];
  shippingAddress: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
}

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  guestDetails: {
    name: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false }
  },
  orderItems: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
  }],
  shippingAddress: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash On Delivery' },
  paymentStatus: { type: String, default: 'Pending' },
  orderStatus: { type: String, default: 'Processing' }
}, {
  timestamps: true
});

export const Order = model<IOrder>('Order', orderSchema);
