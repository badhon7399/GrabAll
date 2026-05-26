import { Router, Response } from 'express';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import { logAudit } from '../utils/audit';
import { AuthRequest, protect, authorize } from '../middleware/auth';

const router = Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin / Super Admin)
router.get('/', protect, authorize('admin', 'super_admin', 'demo_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all audit logs
// @route   GET /api/users/audit-logs
// @access  Private (Admin / Super Admin / Demo Admin)
router.get('/audit-logs', protect, authorize('admin', 'super_admin', 'demo_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      logs,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred while fetching audit logs' });
  }
});

// @desc    Update user role & permissions
// @route   PUT /api/users/:id/role
// @access  Private (Super Admin only)
router.put('/:id/role', protect, authorize('super_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role, permissions } = req.body;

    if (typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!['customer', 'staff', 'manager', 'admin', 'super_admin', 'demo_admin'].includes(role)) {
      res.status(400).json({ message: 'Invalid role assignment' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Prevent revoking one's own rights to prevent lockout
    if (user._id.toString() === req.user?.id) {
      res.status(400).json({ message: 'You cannot change your own role' });
      return;
    }

    const oldRole = user.role;
    user.role = role;
    user.isAdmin = role === 'admin' || role === 'super_admin' || role === 'demo_admin';
    if (permissions !== undefined) {
      user.permissions = permissions;
    }

    const updatedUser = await user.save();
    
    // Log audit action
    await logAudit(req, {
      action: 'UPDATE_USER_ROLE',
      targetType: 'User',
      targetId: id,
      details: {
        targetUserEmail: user.email,
        oldRole,
        newRole: role,
        newPermissions: permissions
      }
    });

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      role: updatedUser.role,
      permissions: updatedUser.permissions,
      createdAt: (updatedUser as any).createdAt,
      updatedAt: (updatedUser as any).updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred while updating user role' });
  }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (Super Admin only)
router.delete('/:id', protect, authorize('super_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Prevent deleting oneself
    if (user._id.toString() === req.user?.id) {
      res.status(400).json({ message: 'You cannot delete yourself' });
      return;
    }

    const userEmail = user.email;
    await user.deleteOne();

    // Log audit action
    await logAudit(req, {
      action: 'DELETE_USER',
      targetType: 'User',
      targetId: id,
      details: {
        deletedUserEmail: userEmail
      }
    });

    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
