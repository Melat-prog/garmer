'use client';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { api } from '../../lib/api';

export default function Register() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRole = searchParams?.get('role') === 'SUPPLIER' ? 'SUPPLIER' : 'BUYER';
  
  const [role, setRole] = useState<'BUYER' | 'SUPPLIER'>(initialRole);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    contactName: '',
    location: '',
    yearsInBusiness: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await userCredential.user.getIdToken();
      
      // 2. Register with backend
      await api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          token,
          role,
          companyName: formData.companyName,
          contactName: formData.contactName,
          location: formData.location,
          yearsInBusiness: formData.yearsInBusiness
        })
      });
      
      // Store token
      localStorage.setItem('auth_token', token);
      
      // Redirect to dashboard
      router.push(`/dashboard/${role.toLowerCase()}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--spacing-12) var(--spacing-4)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-navy)' }}>
          Create an Account
        </h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: 'var(--spacing-2)' }}>
          Join GarMer to connect, source, and grow.
        </p>
      </div>

      <Card>
        <CardContent>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
            <Button 
              type="button"
              variant={role === 'BUYER' ? 'primary' : 'outline'}
              fullWidth
              onClick={() => setRole('BUYER')}
            >
              I'm a Buyer
            </Button>
            <Button 
              type="button"
              variant={role === 'SUPPLIER' ? 'primary' : 'outline'}
              fullWidth
              onClick={() => setRole('SUPPLIER')}
            >
              I'm a Supplier
            </Button>
          </div>

          {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--spacing-4)', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
            <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            
            <div style={{ borderTop: '1px solid var(--color-gray-200)', margin: 'var(--spacing-4) 0', paddingTop: 'var(--spacing-4)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Profile Information</h3>
              <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
              
              {role === 'BUYER' && (
                <Input label="Contact Name" name="contactName" value={formData.contactName} onChange={handleChange} required />
              )}
              
              {role === 'SUPPLIER' && (
                <>
                  <Input label="Location (Country)" name="location" value={formData.location} onChange={handleChange} required />
                  <Input label="Years in Business" type="number" name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleChange} required />
                </>
              )}
            </div>

            <Button type="submit" variant="secondary" size="lg" fullWidth disabled={loading}>
              {loading ? 'Registering...' : `Register as ${role === 'BUYER' ? 'Buyer' : 'Supplier'}`}
            </Button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-6)', fontSize: '0.875rem' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--color-primary-navy)', fontWeight: 600 }}>Log In</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
