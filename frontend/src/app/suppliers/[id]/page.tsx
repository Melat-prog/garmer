'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import { Button } from '../../../components/ui/Button/Button';
import { Badge } from '../../../components/ui/Badge/Badge';
import { Card, CardContent } from '../../../components/ui/Card/Card';
import { api } from '../../../lib/api';

export default function SupplierProfile() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchSupplier = async () => {
      try {
        setLoading(true);
        const res: any = await api.getSupplier(id as string);
        setSupplier(res?.supplier || null);
      } catch (err: any) {
        console.error('Error fetching supplier profile:', err);
        setError(err.message || 'Supplier not found');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-16)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
        Loading supplier profile...
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div style={{ maxWidth: '600px', margin: 'var(--spacing-16) auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--spacing-4)' }}>Supplier Not Found</h2>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-6)' }}>The requested supplier profile does not exist.</p>
        <Link href="/products">
          <Button variant="primary">Browse Marketplace</Button>
        </Link>
      </div>
    );
  }

  const products = supplier.products || [];
  const certificates = supplier.certificates || [];

  return (
    <div className={styles.layout}>
      <div className={styles.hero}>
        <div 
          className={styles.logo}
          style={supplier.logoUrl ? { backgroundImage: `url(${supplier.logoUrl})`, backgroundSize: 'cover' } : {}}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--spacing-2)' }}>
          <h1 className={styles.title}>{supplier.companyName}</h1>
          {supplier.isVerified && <Badge variant="gold">Verified</Badge>}
        </div>
        
        <div className={styles.meta}>
          <div>📍 {supplier.location || 'Location Not Specified'}</div>
          <div>🏢 {supplier.yearsInBusiness || 0} Years Experience</div>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
          <Link href={`/products?supplier=${supplier.id}`}>
            <Button variant="primary" size="lg">Browse Products ({products.length})</Button>
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <div>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>About Company</h2>
            <p style={{ color: 'var(--color-gray-700)', lineHeight: 1.6 }}>
              {supplier.description || 'No description provided by supplier.'}
            </p>
          </section>

          <section className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Products Catalog</h2>
            </div>
            
            {products.length === 0 ? (
              <p style={{ color: 'var(--color-gray-500)' }}>No products listed yet.</p>
            ) : (
              <div className={styles.productGrid}>
                {products.map((product: any) => {
                  const primaryImage = product.images?.[0]?.url;
                  return (
                    <Link href={`/products/${product.id}`} key={product.id}>
                      <Card hoverable style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div 
                          style={{ height: '150px', backgroundColor: 'var(--color-gray-100)', ... (primaryImage ? { backgroundImage: `url(${primaryImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }} 
                        />
                        <CardContent style={{ padding: 'var(--spacing-3)' }}>
                          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{product.name}</h3>
                          <div style={{ color: 'var(--color-primary-navy)', fontWeight: 700 }}>
                            {product.price != null ? `$${Number(product.price).toFixed(2)}` : 'Inquire'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>MOQ: {product.moq} pcs</div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Certificates & Accreditations</h2>
            {certificates.length === 0 ? (
              <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>No certificates uploaded.</p>
            ) : (
              <div className={styles.certificateGrid}>
                {certificates.map((cert: any) => (
                  <div key={cert.id} className={styles.certificateItem}>
                    📜 {cert.name}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Business Summary</h2>
            <Card>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Location</div>
                  <div style={{ fontWeight: 500 }}>{supplier.location || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Years in Business</div>
                  <div style={{ fontWeight: 500 }}>{supplier.yearsInBusiness || 0} Years</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Verification Status</div>
                  <div style={{ fontWeight: 500 }}>{supplier.isVerified ? 'GarMer Verified' : 'Standard Registration'}</div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
