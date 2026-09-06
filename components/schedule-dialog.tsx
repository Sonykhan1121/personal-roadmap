'use client';
import { useState } from 'react';
import { CalendarDays, Download, LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Settings } from '@/lib/progress';
export function ScheduleDialog({
  open,
  onOpenChange,
  settings,
  email,
  onSave,
  onExport,
  onSignOut,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Settings;
  email: string;
  onSave: (s: Settings) => Promise<void>;
  onExport: () => void;
  onSignOut: () => Promise<void>;
}) {
  const [draft, setDraft] = useState(settings);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!busy) onOpenChange(v);
      }}
    >
      <DialogContent className="auth-dialog">
        <DialogHeader>
          <div className="modal-icon">
            <CalendarDays size={23} />
          </div>
          <DialogTitle>Your learning schedule</DialogTitle>
          <DialogDescription>
            Dates are a guide. Adjust your pace to fit your life.
          </DialogDescription>
        </DialogHeader>
        <form
          className="auth-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setMessage('');
            try {
              await onSave(draft);
              setMessage('Schedule saved across your devices.');
            } catch (error) {
              setMessage(
                error instanceof Error
                  ? error.message
                  : 'Could not save. Please try again.',
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <label htmlFor="start-date">Roadmap start date</label>
          <Input
            id="start-date"
            type="date"
            value={draft.start_date}
            required
            onChange={(e) => setDraft({ ...draft, start_date: e.target.value })}
          />
          <label htmlFor="weekly-hours">Study hours per week</label>
          <Input
            id="weekly-hours"
            type="number"
            min={1}
            max={40}
            required
            value={draft.weekly_hours}
            onChange={(e) =>
              setDraft({ ...draft, weekly_hours: Number(e.target.value) })
            }
          />
          <button disabled={busy} className="primary-button">
            {busy ? 'Saving…' : 'Save schedule'}
          </button>
          {message && <output className="form-message">{message}</output>}
        </form>
        <div className="account-footer">
          <span>{email}</span>
          <button className="secondary-button" onClick={onExport}>
            <Download size={16} /> Export progress backup
          </button>
          <button
            className="text-button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onSignOut();
                onOpenChange(false);
              } catch (e) {
                setMessage(
                  e instanceof Error ? e.message : 'Could not sign out.',
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            <LogOut size={16} /> Sign out on this device
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
