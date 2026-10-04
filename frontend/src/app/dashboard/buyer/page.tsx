'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import Link from 'next/link';
import { api } from '../../../lib/api';

export default function BuyerDashboard() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const res: any = await api.getInquiries('BUYER');
        setInquiries(res?.inquiries || []);
      } catch (error) {
        console.error('Error fetching buyer inquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const activeCount = inquiries.filter(i => ['PENDING_ADMIN_REVIEW', 'FORWARDED_TO_SUPPLIER', 'PENDING_ADMIN_APPROVAL', 'QUOTE_RELEASED_TO_BUYER'].includes(i.status)).length;
  const readyCount = inquiries.filter(i => i.status === 'QUOTE_RELEASED_TO_BUYER').length;

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-6)' }}>
        Buyer Overview
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Active RFQs</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
              {loading ? '...' : activeCount}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Quotes Ready for Review</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: readyCount > 0 ? '#1D4ED8' : 'var(--color-primary-navy)' }}>
              {loading ? '...' : readyCount}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Total Requests</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
              {loading ? '...' : inquiries.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-6)' }}>
        <Card>
          <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Quotation Requests</h2>
            <Link href="/dashboard/buyer/inquiries">
              <Button variant="outline" size="sm">Manage All RFQs & Quotes</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
                Loading inquiries...
              </div>
            ) : inquiries.length === 0 ? (
              <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
                <p style={{ marginBottom: 'var(--spacing-4)' }}>No RFQs submitted yet.</p>
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
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.slice(0, 5).map((inquiry: any) => (
                      <tr key={inquiry.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                        <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', fontWeight: 600 }}>
                          {inquiry.product?.name || 'Garment Product'}
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
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            backgroundColor: inquiry.status === 'QUOTE_RELEASED_TO_BUYER' ? '#DBEAFE' : '#FEF3C7', 
                            color: inquiry.status === 'QUOTE_RELEASED_TO_BUYER' ? '#1D4ED8' : '#B45309', 
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
