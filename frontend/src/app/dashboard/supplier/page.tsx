'use client';
import React from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import Link from 'next/link';

export default function SupplierDashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-6)' }}>
        Supplier Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>New Inquiries</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>5</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Active Products</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>24</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Profile Views (30d)</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>1,432</div>
          </CardContent>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-6)' }}>
        <Card>
          <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Inquiries</h2>
            <Link href="/dashboard/supplier/inquiries"><Button variant="ghost" size="sm">View All</Button></Link>
          </CardHeader>
          <CardContent>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-gray-200)', textAlign: 'left', color: 'var(--color-gray-500)' }}>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Buyer</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Product</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Date</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Status</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Acme Retail</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Premium Cotton T-Shirt</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Oct 12, 2024</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}><span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#FEF3C7', color: 'var(--color-warning)', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>NEW</span></td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}><Button variant="primary" size="sm">Respond</Button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
