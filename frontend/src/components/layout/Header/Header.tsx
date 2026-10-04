'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { Logo } from '../../ui/Logo/Logo';
import { Button } from '../../ui/Button/Button';
import { api } from '../../../lib/api';

export const Header: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; role: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res: any = await api.getMe();
        if (res?.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Header auth check failed:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    setUser(null);
    router.push('/login');
  };

  const getDashboardHref = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN':
        return '/dashboard/admin';
      case 'SUPPLIER':
        return '/dashboard/supplier';
      case 'BUYER':
      default:
        return '/dashboard/buyer';
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo />
        
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/products" className={styles.navLink}>Products</Link>
          <Link href="/suppliers" className={styles.navLink}>Suppliers</Link>
          <Link href="/products" className={styles.navLink}>Categories</Link>
          <Link href="/new-arrivals" className={styles.navLink}>New Arrivals</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
        </nav>
        
        <div className={styles.actions}>
          {loading ? null : user ? (
            <>
              <Link href={getDashboardHref()}>
                <Button variant="primary" size="sm">Dashboard</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </>
          )}
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
