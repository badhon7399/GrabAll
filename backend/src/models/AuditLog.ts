import { Schema, model, Document } from 'mongoose';

export interface IAuditLog extends Document {
  user?: Schema.Types.ObjectId; // User who performed the action
  userName?: string;
  userEmail?: string;
  action: string;             // Action description (e.g. 'UPDATE_SETTINGS', 'DELETE_PRODUCT')
  targetType: string;         // 'Product', 'Order', 'Settings', 'User', 'PromoCode', etc.
  targetId?: string;          // ID of target resource
  details?: any;              // Additional metadata
  ipAddress?: string;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    userEmail: { type: String },
    action: { type: String, required: true, index: true },
    targetType: { type: String, required: true, index: true },
    targetId: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
