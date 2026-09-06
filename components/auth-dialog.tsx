'use client';
import { useEffect, useState } from 'react';
import { Cloud, Mail, ArrowRight, LoaderCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getSupabase, isCloudConfigured } from '@/lib/supabase';

export function AuthDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);
  async function sendCode() {
    const db = getSupabase();
    if (!db) {
      setError(
        'Cloud sign-in is still being connected. You can explore every topic meanwhile.',
      );
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { error } = await db.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setSent(true);
      setCooldown(60);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Could not send your sign-in code. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function verifyCode() {
    const db = getSupabase();
    if (!db) return;
    setBusy(true);
    setError('');
    try {
      const { data, error } = await db.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: 'email',
      });
      if (error) throw error;
      if (!data.session)
        throw new Error('Sign-in did not complete. Request a new code.');
      setCode('');
      setSent(false);
      onOpenChange(false);
      onSuccess();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'That code did not work. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!busy) onOpenChange(value);
      }}
    >
      <DialogContent className="auth-dialog">
        <DialogHeader>
          <div className="modal-icon">
            <Cloud size={24} />
          </div>
          <DialogTitle>Your progress, everywhere.</DialogTitle>
          <DialogDescription>
            Sign in with the same email on your phone and computer. Your notes
            and progress stay private to your account.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void (sent ? verifyCode() : sendCode());
          }}
          className="auth-form"
        >
          <label htmlFor="signin-email">Email address</label>
          {!isCloudConfigured && (
            <p className="form-message">
              Cloud setup is pending. You can read every topic now; changes will
              not be saved until your account is connected.
            </p>
          )}
          <Input
            id="signin-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={sent}
            disabled={!isCloudConfigured}
            maxLength={254}
          />
          {sent && (
            <>
              <div className="email-notice">
                <Mail size={18} />
                <span>
                  Check your inbox for a sign-in code. It may take a moment.
                </span>
              </div>
              <label htmlFor="signin-code">Email code</label>
              <Input
                id="signin-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter your code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                pattern="[0-9]{6,10}"
                minLength={6}
                maxLength={10}
                required
              />
            </>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="primary-button"
            disabled={busy || !isCloudConfigured}
          >
            {busy ? <LoaderCircle size={17} className="spinning" /> : null}
            {sent ? 'Verify & sign in' : 'Email me a sign-in code'}
            {!busy && <ArrowRight size={17} />}
          </button>
          {sent && (
            <div className="auth-actions">
              <button
                type="button"
                className="text-button"
                disabled={busy}
                onClick={() => {
                  setSent(false);
                  setCode('');
                  setError('');
                }}
              >
                Use another email
              </button>
              <button
                type="button"
                className="text-button"
                disabled={busy || cooldown > 0}
                onClick={() => void sendCode()}
              >
                {cooldown ? `Resend in ${cooldown}s` : 'Resend code'}
              </button>
            </div>
          )}
        </form>
        <p className="modal-footnote">
          A free personal tracker. No subscription or payment details.
        </p>
      </DialogContent>
    </Dialog>
  );
}
