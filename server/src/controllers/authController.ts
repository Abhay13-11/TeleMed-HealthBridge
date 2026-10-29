import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { localStore, pool, isDbConnected } from '../db/index.js';
import { AuthenticatedRequest, User, UserRole } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'healthbridge-dev-super-secure-jwt-secret-key-nabha-2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  phone: z.string().optional(),
  location: z.string().optional(),
  role: z.enum(['patient', 'doctor', 'pharmacy', 'admin']).optional(),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

function signToken(user: { id: string; email: string; name: string; role: UserRole }) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as any }
  );
}

export async function register(req: Request, res: Response) {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Validation failed'
      });
    }

    const { name, email, password, phone, location } = parsed.data;

    // Strict Anti-Privilege Escalation: Public registration can NEVER self-assign admin or clinical roles
    const assignedRole: UserRole = 'patient';

    // Check existing
    const store = localStore.get();
    if (store.users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: assignedRole,
      phone: phone || '',
      location: location || 'Nabha, Punjab',
      createdAt: new Date().toISOString()
    };

    store.users.push(newUser);
    localStore.save(store);

    if (isDbConnected()) {
      try {
        await pool.query(
          `INSERT INTO users (id, name, email, password, role, phone, location)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [newUser.id, newUser.name, newUser.email, newUser.password, newUser.role, newUser.phone, newUser.location]
        );
      } catch (err) {
        console.error('Error inserting user to PG:', err);
      }
    }

    const token = signToken(newUser);

    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userWithoutPassword
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during registration' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Validation failed'
      });
    }

    const { email, password } = parsed.data;
    const store = localStore.get();
    const user = store.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = signToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login' });
  }
}

export async function getCurrentUser(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }

  const store = localStore.get();
  const user = store.users.find((u: any) => u.id === req.user!.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User account not found' });
  }

  const { password: _, ...userWithoutPassword } = user;
  return res.json({
    success: true,
    user: userWithoutPassword
  });
}
