'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { api } from '../../lib/api';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Firebase Login
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await userCredential.user.getIdToken();
      
      localStorage.setItem('auth_token', token);
      
      // 2. Fetch User Profile from Backend to determine role
      const res: any = await api.getMe();
      const role = res.user.role.toLowerCase();
      
      // 3. Redirect
      router.push(`/dashboard/${role}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: 'var(--spacing-16) var(--spacing-4)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-navy)' }}>
          Welcome Back
        </h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: 'var(--spacing-2)' }}>
          Log in to your GarMer account.
        </p>
      </div>

      <Card>
        <CardContent>
          {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--spacing-4)', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                <input type="checkbox" /> Remember me
              </label>
              <Link href="/forgot-password" style={{ color: 'var(--color-primary-navy)' }}>Forgot password?</Link>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth style={{ marginTop: 'var(--spacing-2)' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-6)', fontSize: '0.875rem' }}>
            Don't have an account? <Link href="/register" style={{ color: 'var(--color-primary-gold)', fontWeight: 600 }}>Sign Up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
