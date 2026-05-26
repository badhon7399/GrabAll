import { Schema, model } from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  image: string;
  images?: string[];
  specs?: Array<{ label: string; value: string }>;
  originalPrice: number;
  salePrice: number;
  category: string;
  stock: number;
  discountPercent: number;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  specs: {
    type: [{
      label: { type: String, required: true },
      value: { type: String, required: true }
    }],
    default: []
  },
  originalPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 10 },
  discountPercent: { type: Number, required: true }
}, {
  timestamps: true
});

export const Product = model<IProduct>('Product', productSchema);
