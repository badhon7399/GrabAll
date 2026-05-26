import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { AuthRequest, protect } from '../middleware/auth';
import { config } from '../config/env';
import { validateRequest } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/schemas';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email';

const router = Router();

const generateAccessToken = (
  id: string,
  isAdmin: boolean,
  role: string,
  permissions: string[]
): string => {
  return jwt.sign({ id, isAdmin, role, permissions }, config.JWT_SECRET, {
    expiresIn: '15m', // Short-lived access token
  });
};

const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: '7d', // Long-lived refresh token
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateRequest(registerSchema), async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'customer',
      permissions: [],
      isAdmin: false,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
    });

    if (user) {
      const accessToken = generateAccessToken(user._id.toString(), user.isAdmin, user.role, user.permissions);
      const refreshToken = generateRefreshToken(user._id.toString());

      user.refreshToken = refreshToken;
      await user.save();

      setRefreshTokenCookie(res, refreshToken);

      // Send verification email asynchronously
      sendVerificationEmail(user.email, user.name, verificationToken).catch(err => {
        console.error('Error sending verification email:', err);
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        permissions: user.permissions,
        token: accessToken,
      });
      return;
    } else {
      res.status(400).json({ message: 'Invalid user data' });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    return;
  }
});

// @desc    Auth user & get token (with Account Lockout protection)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Check if account is currently locked
    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
      const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / (60 * 1000));
      res.status(403).json({
        message: `Account is temporarily locked due to excessive failed attempts. Try again in ${remainingMinutes} minutes.`,
      });
      return;
    }

    // Verify Password
    if (user.password && (await bcrypt.compare(password, user.password))) {
      // Reset lock and login attempts on success
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      user.lastLogin = new Date();

      const accessToken = generateAccessToken(user._id.toString(), user.isAdmin, user.role, user.permissions);
      const refreshToken = generateRefreshToken(user._id.toString());

      user.refreshToken = refreshToken;
      await user.save();

      setRefreshTokenCookie(res, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        permissions: user.permissions,
        token: accessToken,
      });
      return;
    } else {
      // Increment failed attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      }
      await user.save();

      if (user.loginAttempts >= 5) {
        res.status(403).json({
          message: 'Account locked due to excessive failed attempts. Please try again in 15 minutes.',
        });
      } else {
        res.status(401).json({
          message: `Invalid email or password. ${5 - user.loginAttempts} attempts remaining.`,
        });
      }
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred during login' });
    return;
  }
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: 'Refresh token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken || !user.isActive) {
      res.status(401).json({ message: 'Invalid or revoked refresh token' });
      return;
    }

    const newAccessToken = generateAccessToken(user._id.toString(), user.isAdmin, user.role, user.permissions);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;
    await user.save();

    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      token: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({ message: 'Expired or invalid refresh token' });
  }
});

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    } catch (e) {
      // Ignore token issues on logout
    }
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.json({ message: 'Logged out successfully' });
});

// @desc    Verify email address
// @route   POST /api/auth/verify-email
// @access  Public
router.post('/verify-email', async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: 'Token is required' });
    return;
  }

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired verification token' });
      return;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during verification' });
  }
});

// @desc    Resend email verification token
// @route   POST /api/auth/resend-verification
// @access  Public
router.post('/resend-verification', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({ message: 'Email is already verified' });
      return;
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(user.email, user.name, verificationToken);

    res.json({ message: 'Verification email resent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Forgot password (request token)
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.json({ message: 'If that email exists, a password reset link has been sent.' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration
    await user.save();

    await sendPasswordResetEmail(user.email, user.name, resetToken);

    res.json({ message: 'If that email exists, a password reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: 'Token and new password are required' });
    return;
  }

  if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    res.status(400).json({ message: 'Password must be at least 8 characters long and contain mixed case letters and numbers' });
    return;
  }

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    res.json({ message: 'Password reset successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (user) {
      res.json(user);
      return;
    } else {
      res.status(404).json({ message: 'User not found' });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    return;
  }
});

export default router;
