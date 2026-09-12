import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Button } from '../components/ui/Button/Button';
import { Card, CardContent } from '../components/ui/Card/Card';

export default function Home() {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={`${styles.title} animate-slide-up`}>
            Source Quality Garments From Trusted Suppliers
          </h1>
          <p className={`${styles.subtitle} animate-slide-up`} style={{ animationDelay: '100ms' }}>
            Browse thousands of products from verified suppliers across China and Africa. Connect, communicate, and grow your business.
          </p>
          <div className={`${styles.actions} animate-slide-up`} style={{ animationDelay: '200ms' }}>
            <Link href="/products">
              <Button variant="secondary" size="lg">Browse Products</Button>
            </Link>
            <Link href="/register?role=SUPPLIER">
              <Button variant="outline" size="lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                Become a Supplier
              </Button>
            </Link>
          </div>
          
          <div className={`${styles.trustIndicators} animate-fade-in`} style={{ animationDelay: '300ms' }}>
            <div className={styles.trustItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Verified Suppliers
            </div>
            <div className={styles.trustItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Quality Products
            </div>
            <div className={styles.trustItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              Global Reach
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        <div className={styles.grid}>
          {['Jackets', 'T-Shirts', 'Shirts', 'Hoodies', 'Jeans', "Women's Wear", 'Kids Wear', 'Accessories'].map((category) => (
            <Link href={`/products?category=${category}`} key={category}>
              <Card hoverable className="animate-fade-in">
                <CardContent>
                  <div style={{ height: '150px', backgroundColor: 'var(--color-gray-100)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-400)' }}>
                    Image Placeholder
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, textAlign: 'center' }}>{category}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      
      <section className={styles.section} style={{ backgroundColor: 'var(--color-white)', borderRadius: 'var(--radius-xl)' }}>
        <h2 className={styles.sectionTitle}>New Arrivals</h2>
        <div className={styles.grid}>
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} hoverable>
              <CardContent>
                <div style={{ height: '200px', backgroundColor: 'var(--color-gray-100)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Sample Product {item}</h3>
                    <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>Supplier Name</p>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>$15.00</div>
                </div>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--color-gray-600)' }}>MOQ: 100 pcs</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-8)' }}>
          <Link href="/new-arrivals">
            <Button variant="outline">View All New Arrivals</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
