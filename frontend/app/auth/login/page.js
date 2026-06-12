'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setUser);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authAPI.login({ email, password });

      // Store token
      localStorage.setItem('token', data.token);

      // Update store
      setAuth(data.user, data.token);

      toast.success('Connexion réussie!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cameroon-green to-cameroon-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-cameroon-green mb-6 text-center">
          From Mboa
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-cameroon-dark font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cameroon-green"
              required
            />
          </div>

          <div>
            <label className="block text-cameroon-dark font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cameroon-green"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cameroon-green text-white py-2 rounded-lg hover:bg-cameroon-dark transition disabled:opacity-50"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center mt-4 text-cameroon-dark">
          Pas encore de compte?{' '}
          <Link href="/auth/register" className="text-cameroon-gold hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
