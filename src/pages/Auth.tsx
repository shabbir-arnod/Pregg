import { useState } from 'react';
import { HeartPulse } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Blob } from '../components/Blob';
import { isSupabaseConfigured } from '../lib/supabaseClient';

const emptySignUpForm = { email: '', password: '', firstName: '', lastName: '', phone: '', address: '' };

export function Auth() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState(emptySignUpForm);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-rose-50/40 px-4">
        <div className="max-w-sm text-center space-y-2">
          <Blob size={56} className="mx-auto">
            <HeartPulse size={26} />
          </Blob>
          <h1 className="text-lg font-semibold text-slate-800">Pregg isn't connected to a backend yet</h1>
          <p className="text-sm text-slate-500">
            Accounts need a Supabase project to store data. Add <code>VITE_SUPABASE_URL</code> and{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> as environment variables and redeploy.
          </p>
        </div>
      </div>
    );
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signIn(signInForm.email, signInForm.password);
    setSubmitting(false);
    if (result.error) setError(result.error);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signUp({
      email: signUpForm.email,
      password: signUpForm.password,
      firstName: signUpForm.firstName,
      lastName: signUpForm.lastName,
      phone: signUpForm.phone || undefined,
      address: signUpForm.address || undefined,
    });
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else if (result.needsEmailConfirmation) {
      setConfirmationSent(true);
    }
  }

  if (confirmationSent) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-rose-50/40 px-4">
        <div className="max-w-sm text-center space-y-2">
          <Blob size={56} className="mx-auto">
            <HeartPulse size={26} />
          </Blob>
          <h1 className="text-lg font-semibold text-slate-800">Check your email</h1>
          <p className="text-sm text-slate-500">
            We sent a confirmation link to <strong>{signUpForm.email}</strong>. Confirm it, then sign in below.
          </p>
          <button
            type="button"
            onClick={() => {
              setConfirmationSent(false);
              setMode('signIn');
            }}
            className="text-rose-500 text-sm font-medium"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-rose-50/40 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Blob size={56} className="mx-auto mb-2">
            <HeartPulse size={26} />
          </Blob>
          <h1 className="text-xl font-semibold text-slate-800">Pregg</h1>
          <p className="text-sm text-slate-400">Your pregnancy, tracked and always with you.</p>
        </div>

        <div className="flex rounded-xl bg-rose-50 p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signIn');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'signIn' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signUp');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'signUp' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}
          >
            Create account
          </button>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

        {mode === 'signIn' ? (
          <form onSubmit={handleSignIn} className="space-y-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={signInForm.email}
              onChange={(e) => setSignInForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={signInForm.password}
              onChange={(e) => setSignInForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="First name"
                value={signUpForm.firstName}
                onChange={(e) => setSignUpForm((f) => ({ ...f, firstName: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <input
                type="text"
                required
                placeholder="Last name"
                value={signUpForm.lastName}
                onChange={(e) => setSignUpForm((f) => ({ ...f, lastName: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <input
              type="email"
              required
              placeholder="Email"
              value={signUpForm.email}
              onChange={(e) => setSignUpForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 characters)"
              value={signUpForm.password}
              onChange={(e) => setSignUpForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <input
              type="tel"
              placeholder="Contact number (optional)"
              value={signUpForm.phone}
              onChange={(e) => setSignUpForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <input
              type="text"
              placeholder="Address (optional)"
              value={signUpForm.address}
              onChange={(e) => setSignUpForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg"
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
