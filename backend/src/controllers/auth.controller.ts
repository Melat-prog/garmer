import { Request, Response } from 'express';
import { prisma } from '../models/prisma';
import admin from '../config/firebase';
import { AuthenticatedRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, role, companyName, contactName, location, yearsInBusiness } = req.body;

    if (!token || !role) {
      res.status(400).json({ error: 'Token and role are required' });
      return;
    }

    if (!['BUYER', 'SUPPLIER'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    // Verify firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid }
    });

    if (existingUser) {
      res.status(400).json({ error: 'User already registered' });
      return;
    }

    const email = decodedToken.email || '';

    // Create user and profile in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firebaseUid: decodedToken.uid,
          email,
          role,
        }
      });

      if (role === 'BUYER') {
        await tx.buyerProfile.create({
          data: {
            userId: newUser.id,
            companyName: companyName || 'Unknown Company',
            contactName: contactName || 'Unknown Contact',
          }
        });
      } else if (role === 'SUPPLIER') {
        await tx.supplierProfile.create({
          data: {
            userId: newUser.id,
            companyName: companyName || 'Unknown Company',
            location: location || 'Unknown Location',
            yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : 0,
          }
        });
      }

      return newUser;
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        buyerProfile: true,
        supplierProfile: true,
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
