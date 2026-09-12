import React from 'react';

export default function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-16) var(--spacing-4)' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 'var(--spacing-8)', color: 'var(--color-primary-navy)' }}>
        About GarMer
      </h1>
      
      <div style={{ fontSize: '1.125rem', color: 'var(--color-gray-700)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        <p>
          GarMer connects buyers and suppliers across the garment sourcing industry in China and Africa. Our platform is built specifically for B2B transactions, providing a professional marketplace focused on quality, trust, and growth.
        </p>
        
        <p>
          <strong>Verified Suppliers:</strong> We ensure that the suppliers on our platform meet our rigorous standards. Every supplier goes through a verification process to ensure credibility.
        </p>
        
        <p>
          <strong>Quality Products:</strong> Browse through thousands of high-quality products. Whether you are looking for jackets, t-shirts, or kids' wear, our marketplace provides the variety and quality you need.
        </p>
        
        <p>
          <strong>Professional Focus:</strong> GarMer is not a consumer storefront. We focus entirely on B2B relationships, making it easy to discover products, request quotations, and communicate directly with suppliers.
        </p>
      </div>
    </div>
  );
}
