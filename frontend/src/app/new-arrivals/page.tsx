'use client';
import React from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Badge } from '../../components/ui/Badge/Badge';

const mockNewArrivals = Array.from({ length: 8 }).map((_, i) => ({
  id: `new-${i}`,
  name: `New Collection Product ${i + 1}`,
  supplier: 'Modern Threads Co.',
  price: 18.50 + i,
  moq: 50,
  verified: true,
  daysAgo: i % 3 + 1
}));

export default function NewArrivalsPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'var(--spacing-8) var(--spacing-4)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
        <Badge variant="primary" className="animate-fade-in">Just In</Badge>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: 'var(--spacing-4)', color: 'var(--color-gray-900)' }}>
          New Arrivals
        </h1>
        <p style={{ color: 'var(--color-gray-600)', marginTop: 'var(--spacing-2)', fontSize: '1.125rem' }}>
          Discover the latest products added to the GarMer marketplace this week.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
        {mockNewArrivals.map((product, index) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <Card hoverable className="animate-slide-up" style={{ animationDelay: `${index * 50}ms`, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '100%', height: '220px', backgroundColor: 'var(--color-gray-100)' }}></div>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <Badge variant="success">New - {product.daysAgo}d ago</Badge>
                </div>
              </div>
              
              <div style={{ padding: 'var(--spacing-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 'var(--spacing-1)', color: 'var(--color-gray-900)', lineHeight: 1.4 }}>
                  {product.name}
                </h3>
                
                <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {product.supplier} 
                  {product.verified && <Badge variant="gold" style={{ fontSize: '0.65rem', padding: '0.1rem 0.3rem' }}>Verified</Badge>}
                </div>
                
                <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
                      ${product.price.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                      MOQ: {product.moq} pcs
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Request</Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
