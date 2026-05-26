import nodemailer from 'nodemailer';
import { config } from '../config/env';

// Load email credentials or fall back to mock console logs
const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || 'no-reply@graballgoods.com';

const isSmtpConfigured = !!(smtpHost && smtpUser && smtpPass);

let transporter: nodemailer.Transporter | null = null;

if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  if (transporter && isSmtpConfigured) {
    try {
      await transporter.sendMail({
        from: smtpFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      console.log(`[Email Service] Sent email to ${options.to} via SMTP: "${options.subject}"`);
    } catch (error) {
      console.error('[Email Service] Error sending SMTP email:', error);
      throw new Error('Email delivery failed');
    }
  } else {
    // Development Mock/Console fallback
    console.log('\n=================== MOCK EMAIL SENT ===================');
    console.log(`To:      ${options.to}`);
    console.log(`From:    ${smtpFrom}`);
    console.log(`Subject: ${options.subject}`);
    console.log('------------------------------------------------------');
    console.log(`Text:    ${options.text}`);
    console.log('------------------------------------------------------');
    console.log('HTML (preview):');
    console.log(options.html);
    console.log('=======================================================\n');
  }
};

/**
 * Send email verification token
 */
export const sendVerificationEmail = async (email: string, name: string, token: string): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  await sendEmail({
    to: email,
    subject: 'GrabAll - Verify Your Email Address',
    text: `Hi ${name},\n\nPlease verify your email by visiting: ${verificationUrl}\n\nThis token will expire in 24 hours.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0088FF;">Welcome to GrabAll!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please click the button below to verify your email address and activate your account:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #0088FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email</a>
        </p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 11px; color: #888;">GrabAll Goods, Dhaka, Bangladesh</p>
      </div>
    `,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email: string, name: string, token: string): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  
  await sendEmail({
    to: email,
    subject: 'GrabAll - Reset Your Password',
    text: `Hi ${name},\n\nYou requested a password reset. Please click the following link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #FF4B7E;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset the password for your GrabAll account. Click the button below to set a new password:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #FF4B7E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </p>
        <p>This password reset link is only valid for <strong>1 hour</strong>.</p>
        <p>If you did not make this request, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 11px; color: #888;">GrabAll Goods, Dhaka, Bangladesh</p>
      </div>
    `,
  });
};
