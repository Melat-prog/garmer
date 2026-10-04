'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../../components/ui/Card/Card';
import { Button } from '../../../../components/ui/Button/Button';
import { Input } from '../../../../components/ui/Input/Input';
import { api } from '../../../../lib/api';

export default function SupplierInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  const [quoteForm, setQuoteForm] = useState({
    unitPrice: '',
    shippingCost: '',
    deliveryTimeline: '',
    paymentTerms: '',
    supplierNotes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res: any = await api.getInquiries('SUPPLIER');
      setInquiries(res?.inquiries || []);
    } catch (err) {
      console.error('Error fetching supplier RFQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const openQuotationModal = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    if (inquiry.quotation) {
      setQuoteForm({
        unitPrice: inquiry.quotation.unitPrice ? String(inquiry.quotation.unitPrice) : '',
        shippingCost: inquiry.quotation.shippingCost !== undefined ? String(inquiry.quotation.shippingCost) : '',
        deliveryTimeline: inquiry.quotation.deliveryTimeline || '',
        paymentTerms: inquiry.quotation.paymentTerms || '',
        supplierNotes: inquiry.quotation.supplierNotes || ''
      });
    } else {
      setQuoteForm({ unitPrice: '', shippingCost: '', deliveryTimeline: '', paymentTerms: '', supplierNotes: '' });
    }
  };

  const handleQuotationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    try {
      setSubmitting(true);
      setMessage(null);
      await api.submitSupplierQuotation(selectedInquiry.id, {
        unitPrice: parseFloat(quoteForm.unitPrice),
        shippingCost: parseFloat(quoteForm.shippingCost),
        deliveryTimeline: quoteForm.deliveryTimeline,
        paymentTerms: quoteForm.paymentTerms,
        supplierNotes: quoteForm.supplierNotes
      });
      setMessage('Quotation successfully submitted to GarMer Admin for review.');
      await fetchInquiries();
      setSelectedInquiry(null);
    } catch (err: any) {
      alert(err.message || 'Failed to submit quotation');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    let bg = '#FEF3C7';
    let text = '#B45309';
    let label = status.replace(/_/g, ' ');

    if (status === 'FORWARDED_TO_SUPPLIER') {
      bg = '#FEF3C7';
      text = '#B45309';
      label = 'ACTION REQUIRED: SUBMIT QUOTE';
    } else if (status === 'PENDING_ADMIN_APPROVAL' || status === 'SUPPLIER_RESPONDED') {
      bg = '#DBEAFE';
      text = '#1D4ED8';
      label = 'SUBMITTED (ADMIN REVIEW)';
    } else if (status === 'QUOTE_RELEASED_TO_BUYER') {
      bg = '#F3E8FF';
      text = '#6B21A8';
      label = 'RELEASED TO BUYER';
    } else if (status === 'BUYER_ACCEPTED') {
      bg = '#D1FAE5';
      text = '#047857';
      label = 'BUYER ACCEPTED';
    }

    return (
      <span style={{ padding: '0.25rem 0.6rem', backgroundColor: bg, color: text, borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
        {label}
      </span>
    );
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-6)' }}>
        Forwarded Quotation Requests (RFQs)
      </h1>

      {message && (
        <div style={{ padding: 'var(--spacing-4)', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-6)' }}>
          {message}
        </div>
      )}

      <Card>
        <CardContent>
          {loading ? (
            <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-gray-500)' }}>Loading RFQs...</div>
          ) : inquiries.length === 0 ? (
            <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
              No RFQs have been forwarded to your supplier profile yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-gray-200)', textAlign: 'left', color: 'var(--color-gray-500)' }}>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Product</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Buyer Company</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Quantity</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Destination</th>
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
                        {inquiry.buyer?.companyName || 'Verified Buyer'}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {inquiry.quantity} pcs
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {inquiry.country}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {getStatusBadge(inquiry.status)}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        <Button 
                          variant={inquiry.status === 'FORWARDED_TO_SUPPLIER' ? 'primary' : 'outline'} 
                          size="sm"
                          onClick={() => openQuotationModal(inquiry)}
                        >
                          {inquiry.status === 'FORWARDED_TO_SUPPLIER' ? 'Prepare Quote' : 'View Quote'}
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

      {/* Supplier Quotation Preparation Modal */}
      {selectedInquiry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ backgroundColor: 'white', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', maxWidth: '650px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--spacing-4)', color: 'var(--color-primary-navy)' }}>
              Supplier Quotation Submission
            </h2>

            <div style={{ padding: 'var(--spacing-4)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-6)' }}>
              <div><strong>Product:</strong> {selectedInquiry.product?.name}</div>
              <div><strong>Quantity:</strong> {selectedInquiry.quantity} pcs</div>
              <div><strong>Destination:</strong> {selectedInquiry.country}</div>
              <div><strong>Buyer Requirements:</strong> {selectedInquiry.message}</div>
            </div>

            {selectedInquiry.status === 'FORWARDED_TO_SUPPLIER' ? (
              <form onSubmit={handleQuotationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                  <Input 
                    label="Unit Price ($ / pc)" 
                    type="number" 
                    step="0.01" 
                    required 
                    value={quoteForm.unitPrice} 
                    onChange={e => setQuoteForm({...quoteForm, unitPrice: e.target.value})} 
                    placeholder="e.g. 15.00" 
                  />
                  <Input 
                    label="Estimated Shipping Cost ($)" 
                    type="number" 
                    step="0.01" 
                    required 
                    value={quoteForm.shippingCost} 
                    onChange={e => setQuoteForm({...quoteForm, shippingCost: e.target.value})} 
                    placeholder="e.g. 500.00" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                  <Input 
                    label="Delivery Timeline" 
                    required 
                    value={quoteForm.deliveryTimeline} 
                    onChange={e => setQuoteForm({...quoteForm, deliveryTimeline: e.target.value})} 
                    placeholder="e.g. 14-21 Business Days" 
                  />
                  <Input 
                    label="Payment Terms" 
                    required 
                    value={quoteForm.paymentTerms} 
                    onChange={e => setQuoteForm({...quoteForm, paymentTerms: e.target.value})} 
                    placeholder="e.g. 30% advance, 70% before shipment" 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-gray-700)' }}>
                    Supplier Notes (Optional)
                  </label>
                  <textarea 
                    rows={3} 
                    value={quoteForm.supplierNotes} 
                    onChange={e => setQuoteForm({...quoteForm, supplierNotes: e.target.value})} 
                    placeholder="Provide details about packaging, fabric composition, sample availability..." 
                    style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
                  <Button type="button" variant="ghost" onClick={() => setSelectedInquiry(null)}>Cancel</Button>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Quotation to GarMer Admin'}
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 'var(--spacing-2)' }}>Submitted Quotation Details</h3>
                {selectedInquiry.quotation ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                    <div><strong>Unit Price:</strong> ${selectedInquiry.quotation.unitPrice?.toFixed(2)}</div>
                    <div><strong>Shipping Cost:</strong> ${selectedInquiry.quotation.shippingCost?.toFixed(2)}</div>
                    <div><strong>Delivery Timeline:</strong> {selectedInquiry.quotation.deliveryTimeline}</div>
                    <div><strong>Payment Terms:</strong> {selectedInquiry.quotation.paymentTerms}</div>
                    {selectedInquiry.quotation.supplierNotes && <div><strong>Notes:</strong> {selectedInquiry.quotation.supplierNotes}</div>}
                  </div>
                ) : null}
                <div style={{ marginTop: 'var(--spacing-6)', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="ghost" onClick={() => setSelectedInquiry(null)}>Close</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
