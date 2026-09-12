'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { Badge } from '../../components/ui/Badge/Badge';
import { Input } from '../../components/ui/Input/Input';
import { api } from '../../lib/api';

const categories = ['Jackets', 'T-Shirts', 'Shirts', 'Hoodies', 'Jeans', "Women's Wear", 'Kids Wear', 'Accessories'];
const countries = ['China', 'Ethiopia', 'Kenya', 'Vietnam', 'Bangladesh'];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data: any = await api.getProducts();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  return (
    <div className={styles.layout}>
      {/* Sidebar Filters */}
      <aside className={styles.sidebar}>
        <div style={{ position: 'sticky', top: '100px' }}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Search</h3>
            <Input 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Category</h3>
            <div className={styles.checkboxList}>
              {categories.map(cat => (
                <label key={cat} className={styles.checkboxLabel}>
                  <input type="checkbox" /> {cat}
                </label>
              ))}
            </div>
          </div>
          
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Origin Country</h3>
            <div className={styles.checkboxList}>
              {countries.map(country => (
                <label key={country} className={styles.checkboxLabel}>
                  <input type="checkbox" /> {country}
                </label>
              ))}
            </div>
          </div>
          
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Minimum Order</h3>
            <div className={styles.checkboxList}>
              <label className={styles.checkboxLabel}><input type="radio" name="moq" /> Any</label>
              <label className={styles.checkboxLabel}><input type="radio" name="moq" /> &lt; 100 pcs</label>
              <label className={styles.checkboxLabel}><input type="radio" name="moq" /> 100 - 500 pcs</label>
              <label className={styles.checkboxLabel}><input type="radio" name="moq" /> &gt; 500 pcs</label>
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
            <select style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-gray-300)' }}>
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div>Loading products...</div>
        ) : (
          <div className={styles.grid}>
            {products.map(product => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <Card className={styles.productCard} hoverable>
                  <div className={styles.productImage}></div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    <div className={styles.productSupplier}>
                      {product.supplier?.supplierProfile?.companyName || 'GarMer Supplier'} 
                      {product.supplier?.supplierProfile?.isVerified && <Badge variant="gold">Verified</Badge>}
                    </div>
                    
                    <div className={styles.productMeta}>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
                          ${Number(product.price).toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                          MOQ: {product.moq} pcs
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Request</Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

