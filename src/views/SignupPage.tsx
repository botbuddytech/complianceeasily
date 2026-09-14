'use client';

import { FormEvent, useState } from 'react';
import { Link } from '@/components/nav/NextNav';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { AuthShell } from '../components/auth/AuthShell';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { Seo } from '../components/Seo';
import { SIGNUP_SEO } from '../lib/seo';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = () => {
    setSuccess(true);
    window.setTimeout(() => router.replace('/dashboard'), 600);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || !agree) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, role: 'client_user' } },
        });
        if (authError) throw authError;
        finish();
      } else {
        window.setTimeout(() => finish(), 400);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo page={SIGNUP_SEO} />
      <AuthShell
        title="Create your account"
        subtitle="Start free — one entity WhatsApp radar forever. Upgrade when you need managed filings."
      >
      {success ? (
        <div className="rounded-2xl border border-[#D5D0C6] bg-[#EBE8E2] p-5 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#B89E6B] shrink-0" />
          <div>
            <div className="font-semibold text-[#0E1217]">Account ready</div>
            <p className="text-sm text-[#5C6570]">Redirecting to your dashboard…</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <GoogleAuthButton label="Sign up with Google" onSuccess={finish} />

          <div className="flex items-center gap-3 text-[11px] font-mono font-bold uppercase tracking-wider text-[#6B7580]">
            <div className="h-px flex-1 bg-[#D5D0C6]" />
            <span>or email</span>
            <div className="h-px flex-1 bg-[#D5D0C6]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-xs font-semibold text-[#0E1217] mb-1.5 font-mono uppercase tracking-wider">
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Priya Sharma"
                className="input-elevated w-full rounded-xl px-4 py-3 text-sm text-[#0E1217] placeholder:text-[#6B7580]"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold text-[#0E1217] mb-1.5 font-mono uppercase tracking-wider">
                Work email
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="block text-xs font-semibold text-[#0E1217] mb-1.5 font-mono uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
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

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 rounded border-[#D5D0C6] text-[#B89E6B] focus:ring-[#B89E6B]/30"
                required
              />
              <span className="text-xs text-[#5C6570] leading-relaxed">
                I agree to the{' '}
                <button type="button" className="font-semibold text-[#B89E6B] hover:underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="font-semibold text-[#B89E6B] hover:underline">
                  Privacy Policy
                </button>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting || !agree}
              className="w-full btn-primary py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-center text-[#5C6570]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#B89E6B] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      )}
      </AuthShell>
    </>
  );
}
