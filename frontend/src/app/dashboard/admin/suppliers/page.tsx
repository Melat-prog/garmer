'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../../../components/ui/Card/Card';
import { Button } from '../../../../../components/ui/Button/Button';
import { Badge } from '../../../../../components/ui/Badge/Badge';
import { Input } from '../../../../../components/ui/Input/Input';

export default function AdminSuppliers() {
  const [search, setSearch] = useState('');

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-6)' }}>
        Supplier Management
      </h1>

      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <Input 
                placeholder="Search suppliers..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <select style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }}>
                <option>All Statuses</option>
                <option>Pending Verification</option>
                <option>Verified</option>
                <option>Rejected</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-gray-200)', textAlign: 'left', color: 'var(--color-gray-500)' }}>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Company Name</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Email</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Location</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Registered</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Status</th>
                  <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => {
                  const isPending = i === 1 || i === 2;
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', fontWeight: 500 }}>
                        Global Garments {i} Ltd
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', color: 'var(--color-gray-600)' }}>contact@gg{i}.com</td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', color: 'var(--color-gray-600)' }}>Guangzhou, CN</td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', color: 'var(--color-gray-600)' }}>Oct 12, 2024</td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                        {isPending ? <Badge variant="warning">Pending</Badge> : <Badge variant="success">Verified</Badge>}
                      </td>
                      <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', display: 'flex', gap: '0.5rem' }}>
                        {isPending && <Button variant="primary" size="sm">Approve</Button>}
                        <Button variant="outline" size="sm">Review</Button>
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
