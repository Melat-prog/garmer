'use client';
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '../../../../../components/ui/Card/Card';
import { Button } from '../../../../../components/ui/Button/Button';
import { Badge } from '../../../../../components/ui/Badge/Badge';

export default function SavedProducts() {
  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-6)' }}>
        Saved Products
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-6)' }}>
        {[1, 2, 3, 4].map(i => (
          <Card key={i} hoverable style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--color-gray-200)' }}></div>
              <button 
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                aria-label="Remove from saved"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-error)" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>
            
            <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--spacing-1)' }}>Premium Cotton T-Shirt {i}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--spacing-2)' }}>
                Global Garments Ltd <Badge variant="gold" style={{ fontSize: '0.65rem' }}>Verified</Badge>
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
                    ${(12.50 + i).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                    MOQ: 100 pcs
                  </div>
                </div>
                <Link href={`/inquire?product=prod-${i}`}>
                  <Button variant="primary" size="sm">Inquire</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
