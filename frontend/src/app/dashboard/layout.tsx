'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Determine role based on path for mock purposes
  let role = 'buyer';
  if (pathname?.includes('/supplier')) role = 'supplier';
  if (pathname?.includes('/admin')) role = 'admin';

  const getLinks = () => {
    switch(role) {
      case 'buyer':
        return [
          { label: 'Overview', href: '/dashboard/buyer' },
          { label: 'Inquiries', href: '/dashboard/buyer/inquiries' },
          { label: 'Saved Products', href: '/dashboard/buyer/saved' },
          { label: 'Messages', href: '/dashboard/buyer/messages' },
          { label: 'Settings', href: '/dashboard/buyer/settings' },
        ];
      case 'supplier':
        return [
          { label: 'Overview', href: '/dashboard/supplier' },
          { label: 'Products', href: '/dashboard/supplier/products' },
          { label: 'Inquiries', href: '/dashboard/supplier/inquiries' },
          { label: 'Messages', href: '/dashboard/supplier/messages' },
          { label: 'Profile', href: '/dashboard/supplier/profile' },
        ];
      case 'admin':
        return [
          { label: 'Overview', href: '/dashboard/admin' },
          { label: 'Suppliers', href: '/dashboard/admin/suppliers' },
          { label: 'Products', href: '/dashboard/admin/products' },
          { label: 'Reports', href: '/dashboard/admin/reports' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <div className={styles.layout}>
      {/* Mobile Sidebar Toggle */}
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
