'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import Link from 'next/link';
import { api } from '../../../lib/api';

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const res: any = await api.getInquiries('ADMIN');
        setInquiries(res?.inquiries || []);
      } catch (err) {
        console.error('Error fetching admin inquiries overview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const pendingReviewCount = inquiries.filter(i => i.status === 'PENDING_ADMIN_REVIEW').length;
  const pendingApprovalCount = inquiries.filter(i => ['PENDING_ADMIN_APPROVAL', 'SUPPLIER_RESPONDED'].includes(i.status)).length;

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-6)' }}>
        GarMer Central Admin Overview
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>RFQs Pending Initial Review</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: pendingReviewCount > 0 ? '#B45309' : 'var(--color-primary-navy)' }}>
              {loading ? '...' : pendingReviewCount}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Quotes Pending Admin Release</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: pendingApprovalCount > 0 ? '#1D4ED8' : 'var(--color-primary-navy)' }}>
              {loading ? '...' : pendingApprovalCount}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Total Platform RFQs</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
              {loading ? '...' : inquiries.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-6)' }}>
        <Card>
          <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Platform RFQ Pipeline</h2>
            <Link href="/dashboard/admin/inquiries">
              <Button variant="primary" size="sm">Manage RFQs & Release Quotes</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
                Loading platform RFQs...
              </div>
            ) : inquiries.length === 0 ? (
              <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
                No RFQs submitted on the platform yet.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-gray-200)', textAlign: 'left', color: 'var(--color-gray-500)' }}>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Buyer</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Product</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Supplier</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Quantity</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.slice(0, 5).map((inquiry: any) => (
                      <tr key={inquiry.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
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
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            backgroundColor: inquiry.status === 'PENDING_ADMIN_REVIEW' ? '#FEF3C7' : '#DBEAFE', 
                            color: inquiry.status === 'PENDING_ADMIN_REVIEW' ? '#B45309' : '#1D4ED8', 
                            borderRadius: '1rem', 
                            fontSize: '0.75rem', 
                            fontWeight: 600 
                          }}>
                            {inquiry.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
