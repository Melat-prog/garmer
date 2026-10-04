'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../../components/ui/Card/Card';
import { Button } from '../../../../components/ui/Button/Button';
import Link from 'next/link';
import { api } from '../../../../lib/api';

export default function BuyerInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res: any = await api.getInquiries('BUYER');
      setInquiries(res?.inquiries || []);
    } catch (err) {
      console.error('Error fetching buyer RFQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      setActionLoading(true);
      setActionMessage(null);
      await api.acceptQuotation(id);
      setActionMessage('Quotation accepted successfully! Request is now prepared for order processing.');
      await fetchInquiries();
      setSelectedInquiry(null);
    } catch (err: any) {
      alert(err.message || 'Failed to accept quotation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(true);
      setActionMessage(null);
      await api.rejectQuotation(id);
      setActionMessage('Quotation rejected.');
      await fetchInquiries();
      setSelectedInquiry(null);
    } catch (err: any) {
      alert(err.message || 'Failed to reject quotation');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    let bg = '#FEF3C7';
    let text = '#B45309';
    let label = status.replace(/_/g, ' ');

    if (status === 'QUOTE_RELEASED_TO_BUYER') {
      bg = '#DBEAFE';
      text = '#1D4ED8';
      label = 'QUOTE READY FOR REVIEW';
    } else if (status === 'BUYER_ACCEPTED') {
      bg = '#D1FAE5';
      text = '#047857';
      label = 'ACCEPTED';
    } else if (status === 'BUYER_REJECTED' || status === 'REJECTED_BY_ADMIN') {
      bg = '#FEE2E2';
      text = '#B91C1C';
    } else if (status === 'FORWARDED_TO_SUPPLIER' || status === 'PENDING_ADMIN_APPROVAL') {
      bg = '#F3E8FF';
      text = '#6B21A8';
      label = 'IN PROVIDER REVIEW';
    }

    return (
      <span style={{ padding: '0.25rem 0.6rem', backgroundColor: bg, color: text, borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
        {label}
      </span>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)' }}>
          My Quotation Requests (RFQs)
        </h1>
        <Link href="/products">
          <Button variant="primary" size="sm">+ New Request</Button>
        </Link>
      </div>

      {actionMessage && (
        <div style={{ padding: 'var(--spacing-4)', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-6)' }}>
          {actionMessage}
        </div>
      )}

      <Card>
        <CardContent>
          {loading ? (
            <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-gray-500)' }}>Loading RFQs...</div>
          ) : inquiries.length === 0 ? (
            <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
              <p style={{ marginBottom: 'var(--spacing-4)' }}>You haven't requested any quotations yet.</p>
              <Link href="/products">
                <Button variant="primary" size="sm">Explore Products & Request Quotation</Button>
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-gray-200)', textAlign: 'left', color: 'var(--color-gray-500)' }}>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Product</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Supplier</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Quantity</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Date</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Status</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry: any) => (
                    <tr key={inquiry.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', fontWeight: 600 }}>
                        {inquiry.product?.name || 'Garment Item'}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {inquiry.supplier?.companyName || 'Supplier'}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {inquiry.quantity} pcs
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {getStatusBadge(inquiry.status)}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        <Button 
                          variant={inquiry.status === 'QUOTE_RELEASED_TO_BUYER' ? 'primary' : 'outline'} 
                          size="sm"
                          onClick={() => setSelectedInquiry(inquiry)}
                        >
                          {inquiry.status === 'QUOTE_RELEASED_TO_BUYER' ? 'Review Quote' : 'View Details'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal / Drawer for RFQ & Quotation Details */}
      {selectedInquiry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ backgroundColor: 'white', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--spacing-4)', color: 'var(--color-primary-navy)' }}>
              RFQ Details — {selectedInquiry.product?.name}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-6)' }}>
              <div><strong>Status:</strong> {getStatusBadge(selectedInquiry.status)}</div>
              <div><strong>Quantity Requested:</strong> {selectedInquiry.quantity} pcs</div>
              <div><strong>Destination:</strong> {selectedInquiry.country}</div>
              <div><strong>Requirements / Message:</strong> {selectedInquiry.message}</div>
            </div>

            {/* Official Released Quotation Section */}
            {selectedInquiry.quotation ? (
              <div style={{ padding: 'var(--spacing-4)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', marginBottom: 'var(--spacing-6)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-navy)', marginBottom: 'var(--spacing-3)' }}>
                  GarMer Official Quotation
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', fontSize: '0.95rem' }}>
                  <div><strong>Unit Price:</strong> ${selectedInquiry.quotation.unitPrice?.toFixed(2)}</div>
                  <div><strong>Shipping Cost:</strong> ${selectedInquiry.quotation.shippingCost?.toFixed(2)}</div>
                  <div style={{ gridColumn: 'span 2', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-navy)' }}>
                    Total Cost: ${selectedInquiry.quotation.totalPrice?.toFixed(2)}
                  </div>
                  <div><strong>Delivery Timeline:</strong> {selectedInquiry.quotation.deliveryTimeline}</div>
                  <div><strong>Payment Terms:</strong> {selectedInquiry.quotation.paymentTerms}</div>
                  {selectedInquiry.quotation.adminNotes && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <strong>GarMer Notes:</strong> {selectedInquiry.quotation.adminNotes}
                    </div>
                  )}
                </div>

                {selectedInquiry.status === 'QUOTE_RELEASED_TO_BUYER' && (
                  <div style={{ marginTop: 'var(--spacing-6)', display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outline" 
                      disabled={actionLoading} 
                      onClick={() => handleReject(selectedInquiry.id)}
                    >
                      Reject Quotation
                    </Button>
                    <Button 
                      variant="primary" 
                      disabled={actionLoading} 
                      onClick={() => handleAccept(selectedInquiry.id)}
                    >
                      Accept Quotation
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: 'var(--spacing-4)', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-6)' }}>
                Your quotation request is currently being reviewed by GarMer Admin and suppliers. Formal quotation details will appear here once released.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setSelectedInquiry(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
