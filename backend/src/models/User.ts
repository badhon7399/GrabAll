import { Schema, model } from 'mongoose';

export type UserRole = 'customer' | 'staff' | 'manager' | 'admin' | 'super_admin' | 'demo_admin';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  role: UserRole;
  permissions: string[];
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isActive: boolean;
  refreshToken?: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['customer', 'staff', 'manager', 'admin', 'super_admin', 'demo_admin'],
    default: 'customer',
  },
  permissions: { type: [String], default: [] },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0, required: true },
  lockUntil: { type: Date },
  isEmailVerified: { type: Boolean, default: false, required: true },
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  isActive: { type: Boolean, default: true, required: true },
  refreshToken: { type: String },
}, {
  timestamps: true
});

userSchema.index({ emailVerificationToken: 1 }, { sparse: true });
userSchema.index({ passwordResetToken: 1 }, { sparse: true });

export const User = model<IUser>('User', userSchema);
