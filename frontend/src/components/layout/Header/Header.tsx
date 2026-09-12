import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { Logo } from '../../ui/Logo/Logo';
import { Button } from '../../ui/Button/Button';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo />
        
        <nav className={styles.nav}>
          <Link href="/products" className={styles.navLink}>Categories</Link>
          <Link href="/suppliers" className={styles.navLink}>Suppliers</Link>
          <Link href="/new-arrivals" className={styles.navLink}>New Arrivals</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
        </nav>
        
        <div className={styles.actions}>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary">Sign Up</Button>
          </Link>
          <button className={styles.mobileMenuBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
