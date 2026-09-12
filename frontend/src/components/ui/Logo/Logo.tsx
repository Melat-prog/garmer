import React from 'react';
import Link from 'next/link';
import styles from './Logo.module.css';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showTagline = true }) => {
  return (
    <Link href="/" className={`${styles.logoContainer} ${className}`}>
      <div className={styles.logoMain}>
        <div className={styles.logoCircle}>GM</div>
        <span className={styles.wordmark}>GarMer</span>
      </div>
      {showTagline && (
        <span className={styles.tagline}>From Global Garment to Merkato</span>
      )}
    </Link>
  );
};
