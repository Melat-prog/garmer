'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Badge } from '../../components/ui/Badge/Badge';
import { Input } from '../../components/ui/Input/Input';
import { api } from '../../lib/api';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res: any = await api.getCategories();
        setCategories(res?.categories || []);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (searchQuery.trim()) params.query = searchQuery.trim();
        if (selectedCategory) params.category = selectedCategory;

        const data: any = await api.getProducts(params);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);
  
  return (
    <div className={styles.layout}>
      {/* Sidebar Filters */}
      <aside className={styles.sidebar}>
        <div style={{ position: 'sticky', top: '100px' }}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Search Products</h3>
            <Input 
              placeholder="e.g. Cotton T-Shirt, Jacket..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Category</h3>
            <div className={styles.checkboxList}>
              <label key="all" className={styles.checkboxLabel}>
                <input 
                  type="radio" 
                  name="category" 
                  checked={selectedCategory === ''} 
                  onChange={() => setSelectedCategory('')} 
                /> All Categories
              </label>
              {categories.map((cat: any) => (
                <label key={cat.id} className={styles.checkboxLabel}>
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === cat.id} 
                    onChange={() => setSelectedCategory(cat.id)} 
                  /> {cat.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Marketplace Products</h1>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>{products.length} results</span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 'var(--spacing-12)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: 'var(--spacing-12)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>No products found</p>
            <p>Try adjusting your search query or category filters.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map(product => {
              const primaryImage = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url;
              return (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <Card className={styles.productCard} hoverable>
                    <div 
                      className={styles.productImage} 
                      style={primaryImage ? { backgroundImage: `url(${primaryImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    />
                    <div className={styles.productInfo}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>
                        {product.category?.name || 'Garment'}
                      </div>
                      <h3 className={styles.productTitle}>{product.name}</h3>
                      <div className={styles.productSupplier}>
                        {product.supplier?.companyName || 'Verified Supplier'} 
                        {product.supplier?.isVerified && <Badge variant="gold">Verified</Badge>}
                      </div>
                      
                      <div className={styles.productMeta}>
                        <div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
                            {product.price != null ? `$${Number(product.price).toFixed(2)}` : 'Inquire for price'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                            MOQ: {product.moq} pcs
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

