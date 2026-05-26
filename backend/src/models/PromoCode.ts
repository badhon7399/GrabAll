import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  discount: number; // Percentage (0-100)
  isActive: boolean;
  createdAt: Date;
}

const promoCodeSchema = new Schema<IPromoCode>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discount: { type: Number, required: true, min: 0, max: 100 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const PromoCode = mongoose.model<IPromoCode>('PromoCode', promoCodeSchema);
