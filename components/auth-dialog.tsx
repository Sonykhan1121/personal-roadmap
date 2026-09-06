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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function sendLink() {
    const db = getSupabase();
    if (!db) {
      setError('Cloud sign-in is still being connected.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { error } = await db.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: 'https://sonykhan1121.github.io/personal-roadmap/',
        },
      });
      if (error) throw error;
      setSent(true);
      setCooldown(60);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Could not send your sign-in link. Please try again.',
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
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            void sendLink();
          }}
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
            disabled={!isCloudConfigured || busy}
            maxLength={254}
          />
          {sent && (
            <div className="email-notice">
              <Mail size={18} />
              <span>
                Check your inbox and spam folder. Open the newest sign-in link
                on the device you want to use. Each link works once.
              </span>
            </div>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="primary-button"
            disabled={busy || !isCloudConfigured || cooldown > 0}
          >
            {busy && <LoaderCircle size={17} className="spinning" />}
            {cooldown
              ? `Resend in ${cooldown}s`
              : sent
                ? 'Resend sign-in link'
                : 'Email me a sign-in link'}
            {!busy && !cooldown && <ArrowRight size={17} />}
          </button>
          {sent && (
            <button
              type="button"
              className="text-button"
              disabled={busy}
              onClick={() => {
                setSent(false);
                setError('');
              }}
            >
              Use another email
            </button>
          )}
        </form>
        <p className="modal-footnote">
          Use the email associated with your Supabase account. This personal
          tracker uses the free email service for project members.
        </p>
      </DialogContent>
    </Dialog>
  );
}
