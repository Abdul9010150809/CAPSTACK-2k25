import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/env';
import { DatabaseService } from '../services/databaseService';
import { findUserByEmail, validatePassword, createUser } from '../models/User';
import { query } from '../config/db';
import { logger } from '../utils/logger';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Email not found. Please check your email or register for a new account.' });
    }

    // Validate password
    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Incorrect password. Please try again or reset your password.' });
    }

    // Sign token with user info and expiry
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const newUser = await createUser({ email, password, name });
    if (!newUser) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id.toString(),
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If an account with this email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save reset token to database
    await query(`
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at, used = false
    `, [user.id, resetToken, expiresAt]);

    // Send email (simplified - in production, use a proper email service)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    const emailContent = `
      Hi ${user.name},

      You requested a password reset for your CAPSTACK account.

      Click the link below to reset your password:
      ${resetLink}

      This link will expire in 15 minutes.

      If you didn't request this reset, please ignore this email.

      Best regards,
      CAPSTACK Team
    `;

    // Log the email content (in production, send actual email)
    logger.info(`Password reset email for ${email}:`);
    logger.info(emailContent);

    res.json({ message: 'If an account with this email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Find valid reset token
    const result = await query(`
      SELECT pr.*, u.email, u.name
      FROM password_resets pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.token = $1 AND pr.used = false AND pr.expires_at > NOW()
    `, [token]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const resetRecord = result.rows[0];

    // Hash new password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [hashedPassword, resetRecord.user_id]);

    // Mark token as used
    await query('UPDATE password_resets SET used = true WHERE id = $1', [resetRecord.id]);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};