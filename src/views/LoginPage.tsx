'use client';

import { FormEvent, useState } from 'react';
import { Link } from '@/components/nav/NextNav';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { AuthShell } from '../components/auth/AuthShell';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { Seo } from '../components/Seo';
import { LOGIN_SEO } from '../lib/seo';
import { signIn } from '@/lib/actions/auth';

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = (path = '/dashboard') => {
    setSuccess(true);
    window.setTimeout(() => router.replace(path), 600);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const result = await signIn({ email, password });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      finish(result.redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo page={LOGIN_SEO} />
      <AuthShell
        title="Welcome back"
        subtitle="Log in to your ComplianceEasily workspace — passport, alerts and filings in one place."
      >
      {success ? (
        <div className="rounded-2xl border border-[#D5D0C6] bg-[#EBE8E2] p-5 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#B89E6B] shrink-0" />
          <div>
            <div className="font-semibold text-[#0E1217]">You&apos;re signed in</div>
            <p className="text-sm text-[#5C6570]">Redirecting to your dashboard…</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <GoogleAuthButton label="Continue with Google" onSuccess={() => finish('/dashboard')} />

          <div className="flex items-center gap-3 text-[11px] font-mono font-bold uppercase tracking-wider text-[#6B7580]">
            <div className="h-px flex-1 bg-[#D5D0C6]" />
            <span>or email</span>
            <div className="h-px flex-1 bg-[#D5D0C6]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#0E1217] mb-1.5 font-mono uppercase tracking-wider">
                Work email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-elevated w-full rounded-xl px-4 py-3 text-sm text-[#0E1217] placeholder:text-[#6B7580]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-[#0E1217] font-mono uppercase tracking-wider">
                  Password
                </label>
                <button type="button" className="text-xs font-medium text-[#B89E6B] hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-elevated w-full rounded-xl px-4 py-3 pr-11 text-sm text-[#0E1217] placeholder:text-[#6B7580]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6B7580] hover:text-[#0E1217]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full btn-primary py-3.5 disabled:opacity-70">
              {submitting ? 'Signing in…' : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-center text-[#5C6570]">
            New here?{' '}
            <Link to="/signup" className="font-semibold text-[#B89E6B] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      )}
      </AuthShell>
    </>
  );
}
