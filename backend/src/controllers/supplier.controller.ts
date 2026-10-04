import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const getSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    const suppliers = await prisma.supplierProfile.findMany({
      select: {
        id: true,
        companyName: true,
        logoUrl: true,
        location: true,
        yearsInBusiness: true,
        isVerified: true,
        description: true,
        _count: {
          select: {
            products: true,
            reviews: true,
          }
        }
      }
    });

    res.json({ suppliers });
  } catch (error) {
    console.error('Get Suppliers Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const supplier = await prisma.supplierProfile.findUnique({
      where: { id },
      select: {
        id: true,
        companyName: true,
        logoUrl: true,
        location: true,
        yearsInBusiness: true,
        isVerified: true,
        description: true,
        certificates: {
          select: { id: true, name: true, url: true }
        },
        reviews: {
          select: { id: true, rating: true, comment: true, createdAt: true }
        },
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            moq: true,
            images: { take: 1, select: { url: true, isPrimary: true } }
          }
        }
      }
    });

    if (!supplier) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    res.json({ supplier });
  } catch (error) {
    console.error('Get Supplier By Id Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
