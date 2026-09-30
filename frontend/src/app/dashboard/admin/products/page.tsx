'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Input } from '@/components/ui/Input/Input';

export default function AdminProducts() {
  const [search, setSearch] = useState('');

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-6)' }}>
        Product Moderation
      </h1>

      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <Input 
                placeholder="Search products..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <select style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }}>
                <option>All Statuses</option>
                <option>Pending Review</option>
                <option>Active</option>
                <option>Flagged</option>
                <option>Removed</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-gray-200)', textAlign: 'left', color: 'var(--color-gray-500)' }}>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Product Name</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Supplier</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Category</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Price</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Status</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => {
                  const isFlagged = i === 2;
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-gray-200)', borderRadius: 'var(--radius-sm)' }}></div>
                        Premium Cotton T-Shirt {i}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', color: 'var(--color-gray-600)' }}>Global Garments Ltd</td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', color: 'var(--color-gray-600)' }}>T-Shirts</td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>${(12.50 + i).toFixed(2)}</td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {isFlagged ? <Badge variant="error">Flagged</Badge> : <Badge variant="success">Active</Badge>}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', display: 'flex', gap: '0.5rem' }}>
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="ghost" size="sm" style={{ color: 'var(--color-error)' }}>{isFlagged ? 'Remove' : 'Flag'}</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
