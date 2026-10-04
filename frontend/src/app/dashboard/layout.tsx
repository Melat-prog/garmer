'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  let role = 'buyer';
  if (pathname?.includes('/supplier')) role = 'supplier';
  if (pathname?.includes('/admin')) role = 'admin';

  const getLinks = () => {
    switch(role) {
      case 'buyer':
        return [
          { label: 'Overview', href: '/dashboard/buyer' },
          { label: 'My RFQs & Quotes', href: '/dashboard/buyer/inquiries' },
          { label: 'Browse Products', href: '/products' },
          { label: 'Suppliers Catalog', href: '/suppliers' },
        ];
      case 'supplier':
        return [
          { label: 'Overview', href: '/dashboard/supplier' },
          { label: 'Forwarded RFQs', href: '/dashboard/supplier/inquiries' },
          { label: 'Marketplace Products', href: '/products' },
        ];
      case 'admin':
        return [
          { label: 'Overview', href: '/dashboard/admin' },
          { label: 'RFQ Management', href: '/dashboard/admin/inquiries' },
          { label: 'Suppliers List', href: '/suppliers' },
          { label: 'Products List', href: '/products' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <div className={styles.layout}>
      <button 
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        ☰ Dashboard Menu
      </button>

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Panel</h2>
        </div>
        <nav className={styles.nav}>
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
