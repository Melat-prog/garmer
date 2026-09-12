import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', 
                backgroundColor: 'var(--color-primary-navy)',
                border: '2px solid var(--color-primary-gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-primary-gold)', fontWeight: 'bold', fontSize: '1rem'
              }}>GM</div>
              <span style={{ color: 'var(--color-white)', fontWeight: 800, fontSize: '1.25rem', marginLeft: '0.5rem' }}>GarMer</span>
            </div>
            <p className={styles.tagline}>From Global Garment to Merkato</p>
          </div>
          
          <div>
            <h3 className={styles.title}>Marketplace</h3>
            <div className={styles.links}>
              <Link href="/products" className={styles.link}>All Products</Link>
              <Link href="/suppliers" className={styles.link}>Verified Suppliers</Link>
              <Link href="/categories" className={styles.link}>Categories</Link>
              <Link href="/new-arrivals" className={styles.link}>New Arrivals</Link>
            </div>
          </div>
          
          <div>
            <h3 className={styles.title}>Company</h3>
            <div className={styles.links}>
              <Link href="/about" className={styles.link}>About Us</Link>
              <Link href="/contact" className={styles.link}>Contact</Link>
              <Link href="/careers" className={styles.link}>Careers</Link>
            </div>
          </div>
          
          <div>
            <h3 className={styles.title}>Support</h3>
            <div className={styles.links}>
              <Link href="/help" className={styles.link}>Help Center</Link>
              <Link href="/terms" className={styles.link}>Terms of Service</Link>
              <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} GarMer. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>EN</span>
            <span>USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
