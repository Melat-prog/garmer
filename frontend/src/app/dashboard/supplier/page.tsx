'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import Link from 'next/link';
import { api } from '../../../lib/api';

export default function SupplierDashboard() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const res: any = await api.getInquiries('SUPPLIER');
        setInquiries(res?.inquiries || []);
      } catch (error) {
        console.error('Error fetching supplier inquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const actionRequiredCount = inquiries.filter(i => i.status === 'FORWARDED_TO_SUPPLIER').length;

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-6)' }}>
        Supplier Overview
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Quotes Pending Action</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: actionRequiredCount > 0 ? '#B45309' : 'var(--color-primary-navy)' }}>
              {loading ? '...' : actionRequiredCount}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Total Forwarded RFQs</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
              {loading ? '...' : inquiries.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Accepted Orders</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
              {loading ? '...' : inquiries.filter(i => i.status === 'BUYER_ACCEPTED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-6)' }}>
        <Card>
          <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Forwarded Quotation Requests</h2>
            <Link href="/dashboard/supplier/inquiries">
              <Button variant="outline" size="sm">Manage Forwarded RFQs</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
                Loading inquiries...
              </div>
            ) : inquiries.length === 0 ? (
              <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
                <p style={{ marginBottom: 'var(--spacing-4)' }}>No quotation requests received yet.</p>
                <Link href="/products">
                  <Button variant="primary" size="sm">View Marketplace Products</Button>
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-gray-200)', textAlign: 'left', color: 'var(--color-gray-500)' }}>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Buyer Company</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Product</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Quantity</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Date</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.slice(0, 5).map((inquiry: any) => (
                      <tr key={inquiry.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                        <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', fontWeight: 600 }}>
                          {inquiry.buyer?.companyName || 'Buyer Company'}
                        </td>
                        <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                          {inquiry.product?.name || 'Garment Product'}
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
                            backgroundColor: inquiry.status === 'FORWARDED_TO_SUPPLIER' ? '#FEF3C7' : '#D1FAE5', 
                            color: inquiry.status === 'FORWARDED_TO_SUPPLIER' ? '#B45309' : '#065F46', 
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
