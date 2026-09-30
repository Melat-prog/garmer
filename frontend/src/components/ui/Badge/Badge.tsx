import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'gold';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', style }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`} style={style}>
      {children}
    </span>
  );
};
