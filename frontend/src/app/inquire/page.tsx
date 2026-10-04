'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { api } from '../../lib/api';

function RequestQuotationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams?.get('product');

  const [product, setProduct] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    quantity: '',
    country: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) {
      setLoadingProduct(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const res: any = await api.getProduct(productId);
        setProduct(res?.product || null);
        if (res?.product?.moq) {
          setFormData(prev => ({ ...prev, quantity: String(res.product.moq) }));
        }
      } catch (err: any) {
        console.error('Error fetching product for inquiry:', err);
        setError('Failed to load product details.');
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      setError('No product selected for quotation request.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await api.createInquiry({
        productId,
        quantity: parseInt(formData.quantity, 10),
        country: formData.country,
        message: formData.message
      });
      router.push('/dashboard/buyer/inquiries?submitted=true');
    } catch (err: any) {
      console.error('Submit Inquiry Error:', err);
      setError(err.message || 'Failed to submit quotation request. Please check if you are logged in as a Buyer.');
    } finally {
      setSubmitting(false);
    }
  };

  const image = product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-12) var(--spacing-4)' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-navy)', marginBottom: 'var(--spacing-6)' }}>
        Request Quotation
      </h1>

      {error && (
        <div style={{ padding: 'var(--spacing-4)', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-6)' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
        <Card>
          <CardContent style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
            {loadingProduct ? (
              <div style={{ padding: 'var(--spacing-4)' }}>Loading product details...</div>
            ) : product ? (
              <>
                <img 
                  src={image} 
                  alt={product.name} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
                />
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--spacing-1)' }}>{product.name}</h2>
                  <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>
                    Supplier: {product.supplier?.companyName || 'Verified Supplier'}
                  </p>
                  <div style={{ marginTop: 'var(--spacing-2)', color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
                    MOQ: {product.moq} pcs
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--color-gray-500)' }}>
                Generic Garment RFQ (No specific product selected)
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <Input 
                  label="Required Quantity" 
                  type="number" 
                  min={product?.moq || 1}
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
                  placeholder="Please include details about colors, sizes, packaging, target delivery date, or custom branding requirements..."
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
                  {submitting ? 'Submitting to Admin...' : 'Submit RFQ to Admin'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RequestQuotation() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>Loading inquiry form...</div>}>
      <RequestQuotationForm />
    </Suspense>
  );
}
