'use client';
import React from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import Link from 'next/link';

export default function BuyerDashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-6)' }}>
        Buyer Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Active Inquiries</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>3</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Saved Products</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>12</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Unread Messages</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>1</div>
          </CardContent>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-6)' }}>
        <Card>
          <CardHeader>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Inquiries</h2>
          </CardHeader>
          <CardContent>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-gray-200)', textAlign: 'left', color: 'var(--color-gray-500)' }}>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Product</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Supplier</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Date</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Status</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Premium Cotton T-Shirt</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Global Garments Ltd</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Oct 12, 2024</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}><span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#FEF3C7', color: 'var(--color-warning)', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>PENDING</span></td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}><Link href="/dashboard/buyer/inquiries/1"><Button variant="ghost" size="sm">View</Button></Link></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: 'var(--spacing-4)', textAlign: 'center' }}>
              <Link href="/dashboard/buyer/inquiries">
                <Button variant="outline">View All Inquiries</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
