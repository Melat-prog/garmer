'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import { Button } from '../../../components/ui/Button/Button';
import { Badge } from '../../../components/ui/Badge/Badge';
import { Card, CardContent } from '../../../components/ui/Card/Card';

export default function SupplierProfile() {
  const { id } = useParams();
  
  // Mock data
  const supplier = {
    id: id as string,
    companyName: 'Global Garments Ltd',
    description: 'We are a leading manufacturer of premium cotton garments with over 12 years of experience. We specialize in t-shirts, hoodies, and polo shirts. Our factory is ISO 9001 certified and we prioritize sustainable and ethical production practices.',
    location: 'Guangzhou, China',
    yearsInBusiness: 12,
    isVerified: true,
    rating: 4.8,
    reviewsCount: 156,
    mainCategories: ['T-Shirts', 'Jackets', 'Hoodies'],
    products: Array.from({ length: 6 }).map((_, i) => ({
      id: `prod-${i}`,
      name: `Premium Cotton Product ${i + 1}`,
      price: 12.50 + i,
      moq: 100
    })),
    certificates: ['ISO 9001:2015', 'WRAP Certification', 'OEKO-TEX Standard 100']
  };

  return (
    <div className={styles.layout}>
      <div className={styles.hero}>
        <div className={styles.logo}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--spacing-2)' }}>
          <h1 className={styles.title}>{supplier.companyName}</h1>
          {supplier.isVerified && <Badge variant="gold">Verified</Badge>}
        </div>
        
        <div className={styles.meta}>
          <div>📍 {supplier.location}</div>
          <div>🏢 {supplier.yearsInBusiness} Years Experience</div>
          <div>⭐ {supplier.rating}/5 ({supplier.reviewsCount} Reviews)</div>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
          <Link href={`/messages/new?supplier=${supplier.id}`}>
            <Button variant="primary" size="lg">Contact Supplier</Button>
          </Link>
          <Button variant="outline" size="lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Save Supplier</Button>
        </div>
      </div>

      <div className={styles.content}>
        <div>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>About Company</h2>
            <p style={{ color: 'var(--color-gray-700)', lineHeight: 1.6 }}>{supplier.description}</p>
          </section>

          <section className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Products</h2>
              <Link href={`/products?supplier=${supplier.id}`} style={{ color: 'var(--color-primary-navy)', fontWeight: 600 }}>
                View All
              </Link>
            </div>
            
            <div className={styles.productGrid}>
              {supplier.products.map(product => (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <Card hoverable style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '150px', backgroundColor: 'var(--color-gray-100)' }}></div>
                    <CardContent style={{ padding: 'var(--spacing-3)' }}>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{product.name}</h3>
                      <div style={{ color: 'var(--color-primary-navy)', fontWeight: 700 }}>${product.price.toFixed(2)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>MOQ: {product.moq}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Certificates & Trust</h2>
            <div className={styles.certificateGrid}>
              {supplier.certificates.map((cert, i) => (
                <div key={i} className={styles.certificateItem}>
                  {cert}
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Business Details</h2>
            <Card>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Main Categories</div>
                  <div style={{ fontWeight: 500 }}>{supplier.mainCategories.join(', ')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Business Type</div>
                  <div style={{ fontWeight: 500 }}>Manufacturer, Trading Company</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Accepted Payment</div>
                  <div style={{ fontWeight: 500 }}>T/T, L/C, Western Union</div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
