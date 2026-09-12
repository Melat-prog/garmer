import { Request, Response } from 'express';
import { prisma } from '../models/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: { children: true }
    });
    res.json({ categories });
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, parentId } = req.body;
    
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Only admins can create categories' });
      return;
    }

    const category = await prisma.category.create({
      data: { name, parentId }
    });

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('Create Category Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Only admins can delete categories' });
      return;
    }

    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete Category Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
