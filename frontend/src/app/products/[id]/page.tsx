'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import { Button } from '../../../components/ui/Button/Button';
import { Badge } from '../../../components/ui/Badge/Badge';
import { Card, CardContent } from '../../../components/ui/Card/Card';
import { api } from '../../../lib/api';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res: any = await api.getProduct(id as string);
        setProduct(res?.product || null);
      } catch (err: any) {
        console.error('Error fetching product details:', err);
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-16)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ maxWidth: '600px', margin: 'var(--spacing-16) auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--spacing-4)' }}>Product Not Found</h2>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-6)' }}>The requested product does not exist or has been removed.</p>
        <Link href="/products">
          <Button variant="primary">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const supplier = product.supplier || {};
  const images = product.images || [];
  const mainImage = images.find((img: any) => img.isPrimary)?.url || images[0]?.url;

  return (
    <div className={styles.layout}>
      <div className={styles.grid}>
        {/* Images */}
        <div className={styles.imageGallery}>
          <div 
            className={styles.mainImage}
            style={mainImage ? { backgroundImage: `url(${mainImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          />
          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((img: any, i: number) => (
                <div 
                  key={img.id || i} 
                  className={styles.thumbnail}
                  style={{ backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.productInfo}>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
            <Badge variant="default">{product.category?.name || 'Garment'}</Badge>
            <Badge variant="success">In Stock ({product.stock || 0})</Badge>
          </div>
          
          <h1 className={styles.title}>{product.name}</h1>
          <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.6 }}>{product.description}</p>
          
          <div className={styles.priceBlock}>
            <div>
              <div className={styles.price}>
                {product.price != null ? `$${Number(product.price).toFixed(2)}` : 'Inquire for price'}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>per piece / FOB</div>
            </div>
            <div className={styles.moq}>
              MOQ: <strong>{product.moq} pcs</strong>
            </div>
          </div>

          <div className={styles.specs}>
            {product.fabric && (
              <>
                <div className={styles.specLabel}>Fabric</div>
                <div className={styles.specValue}>{product.fabric}</div>
              </>
            )}
            
            {product.colors && product.colors.length > 0 && (
              <>
                <div className={styles.specLabel}>Available Colors</div>
                <div className={styles.specValue}>{product.colors.join(', ')}</div>
              </>
            )}
            
            {product.sizes && product.sizes.length > 0 && (
              <>
                <div className={styles.specLabel}>Available Sizes</div>
                <div className={styles.specValue}>{product.sizes.join(', ')}</div>
              </>
            )}
            
            {product.deliveryTimeDays && (
              <>
                <div className={styles.specLabel}>Lead Time</div>
                <div className={styles.specValue}>{product.deliveryTimeDays} days</div>
              </>
            )}
            
            {product.countryOfOrigin && (
              <>
                <div className={styles.specLabel}>Origin</div>
                <div className={styles.specValue}>{product.countryOfOrigin}</div>
              </>
            )}
          </div>

          <div className={styles.actions}>
            <Link href={`/inquire?product=${product.id}`} style={{ flex: 1 }}>
              <Button variant="primary" size="lg" fullWidth>Request Quotation</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Supplier Section */}
      <Card className={styles.supplierCard}>
        <CardContent>
          <div className={styles.supplierHeader}>
            <div 
              className={styles.supplierLogo}
              style={supplier.logoUrl ? { backgroundImage: `url(${supplier.logoUrl})`, backgroundSize: 'cover' } : {}}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{supplier.companyName || 'GarMer Supplier'}</h3>
                {supplier.isVerified && <Badge variant="gold">Verified</Badge>}
              </div>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>
                {supplier.location || 'Location Not Specified'} • {supplier.yearsInBusiness || 0} Years in Business
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-8)', marginTop: 'var(--spacing-6)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>Verified Supplier</div>
              <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>GarMer Certified</div>
            </div>
            {supplier.id && (
              <div style={{ marginLeft: 'auto' }}>
                <Link href={`/suppliers/${supplier.id}`}>
                  <Button variant="outline">View Full Profile</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
