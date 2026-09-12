'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../../components/ui/Card/Card';
import { Button } from '../../../../components/ui/Button/Button';
import { Badge } from '../../../../components/ui/Badge/Badge';
import { Input } from '../../../../components/ui/Input/Input';

export default function SupplierProducts() {
  const [search, setSearch] = useState('');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)' }}>
          Product Management
        </h1>
        <Button variant="primary">Add New Product</Button>
      </div>

      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '300px' }}>
              <Input 
                placeholder="Search your products..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <select style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }}>
                <option>All Categories</option>
                <option>T-Shirts</option>
                <option>Jackets</option>
              </select>
              <select style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }}>
                <option>Status: All</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-gray-200)', textAlign: 'left', color: 'var(--color-gray-500)' }}>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Product</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>SKU</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Price</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Stock</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Status</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-gray-200)', borderRadius: 'var(--radius-sm)' }}></div>
                      <span style={{ fontWeight: 500 }}>Premium Cotton T-Shirt {i}</span>
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', color: 'var(--color-gray-600)' }}>TS-00{i}</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>${(12.50 + i).toFixed(2)}</td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                      {i === 2 ? <span style={{ color: 'var(--color-error)' }}>Out of Stock</span> : '5,000'}
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                      {i === 2 ? <Badge variant="error">Inactive</Badge> : <Badge variant="success">Active</Badge>}
                    </td>
                    <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', display: 'flex', gap: '0.5rem' }}>
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" style={{ color: 'var(--color-error)' }}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
