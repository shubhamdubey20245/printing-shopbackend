import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
const db = require('../../database/models');
const { Tenant, User } = db;
import sequelize from '../../config/database';

export const registerTenant = async (req: Request, res: Response) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { tenantName, businessName, userName, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 2. Create Tenant
    const tenant = await Tenant.create({
      name: tenantName,
      business_name: businessName,
    }, { transaction });

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create Owner User
    const user = await User.create({
      tenant_id: tenant.id,
      name: userName,
      email,
      password: hashedPassword,
      role: 'OWNER'
    }, { transaction });

    await transaction.commit();

    // 5. Generate Token
    const token = jwt.sign(
      { id: user.id, tenant_id: tenant.id, role: user.role },
      process.env.JWT_SECRET || 'supersecret_mediflow_jwt_key_2026',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any }
    );

    return res.status(201).json({
      message: 'Tenant and Owner created successfully',
      token,
      tenant: { id: tenant.id, name: tenant.name },
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error: any) {
    try {
      if (transaction) await transaction.rollback();
    } catch (rollbackError) {
      console.error('Rollback failed:', rollbackError);
    }
    console.error('Registration error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error', details: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    await user.update({ last_login: new Date() });

    const token = jwt.sign(
      { id: user.id, tenant_id: user.tenant_id, role: user.role },
      process.env.JWT_SECRET || 'supersecret_mediflow_jwt_key_2026',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, tenant_id: user.tenant_id }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
