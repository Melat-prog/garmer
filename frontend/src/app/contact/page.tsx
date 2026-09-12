'use client';
import React, { useState } from 'react';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 500);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--spacing-16) var(--spacing-4)' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 'var(--spacing-8)', color: 'var(--color-primary-navy)', textAlign: 'center' }}>
        Contact Us
      </h1>
      
      {submitted ? (
        <div style={{ padding: 'var(--spacing-8)', backgroundColor: '#D1FAE5', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--color-success)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>Message Sent!</h2>
          <p>Thank you for reaching out. We will get back to you shortly.</p>
          <Button onClick={() => setSubmitted(false)} variant="outline" style={{ marginTop: 'var(--spacing-4)' }}>Send another message</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Input 
            label="Name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <Input 
            label="Email" 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <Input 
            label="Subject" 
            value={formData.subject} 
            onChange={(e) => setFormData({...formData, subject: e.target.value})} 
            required 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-gray-700)' }}>Message</label>
            <textarea 
              rows={5}
              required
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              style={{
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-gray-300)',
                fontFamily: 'inherit',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>
          
          <Button type="submit" variant="primary" size="lg" style={{ marginTop: 'var(--spacing-4)' }}>
            Submit Message
          </Button>
        </form>
      )}
    </div>
  );
}
