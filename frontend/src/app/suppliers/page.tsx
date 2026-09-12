'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Card, CardContent } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Badge } from '../../components/ui/Badge/Badge';
import { Input } from '../../components/ui/Input/Input';

const mockSuppliers = Array.from({ length: 9 }).map((_, i) => ({
  id: `sup-${i}`,
  companyName: `Global Manufacturing Group ${i + 1}`,
  location: i % 2 === 0 ? 'Guangzhou, China' : 'Addis Ababa, Ethiopia',
  yearsInBusiness: 5 + i,
  verified: i % 4 !== 0,
  mainCategories: ['T-Shirts', 'Jackets'],
  rating: (4 + (i % 10) / 10).toFixed(1),
  reviews: 10 + i * 5
}));

export default function SuppliersDirectory() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <h1 className={styles.title}>Supplier Directory</h1>
        <p className={styles.subtitle}>Find and connect with verified garment manufacturers</p>
      </div>

      <div className={styles.searchBar}>
        <Input 
          placeholder="Search suppliers by name, country, or product type..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {mockSuppliers.map(supplier => (
          <Card key={supplier.id} className={styles.supplierCard} hoverable>
            <CardContent>
              <div className={styles.supplierHeader}>
                <div className={styles.supplierLogo}></div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 className={styles.supplierName}>{supplier.companyName}</h3>
                    {supplier.verified && <Badge variant="gold">Verified</Badge>}
                  </div>
                  <div style={{ color: 'var(--color-warning)', fontSize: '0.875rem', fontWeight: 600 }}>
                    ★ {supplier.rating} ({supplier.reviews} reviews)
                  </div>
                </div>
              </div>
              
              <div className={styles.supplierInfo}>
                <div>📍 {supplier.location}</div>
                <div>🏢 {supplier.yearsInBusiness} Years in Business</div>
                <div>🏷️ {supplier.mainCategories.join(', ')}</div>
              </div>

              <div className={styles.productPreview}>
                <div className={styles.previewImage}></div>
                <div className={styles.previewImage}></div>
                <div className={styles.previewImage}></div>
              </div>

              <div className={styles.actions}>
                <Link href={`/suppliers/${supplier.id}`}>
                  <Button variant="outline" fullWidth>View Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
