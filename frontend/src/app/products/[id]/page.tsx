'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import { Button } from '../../../components/ui/Button/Button';
import { Badge } from '../../../components/ui/Badge/Badge';
import { Card, CardContent } from '../../../components/ui/Card/Card';

export default function ProductDetails() {
  const { id } = useParams();
  
  // Mock data for development
  const product = {
    id: id as string,
    name: 'Premium Cotton T-Shirt',
    description: 'High quality 100% organic cotton t-shirt with custom branding options. Perfect for retail or corporate events. Features double-stitched hems and a comfortable modern fit.',
    price: 12.50,
    moq: 100,
    fabric: '100% Organic Cotton, 180gsm',
    colors: ['White', 'Black', 'Navy', 'Heather Grey'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    deliveryTimeDays: 14,
    countryOfOrigin: 'China',
    supplier: {
      id: 'sup-1',
      companyName: 'Global Garments Ltd',
      location: 'Guangzhou, China',
      yearsInBusiness: 12,
      isVerified: true,
      rating: 4.8,
      reviewsCount: 156
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.grid}>
        {/* Images */}
        <div className={styles.imageGallery}>
          <div className={styles.mainImage}></div>
          <div className={styles.thumbnails}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={styles.thumbnail}></div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className={styles.productInfo}>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
            <Badge variant="default">T-Shirts</Badge>
            <Badge variant="success">In Stock</Badge>
          </div>
          
          <h1 className={styles.title}>{product.name}</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>{product.description}</p>
          
          <div className={styles.priceBlock}>
            <div>
              <div className={styles.price}>${product.price.toFixed(2)}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>per piece / FOB</div>
            </div>
            <div className={styles.moq}>
              MOQ: <strong>{product.moq} pcs</strong>
            </div>
          </div>

          <div className={styles.specs}>
            <div className={styles.specLabel}>Fabric</div>
            <div className={styles.specValue}>{product.fabric}</div>
            
            <div className={styles.specLabel}>Available Colors</div>
            <div className={styles.specValue}>{product.colors.join(', ')}</div>
            
            <div className={styles.specLabel}>Available Sizes</div>
            <div className={styles.specValue}>{product.sizes.join(', ')}</div>
            
            <div className={styles.specLabel}>Lead Time</div>
            <div className={styles.specValue}>{product.deliveryTimeDays} days</div>
            
            <div className={styles.specLabel}>Origin</div>
            <div className={styles.specValue}>{product.countryOfOrigin}</div>
          </div>

          <div className={styles.actions}>
            <Link href={`/inquire?product=${product.id}`} style={{ flex: 1 }}>
              <Button variant="primary" size="lg" fullWidth>Request Quotation</Button>
            </Link>
            <Button variant="outline" size="lg" aria-label="Save to favorites">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </Button>
          </div>
          
          <div style={{ marginTop: 'var(--spacing-4)', textAlign: 'center' }}>
            <Link href={`/messages/new?supplier=${product.supplier.id}`}>
              <Button variant="ghost">Chat with Supplier</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Supplier Section */}
      <Card className={styles.supplierCard}>
        <CardContent>
          <div className={styles.supplierHeader}>
            <div className={styles.supplierLogo}></div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{product.supplier.companyName}</h3>
                {product.supplier.isVerified && <Badge variant="gold">Verified</Badge>}
              </div>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>
                {product.supplier.location} • {product.supplier.yearsInBusiness} Years in Business
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-8)', marginTop: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{product.supplier.rating}/5</div>
              <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>{product.supplier.reviewsCount} Reviews</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>98%</div>
              <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>Response Rate</div>
            </div>
            <div style={{ marginLeft: 'auto', alignSelf: 'center' }}>
              <Link href={`/suppliers/${product.supplier.id}`}>
                <Button variant="outline">View Full Profile</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
