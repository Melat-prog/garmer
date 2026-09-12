import { Request, Response } from 'express';
import { prisma } from '../models/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, supplier, query, page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};
    if (category) where.categoryId = category;
    if (supplier) where.supplierId = supplier;
    if (query) {
      where.OR = [
        { name: { contains: query as string, mode: 'insensitive' } },
        { description: { contains: query as string, mode: 'insensitive' } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNumber,
        include: {
          supplier: { select: { companyName: true, isVerified: true, location: true } },
          category: { select: { name: true } },
          images: true
        }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        supplier: {
          include: { user: { select: { email: true } }, reviews: true, certificates: true }
        },
        category: true,
        images: true
      }
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ product });
  } catch (error) {
    console.error('Get Product By Id Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { categoryId, name, description, price, moq, fabric, colors, sizes, stock, deliveryTimeDays, countryOfOrigin, productionCapacity, images } = req.body;

    // Get supplier ID for the user
    const supplier = await prisma.supplierProfile.findUnique({
      where: { userId }
    });

    if (!supplier) {
      res.status(403).json({ error: 'Only suppliers can create products' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        supplierId: supplier.id,
        categoryId,
        name,
        description,
        price: price ? parseFloat(price) : null,
        moq: parseInt(moq),
        fabric,
        colors: colors || [],
        sizes: sizes || [],
        stock: stock ? parseInt(stock) : 0,
        deliveryTimeDays: deliveryTimeDays ? parseInt(deliveryTimeDays) : null,
        countryOfOrigin,
        productionCapacity,
        images: {
          create: images && Array.isArray(images) ? images.map((img: any) => ({
            url: img.url,
            isPrimary: img.isPrimary || false
          })) : []
        }
      },
      include: {
        images: true
      }
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updateData = req.body;

    const supplier = await prisma.supplierProfile.findUnique({
      where: { userId }
    });

    if (!supplier) {
      res.status(403).json({ error: 'Only suppliers can update products' });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || product.supplierId !== supplier.id) {
      res.status(404).json({ error: 'Product not found or not owned by you' });
      return;
    }

    // Don't update images this way, keep it simple for now or handle image updates separately
    delete updateData.images;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const supplier = await prisma.supplierProfile.findUnique({
      where: { userId }
    });

    if (!supplier && req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Unauthorized to delete product' });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id } });
    
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (req.user?.role !== 'ADMIN' && product.supplierId !== supplier?.id) {
      res.status(403).json({ error: 'Unauthorized to delete product' });
      return;
    }

    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
