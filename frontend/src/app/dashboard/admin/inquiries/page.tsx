'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../../components/ui/Card/Card';
import { Button } from '../../../../components/ui/Button/Button';
import { Input } from '../../../../components/ui/Input/Input';
import { api } from '../../../../lib/api';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');

  const [markupAmount, setMarkupAmount] = useState<string>('2.50');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inqRes, suppRes]: [any, any] = await Promise.all([
        api.getInquiries('ADMIN'),
        api.getSuppliers().catch(() => ({ suppliers: [] }))
      ]);
      setInquiries(inqRes?.inquiries || []);
      setSuppliers(suppRes?.suppliers || []);
    } catch (err) {
      console.error('Error fetching admin RFQ data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setSelectedSupplierId(inquiry.supplierId || '');
    setMarkupAmount('2.50');
    setAdminNotes('');
  };

  const handleForward = async () => {
    if (!selectedInquiry) return;
    try {
      setSubmitting(true);
      setMessage(null);
      await api.forwardInquiry(selectedInquiry.id, selectedSupplierId);
      setMessage('RFQ explicitly forwarded to supplier successfully.');
      await fetchData();
      setSelectedInquiry(null);
    } catch (err: any) {
      alert(err.message || 'Failed to forward RFQ to supplier');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectInquiry = async () => {
    if (!selectedInquiry) return;
    try {
      setSubmitting(true);
      setMessage(null);
      await api.rejectInquiryByAdmin(selectedInquiry.id);
      setMessage('RFQ declined by admin.');
      await fetchData();
      setSelectedInquiry(null);
    } catch (err: any) {
      alert(err.message || 'Failed to reject RFQ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveAndRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    try {
      setSubmitting(true);
      setMessage(null);
      await api.approveAndReleaseQuotation(selectedInquiry.id, {
        markupAmount: parseFloat(markupAmount || '0'),
        adminNotes
      });
      setMessage('Quotation approved and released to buyer!');
      await fetchData();
      setSelectedInquiry(null);
    } catch (err: any) {
      alert(err.message || 'Failed to approve and release quotation');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    let bg = '#FEF3C7';
    let text = '#B45309';

    if (status === 'PENDING_ADMIN_REVIEW') {
      bg = '#FEF3C7';
      text = '#B45309';
    } else if (status === 'FORWARDED_TO_SUPPLIER') {
      bg = '#F3E8FF';
      text = '#6B21A8';
    } else if (status === 'PENDING_ADMIN_APPROVAL' || status === 'SUPPLIER_RESPONDED') {
      bg = '#DBEAFE';
      text = '#1D4ED8';
    } else if (status === 'QUOTE_RELEASED_TO_BUYER') {
      bg = '#E0F2FE';
      text = '#0369A1';
    } else if (status === 'BUYER_ACCEPTED') {
      bg = '#D1FAE5';
      text = '#047857';
    } else if (status === 'REJECTED_BY_ADMIN' || status === 'BUYER_REJECTED') {
      bg = '#FEE2E2';
      text = '#B91C1C';
    }

    return (
      <span style={{ padding: '0.25rem 0.6rem', backgroundColor: bg, color: text, borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const calcFinalUnitPrice = () => {
    if (!selectedInquiry?.quotation?.unitPrice) return 0;
    const base = selectedInquiry.quotation.unitPrice;
    const markup = parseFloat(markupAmount || '0');
    return Math.round((base + markup) * 100) / 100;
  };

  const calcFinalTotal = () => {
    if (!selectedInquiry?.quotation) return 0;
    const unitP = calcFinalUnitPrice();
    const qty = selectedInquiry.quantity || 1;
    const ship = selectedInquiry.quotation.shippingCost || 0;
    return Math.round(((unitP * qty) + ship) * 100) / 100;
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-6)' }}>
        Central Admin RFQ & Quotation Management
      </h1>

      {message && (
        <div style={{ padding: 'var(--spacing-4)', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-6)' }}>
          {message}
        </div>
      )}

      <Card>
        <CardContent>
          {loading ? (
            <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-gray-500)' }}>Loading all platform RFQs...</div>
          ) : inquiries.length === 0 ? (
            <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
              No RFQs submitted on the platform yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-gray-200)', textAlign: 'left', color: 'var(--color-gray-500)' }}>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>RFQ ID</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Buyer Company</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Product</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Supplier</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Quantity</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Status</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry: any) => (
                    <tr key={inquiry.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {inquiry.id.slice(0, 8)}...
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', fontWeight: 600 }}>
                        {inquiry.buyer?.companyName || 'Buyer'}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {inquiry.product?.name || 'Garment Item'}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {inquiry.supplier?.companyName || 'Supplier'}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {inquiry.quantity} pcs
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {getStatusBadge(inquiry.status)}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        <Button 
                          variant={['PENDING_ADMIN_REVIEW', 'PENDING_ADMIN_APPROVAL', 'SUPPLIER_RESPONDED'].includes(inquiry.status) ? 'primary' : 'outline'} 
                          size="sm"
                          onClick={() => openModal(inquiry)}
                        >
                          Manage RFQ
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

      {/* Admin RFQ Mediation Modal */}
      {selectedInquiry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ backgroundColor: 'white', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', maxWidth: '700px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--spacing-4)', color: 'var(--color-primary-navy)' }}>
              Admin Mediation — RFQ #{selectedInquiry.id.slice(0, 8)}
            </h2>

            <div style={{ padding: 'var(--spacing-4)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-6)', fontSize: '0.95rem' }}>
              <div><strong>Buyer:</strong> {selectedInquiry.buyer?.companyName} ({selectedInquiry.buyer?.contactName})</div>
              <div><strong>Product Requested:</strong> {selectedInquiry.product?.name}</div>
              <div><strong>Quantity Requested:</strong> {selectedInquiry.quantity} pcs</div>
              <div><strong>Destination:</strong> {selectedInquiry.country}</div>
              <div><strong>Buyer Message:</strong> {selectedInquiry.message}</div>
              <div><strong>Current Status:</strong> {getStatusBadge(selectedInquiry.status)}</div>
            </div>

            {/* STAGE 1: PENDING ADMIN REVIEW -> SELECT SUPPLIER & FORWARD */}
            {selectedInquiry.status === 'PENDING_ADMIN_REVIEW' && (
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--spacing-3)' }}>
                  Stage 1: Review & Select Supplier to Forward RFQ
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-gray-700)' }}>
                    Explicit Supplier Selection:
                  </label>
                  <select 
                    value={selectedSupplierId} 
                    onChange={e => setSelectedSupplierId(e.target.value)}
                    style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', fontFamily: 'inherit' }}
                  >
                    <option value="">-- Select Target Supplier --</option>
                    {suppliers.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.companyName} ({s.location})
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'flex-end' }}>
                  <Button variant="outline" disabled={submitting} onClick={handleRejectInquiry}>
                    Decline RFQ
                  </Button>
                  <Button variant="primary" disabled={submitting || !selectedSupplierId} onClick={handleForward}>
                    {submitting ? 'Forwarding...' : 'Forward RFQ to Selected Supplier'}
                  </Button>
                </div>
              </div>
            )}

            {/* STAGE 2: SUPPLIER RESPONDED / PENDING ADMIN APPROVAL -> MARKUP & RELEASE */}
            {['PENDING_ADMIN_APPROVAL', 'SUPPLIER_RESPONDED'].includes(selectedInquiry.status) && selectedInquiry.quotation && (
              <form onSubmit={handleApproveAndRelease} style={{ borderTop: '1px solid #E2E8F0', paddingTop: 'var(--spacing-4)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--spacing-3)', color: 'var(--color-primary-navy)' }}>
                  Stage 2: Review Supplier Quotation & Set Platform Markup
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', padding: 'var(--spacing-4)', backgroundColor: '#EFF6FF', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)', fontSize: '0.9rem' }}>
                  <div><strong>Supplier Raw Unit Price:</strong> ${selectedInquiry.quotation.unitPrice?.toFixed(2)}</div>
                  <div><strong>Shipping Cost:</strong> ${selectedInquiry.quotation.shippingCost?.toFixed(2)}</div>
                  <div><strong>Delivery Timeline:</strong> {selectedInquiry.quotation.deliveryTimeline}</div>
                  <div><strong>Payment Terms:</strong> {selectedInquiry.quotation.paymentTerms}</div>
                  {selectedInquiry.quotation.supplierNotes && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <strong>Supplier Notes:</strong> {selectedInquiry.quotation.supplierNotes}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
                  <Input 
                    label="Platform Markup / Commission ($ / pc)" 
                    type="number" 
                    step="0.01" 
                    required 
                    value={markupAmount} 
                    onChange={e => setMarkupAmount(e.target.value)} 
                    placeholder="e.g. 2.50" 
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)' }}>Calculated Final Unit Price:</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
                      ${calcFinalUnitPrice().toFixed(2)} / pc
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', marginTop: '0.25rem' }}>
                      Calculated Final Total: <strong>${calcFinalTotal().toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-4)' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-gray-700)' }}>
                    Admin Notes to Buyer (Optional)
                  </label>
                  <textarea 
                    rows={3} 
                    value={adminNotes} 
                    onChange={e => setAdminNotes(e.target.value)} 
                    placeholder="Provide buyer instructions, inspection confirmation, or delivery terms..." 
                    style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-4)' }}>
                  <Button type="button" variant="ghost" onClick={() => setSelectedInquiry(null)}>Cancel</Button>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Releasing...' : 'Approve & Release Quotation to Buyer'}
                  </Button>
                </div>
              </form>
            )}

            {/* STAGE 3: QUOTE RELEASED OR FINALIZED */}
            {['QUOTE_RELEASED_TO_BUYER', 'BUYER_ACCEPTED', 'BUYER_REJECTED', 'REJECTED_BY_ADMIN'].includes(selectedInquiry.status) && (
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 'var(--spacing-4)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--spacing-3)' }}>Quotation Status Summary</h3>
                {selectedInquiry.quotation && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem' }}>
                    <div><strong>Final Unit Price:</strong> ${selectedInquiry.quotation.finalUnitPrice?.toFixed(2)}</div>
                    <div><strong>Shipping Cost:</strong> ${selectedInquiry.quotation.shippingCost?.toFixed(2)}</div>
                    <div><strong>Final Total:</strong> ${selectedInquiry.quotation.finalTotalPrice?.toFixed(2)}</div>
                    <div><strong>Markup Amount:</strong> ${selectedInquiry.quotation.markupAmount?.toFixed(2)}</div>
                  </div>
                )}
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
