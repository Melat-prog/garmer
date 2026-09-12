'use client';
import React from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-6)' }}>
        Admin Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Total Suppliers</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>145</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Total Buyers</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>892</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>Pending Verifications</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning)' }}>12</div>
          </CardContent>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-6)' }}>
        <Card>
          <CardHeader>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Suppliers Pending Verification</h2>
          </CardHeader>
          <CardContent>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-gray-200)', textAlign: 'left', color: 'var(--color-gray-500)' }}>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Company Name</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Location</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Registered Date</th>
                    <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>New Garments Co.</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Addis Ababa, Ethiopia</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Oct 15, 2024</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', display: 'flex', gap: '0.5rem' }}>
                      <Button variant="primary" size="sm">Approve</Button>
                      <Button variant="outline" size="sm">Review</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 'var(--spacing-4)', textAlign: 'center' }}>
              <Link href="/dashboard/admin/suppliers">
                <Button variant="ghost">View All Suppliers</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
