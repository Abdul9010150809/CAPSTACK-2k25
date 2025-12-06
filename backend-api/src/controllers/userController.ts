import { Request, Response } from 'express';
import { query } from '../config/db';
import { logger } from '../utils/logger';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const result = await query(`
      SELECT
        u.id, u.email, u.name, u.created_at, u.updated_at,
        up.monthly_income, up.monthly_expenses, up.emergency_fund,
        up.savings_rate, up.location, up.industry, up.experience_years
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      email: row.email,
      name: row.name,
      monthlyIncome: row.monthly_income,
      monthlyExpenses: row.monthly_expenses,
      emergencyFund: row.emergency_fund,
      savingsRate: row.savings_rate,
      location: row.location,
      industry: row.industry,
      experienceYears: row.experience_years,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    logger.error(`Failed to get user profile for user ${(req as any).userId}: ${error}`);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const {
      name,
      email,
      location,
      industry,
      experience_years,
      monthly_income,
      monthly_expenses,
      emergency_fund,
      savings_rate
    } = req.body;

    // Update user basic info
    if (name || email) {
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (name) {
        updateFields.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (email) {
        updateFields.push(`email = $${paramIndex++}`);
        values.push(email);
      }

      updateFields.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());
      values.push(userId);

      const userQuery = `
        UPDATE users
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
      `;

      await query(userQuery, values);
    }

    // Update or insert user profile
    const profileQuery = `
      INSERT INTO user_profiles (
        user_id, monthly_income, monthly_expenses, emergency_fund,
        savings_rate, location, industry, experience_years, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (user_id)
      DO UPDATE SET
        monthly_income = EXCLUDED.monthly_income,
        monthly_expenses = EXCLUDED.monthly_expenses,
        emergency_fund = EXCLUDED.emergency_fund,
        savings_rate = EXCLUDED.savings_rate,
        location = EXCLUDED.location,
        industry = EXCLUDED.industry,
        experience_years = EXCLUDED.experience_years,
        updated_at = EXCLUDED.updated_at
    `;

    await query(profileQuery, [
      userId,
      monthly_income || 0,
      monthly_expenses || 0,
      emergency_fund || 0,
      savings_rate || 0,
      location || null,
      industry || null,
      experience_years || null,
      new Date(),
      new Date()
    ]);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    logger.error(`Failed to update user profile for user ${(req as any).userId}: ${error}`);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};