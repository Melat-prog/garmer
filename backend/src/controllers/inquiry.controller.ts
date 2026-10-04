import { Response } from 'express';
import { prisma } from '../models/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

const sanitizeInquiry = (inquiry: any, role?: string) => {
  if (!inquiry) return null;
  const item = JSON.parse(JSON.stringify(inquiry));

  if (role === 'BUYER') {
    const isReleased = ['QUOTE_RELEASED_TO_BUYER', 'BUYER_ACCEPTED', 'BUYER_REJECTED', 'COMPLETED'].includes(item.status);
    if (!isReleased || !item.quotation) {
      delete item.quotation;
    } else {
      item.quotation = {
        unitPrice: item.quotation.finalUnitPrice,
        shippingCost: item.quotation.shippingCost,
        totalPrice: item.quotation.finalTotalPrice,
        deliveryTimeline: item.quotation.deliveryTimeline,
        paymentTerms: item.quotation.paymentTerms,
        adminNotes: item.quotation.adminNotes,
        releasedAt: item.quotation.releasedAt,
      };
    }
  } else if (role === 'SUPPLIER') {
    if (item.quotation) {
      item.quotation = {
        unitPrice: item.quotation.unitPrice,
        shippingCost: item.quotation.shippingCost,
        deliveryTimeline: item.quotation.deliveryTimeline,
        paymentTerms: item.quotation.paymentTerms,
        supplierNotes: item.quotation.supplierNotes,
        submittedAt: item.quotation.submittedAt,
      };
    }
  }
  return item;
};

// 1. Buyer creates RFQ
export const createInquiry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId, quantity, country, message } = req.body;

    if (!productId || !quantity || !country || !message) {
      res.status(400).json({ error: 'Missing required fields: productId, quantity, country, message' });
      return;
    }

    const buyer = await prisma.buyerProfile.findUnique({
      where: { userId }
    });

    if (!buyer) {
      res.status(403).json({ error: 'Only registered buyers can submit quotation requests' });
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
        quantity: parseInt(quantity, 10),
        country,
        message,
        status: 'PENDING_ADMIN_REVIEW'
      },
      include: {
        product: { select: { name: true, images: { take: 1 } } },
        buyer: { select: { companyName: true } },
        supplier: { select: { companyName: true } }
      }
    });

    res.status(201).json({
      message: 'Quotation request submitted to GarMer Admin for review',
      inquiry: sanitizeInquiry(inquiry, req.user?.role)
    });
  } catch (error) {
    console.error('Create Inquiry Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 2. Get Inquiries (Role Scoped)
export const getInquiries = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let inquiries: any[] = [];

    if (role === 'BUYER') {
      const buyer = await prisma.buyerProfile.findUnique({ where: { userId } });
      if (buyer) {
        inquiries = await prisma.inquiry.findMany({
          where: { buyerId: buyer.id },
          include: {
            product: { select: { id: true, name: true, images: { take: 1 } } },
            supplier: { select: { id: true, companyName: true } },
            quotation: true
          },
          orderBy: { createdAt: 'desc' }
        });
      }
    } else if (role === 'SUPPLIER') {
      const supplier = await prisma.supplierProfile.findUnique({ where: { userId } });
      if (supplier) {
        inquiries = await prisma.inquiry.findMany({
          where: {
            supplierId: supplier.id,
            status: {
              in: [
                'FORWARDED_TO_SUPPLIER',
                'SUPPLIER_RESPONDED',
                'PENDING_ADMIN_APPROVAL',
                'QUOTE_RELEASED_TO_BUYER',
                'BUYER_ACCEPTED',
                'BUYER_REJECTED',
                'COMPLETED'
              ]
            }
          },
          include: {
            product: { select: { id: true, name: true, images: { take: 1 } } },
            buyer: { select: { id: true, companyName: true, contactName: true } },
            quotation: true
          },
          orderBy: { createdAt: 'desc' }
        });
      }
    } else if (role === 'ADMIN') {
      inquiries = await prisma.inquiry.findMany({
        include: {
          product: { select: { id: true, name: true, images: { take: 1 } } },
          buyer: { select: { id: true, companyName: true, contactName: true } },
          supplier: { select: { id: true, companyName: true } },
          quotation: true
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    const sanitized = inquiries.map(i => sanitizeInquiry(i, role));
    res.json({ inquiries: sanitized });
  } catch (error) {
    console.error('Get Inquiries Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 3. Get Single Inquiry
export const getInquiryById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;
    const role = req.user?.role;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, name: true, description: true, images: { take: 1 } } },
        buyer: true,
        supplier: true,
        quotation: true
      }
    });

    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    if (role === 'BUYER' && inquiry.buyer.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized access to this RFQ' });
      return;
    }
    if (role === 'SUPPLIER' && inquiry.supplier.userId !== userId) {
      res.status(403).json({ error: 'Unauthorized access to this RFQ' });
      return;
    }

    res.json({ inquiry: sanitizeInquiry(inquiry, role) });
  } catch (error) {
    console.error('Get Inquiry By Id Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 4. Admin forwards RFQ to explicit Supplier
export const forwardInquiryToSupplier = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { supplierId } = req.body;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: { product: true }
    });

    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    if (inquiry.status !== 'PENDING_ADMIN_REVIEW') {
      res.status(400).json({ error: `Cannot forward inquiry with status ${inquiry.status}` });
      return;
    }

    const targetSupplierId = supplierId || inquiry.supplierId;
    const targetSupplier = await prisma.supplierProfile.findUnique({
      where: { id: targetSupplierId },
      include: { user: true }
    });

    if (!targetSupplier) {
      res.status(400).json({ error: 'Invalid supplier specified for forwarding' });
      return;
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: {
        supplierId: targetSupplierId,
        status: 'FORWARDED_TO_SUPPLIER'
      },
      include: {
        product: { select: { name: true } },
        supplier: { select: { companyName: true } }
      }
    });

    // Notify supplier
    await prisma.notification.create({
      data: {
        userId: targetSupplier.userId,
        type: 'NEW_INQUIRY',
        title: 'New RFQ Forwarded by GarMer Admin',
        message: `GarMer Admin forwarded an RFQ for ${inquiry.product.name} to your company.`
      }
    });

    res.json({ message: 'RFQ forwarded to supplier successfully', inquiry: sanitizeInquiry(updated, 'ADMIN') });
  } catch (error) {
    console.error('Forward Inquiry Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 5. Admin rejects RFQ
export const rejectInquiryByAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: { buyer: true }
    });

    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status: 'REJECTED_BY_ADMIN' }
    });

    await prisma.notification.create({
      data: {
        userId: inquiry.buyer.userId,
        type: 'INQUIRY_UPDATED',
        title: 'Quotation Request Update',
        message: 'Your RFQ was reviewed and declined by GarMer Admin.'
      }
    });

    res.json({ message: 'RFQ rejected by admin', inquiry: sanitizeInquiry(updated, 'ADMIN') });
  } catch (error) {
    console.error('Admin Reject Inquiry Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 6. Supplier submits Quotation
export const submitSupplierQuotation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;
    const { unitPrice, shippingCost, deliveryTimeline, paymentTerms, supplierNotes } = req.body;

    if (!unitPrice || shippingCost === undefined || !deliveryTimeline || !paymentTerms) {
      res.status(400).json({ error: 'Missing required fields: unitPrice, shippingCost, deliveryTimeline, paymentTerms' });
      return;
    }

    const supplier = await prisma.supplierProfile.findUnique({
      where: { userId }
    });

    if (!supplier) {
      res.status(403).json({ error: 'Only suppliers can submit quotations' });
      return;
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: { quotation: true }
    });

    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    if (inquiry.supplierId !== supplier.id) {
      res.status(403).json({ error: 'This RFQ is not assigned to your supplier profile' });
      return;
    }

    if (inquiry.status !== 'FORWARDED_TO_SUPPLIER') {
      res.status(400).json({ error: `Cannot submit quotation when status is ${inquiry.status}` });
      return;
    }

    const parsedUnitPrice = parseFloat(unitPrice);
    const parsedShipping = parseFloat(shippingCost);

    await prisma.quotation.upsert({
      where: { inquiryId: id },
      create: {
        inquiryId: id,
        supplierId: supplier.id,
        unitPrice: parsedUnitPrice,
        shippingCost: parsedShipping,
        deliveryTimeline,
        paymentTerms,
        supplierNotes: supplierNotes || null
      },
      update: {
        unitPrice: parsedUnitPrice,
        shippingCost: parsedShipping,
        deliveryTimeline,
        paymentTerms,
        supplierNotes: supplierNotes || null,
        submittedAt: new Date()
      }
    });

    // Update status to PENDING_ADMIN_APPROVAL
    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { status: 'PENDING_ADMIN_APPROVAL' },
      include: {
        product: true,
        buyer: true,
        supplier: true,
        quotation: true
      }
    });

    res.json({
      message: 'Quotation submitted successfully to GarMer Admin for approval',
      inquiry: sanitizeInquiry(updatedInquiry, 'SUPPLIER')
    });
  } catch (error) {
    console.error('Submit Supplier Quotation Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 7. Admin approves & releases Quotation with markup calculation
export const approveAndReleaseQuotation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { markupAmount, adminNotes } = req.body;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: { quotation: true, buyer: true }
    });

    if (!inquiry || !inquiry.quotation) {
      res.status(404).json({ error: 'Inquiry or supplier quotation not found' });
      return;
    }

    if (!['SUPPLIER_RESPONDED', 'PENDING_ADMIN_APPROVAL'].includes(inquiry.status)) {
      res.status(400).json({ error: `Cannot release quotation with status ${inquiry.status}` });
      return;
    }

    const markup = parseFloat(markupAmount || 0);
    const finalUnitPrice = Math.round((inquiry.quotation.unitPrice + markup) * 100) / 100;
    const finalTotalPrice = Math.round(((finalUnitPrice * inquiry.quantity) + inquiry.quotation.shippingCost) * 100) / 100;

    await prisma.quotation.update({
      where: { inquiryId: id },
      data: {
        markupAmount: markup,
        finalUnitPrice,
        finalTotalPrice,
        adminNotes: adminNotes || null,
        approvedAt: new Date(),
        releasedAt: new Date()
      }
    });

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { status: 'QUOTE_RELEASED_TO_BUYER' },
      include: {
        product: true,
        buyer: true,
        supplier: true,
        quotation: true
      }
    });

    // Notify buyer
    await prisma.notification.create({
      data: {
        userId: inquiry.buyer.userId,
        type: 'INQUIRY_UPDATED',
        title: 'Quotation Released',
        message: `GarMer Admin has released your quotation for ${updatedInquiry.product.name}.`
      }
    });

    res.json({
      message: 'Quotation approved and released to buyer',
      inquiry: sanitizeInquiry(updatedInquiry, 'ADMIN')
    });
  } catch (error) {
    console.error('Approve and Release Quotation Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 8. Buyer Accepts Quotation
export const acceptQuotation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const buyer = await prisma.buyerProfile.findUnique({ where: { userId } });
    const inquiry = await prisma.inquiry.findUnique({ where: { id } });

    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    if (!buyer || inquiry.buyerId !== buyer.id) {
      res.status(403).json({ error: 'Unauthorized to respond to this quotation' });
      return;
    }

    if (inquiry.status !== 'QUOTE_RELEASED_TO_BUYER') {
      res.status(400).json({ error: `Cannot accept quotation in state ${inquiry.status}` });
      return;
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { status: 'BUYER_ACCEPTED' },
      include: { product: true, supplier: true, quotation: true }
    });

    res.json({
      message: 'Quotation accepted. The inquiry is moved to order preparation.',
      inquiry: sanitizeInquiry(updatedInquiry, 'BUYER')
    });
  } catch (error) {
    console.error('Accept Quotation Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 9. Buyer Rejects Quotation
export const rejectQuotation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    const buyer = await prisma.buyerProfile.findUnique({ where: { userId } });
    const inquiry = await prisma.inquiry.findUnique({ where: { id } });

    if (!inquiry) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }

    if (!buyer || inquiry.buyerId !== buyer.id) {
      res.status(403).json({ error: 'Unauthorized to respond to this quotation' });
      return;
    }

    if (inquiry.status !== 'QUOTE_RELEASED_TO_BUYER') {
      res.status(400).json({ error: `Cannot reject quotation in state ${inquiry.status}` });
      return;
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { status: 'BUYER_REJECTED' },
      include: { product: true, supplier: true, quotation: true }
    });

    res.json({
      message: 'Quotation rejected.',
      inquiry: sanitizeInquiry(updatedInquiry, 'BUYER')
    });
  } catch (error) {
    console.error('Reject Quotation Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
