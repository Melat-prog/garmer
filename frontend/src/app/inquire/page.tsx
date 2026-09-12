'use client';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';

export default function RequestQuotation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams?.get('product');

  const [formData, setFormData] = useState({
    quantity: '',
    country: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      // Redirect to Buyer Dashboard Inquiry History
      router.push('/dashboard/buyer?inquirySubmitted=true');
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-12) var(--spacing-4)' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-navy)', marginBottom: 'var(--spacing-6)' }}>
        Request Quotation
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
        <Card>
          <CardContent style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--color-gray-200)', borderRadius: 'var(--radius-md)' }}></div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--spacing-1)' }}>Premium Cotton T-Shirt</h2>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>Supplier: Global Garments Ltd</p>
              <div style={{ marginTop: 'var(--spacing-2)', color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>MOQ: 100 pcs</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <Input 
                  label="Required Quantity" 
                  type="number" 
                  min="100"
                  required
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                  placeholder="e.g. 500"
                />
                <Input 
                  label="Destination Country" 
                  required
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                  placeholder="e.g. United States"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-gray-700)' }}>
                  Detailed Message / Requirements
                </label>
                <textarea 
                  rows={6}
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="Please include details about colors, sizes, packaging, or custom branding requirements..."
                  style={{
                    padding: 'var(--spacing-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-gray-300)',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ marginTop: 'var(--spacing-6)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-4)' }}>
                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Inquiry'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
