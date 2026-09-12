import { Request, Response } from 'express';
import { prisma } from '../models/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const createInquiry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId, quantity, country, message } = req.body;

    const buyer = await prisma.buyerProfile.findUnique({
      where: { userId }
    });

    if (!buyer) {
      res.status(403).json({ error: 'Only buyers can submit inquiries' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        productId,
        buyerId: buyer.id,
        supplierId: product.supplierId,
        quantity: parseInt(quantity),
        country,
        message,
        status: 'PENDING'
      }
    });

    // Create a notification for the supplier
    const supplierUser = await prisma.supplierProfile.findUnique({
      where: { id: product.supplierId },
      include: { user: true }
    });

    if (supplierUser) {
      await prisma.notification.create({
        data: {
          userId: supplierUser.userId,
          type: 'NEW_INQUIRY',
          title: 'New Quotation Request',
          message: `You received a new request for ${product.name} from ${buyer.companyName}`
        }
      });
    }

    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
  } catch (error) {
    console.error('Create Inquiry Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInquiries = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let inquiries = [];

    if (role === 'BUYER') {
      const buyer = await prisma.buyerProfile.findUnique({ where: { userId } });
      if (buyer) {
        inquiries = await prisma.inquiry.findMany({
          where: { buyerId: buyer.id },
          include: {
            product: { select: { name: true, images: { take: 1 } } },
            supplier: { select: { companyName: true } }
          },
          orderBy: { createdAt: 'desc' }
        });
      }
    } else if (role === 'SUPPLIER') {
      const supplier = await prisma.supplierProfile.findUnique({ where: { userId } });
      if (supplier) {
        inquiries = await prisma.inquiry.findMany({
          where: { supplierId: supplier.id },
          include: {
            product: { select: { name: true, images: { take: 1 } } },
            buyer: { select: { companyName: true, contactName: true } }
          },
          orderBy: { createdAt: 'desc' }
        });
      }
    } else if (role === 'ADMIN') {
      inquiries = await prisma.inquiry.findMany({
        include: {
          product: { select: { name: true } },
          buyer: { select: { companyName: true } },
          supplier: { select: { companyName: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json({ inquiries });
  } catch (error) {
    console.error('Get Inquiries Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInquiryById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        product: true,
        buyer: true,
        supplier: true
      }
    });

    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    // Security check
    if (role === 'BUYER' && inquiry.buyer.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }
    if (role === 'SUPPLIER' && inquiry.supplier.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    res.json({ inquiry });
  } catch (error) {
    console.error('Get Inquiry By Id Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateInquiryStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!['PENDING', 'RESPONDED', 'CLOSED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const supplier = await prisma.supplierProfile.findUnique({
      where: { userId }
    });

    if (!supplier && req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Unauthorized to update inquiry' });
      return;
    }

    const inquiry = await prisma.inquiry.findUnique({ where: { id }, include: { buyer: true } });
    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    if (req.user?.role !== 'ADMIN' && inquiry.supplierId !== supplier?.id) {
      res.status(403).json({ error: 'Unauthorized to update inquiry' });
      return;
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status }
    });

    // Notify buyer
    await prisma.notification.create({
      data: {
        userId: inquiry.buyer.userId,
        type: 'INQUIRY_UPDATED',
        title: 'Inquiry Status Updated',
        message: `Your inquiry status has been updated to ${status}`
      }
    });

    res.json({ message: 'Inquiry updated successfully', inquiry: updated });
  } catch (error) {
    console.error('Update Inquiry Status Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
