import { AuditLog } from '../models/AuditLog';
import { User } from '../models/User';

interface AuditLogOptions {
  action: string;
  targetType: string;
  targetId?: string;
  details?: any;
}

export const logAudit = async (req: any, options: AuditLogOptions): Promise<void> => {
  try {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    
    const logData: any = {
      action: options.action,
      targetType: options.targetType,
      targetId: options.targetId,
      details: options.details,
      ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
    };

    if (req.user) {
      logData.user = req.user.id;
      const user = await User.findById(req.user.id).select('name email');
      if (user) {
        logData.userName = user.name;
        logData.userEmail = user.email;
      } else {
        logData.userName = 'Unknown User';
      }
    }

    const logEntry = new AuditLog(logData);
    await logEntry.save();
    
    console.log(`[AUDIT] Action: ${options.action} | Target: ${options.targetType} | By: ${logData.userEmail || 'Anonymous'}`);
  } catch (error) {
    console.error('Failed to save audit log:', error);
  }
};
