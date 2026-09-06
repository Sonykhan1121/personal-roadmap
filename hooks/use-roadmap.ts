'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabase, isCloudConfigured } from '@/lib/supabase';
import {
  isDateString,
  localDate,
  validateEntry,
  type ProgressEntry,
  type Settings,
} from '@/lib/progress';
import { topics } from '@/lib/roadmap';

export function useRoadmap() {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<Record<string, ProgressEntry>>({});
  const [settings, setSettings] = useState<Settings>({
    weekly_hours: 10,
    start_date: '',
  });
  const [ready, setReady] = useState(!isCloudConfigured);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const userRef = useRef<string | null>(null);
  const readVersion = useRef(0);
  useEffect(() => {
    const db = getSupabase();
    if (!db) return;
    let live = true;
    const receiveSession = (nextUser: User | null) => {
      if (!live) return;
      const uid = nextUser?.id ?? null;
      if (userRef.current !== uid) {
        userRef.current = uid;
        readVersion.current++;
        setEntries({});
        setLastSync(null);
        setSettings({ weekly_hours: 10, start_date: localDate() });
        setSyncing(false);
        setError('');
      }
      setUser(nextUser);
      setReady(true);
    };
    db.auth
      .getSession()
      .then(({ data, error }) => {
        if (live) {
          receiveSession(data.session?.user ?? null);
          if (error) setError(error.message);
        }
      })
      .catch(() => {
        if (live) {
          setReady(true);
          setError('Could not restore your sign-in. Please try again.');
        }
      });
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_event, session) => {
      receiveSession(session?.user ?? null);
    });
    return () => {
      live = false;
      subscription.unsubscribe();
    };
  }, []);
  const refresh = useCallback(async () => {
    const db = getSupabase();
    const uid = user?.id;
    if (!db || !uid) return;
    const version = ++readVersion.current;
    setSyncing(true);
    try {
      const [p, s] = await Promise.all([
        db
          .from('roadmap_progress')
          .select(
            'topic_id,status,checked_steps,notes,evidence_url,review_date,updated_at',
          )
          .eq('user_id', uid),
        db
          .from('roadmap_settings')
          .select('weekly_hours,start_date')
          .eq('user_id', uid)
          .maybeSingle(),
      ]);
      if (p.error) throw p.error;
      if (s.error) throw s.error;
      if (userRef.current !== uid || readVersion.current !== version) return;
      const known = new Set(topics.map((t) => t.id));
      setEntries(
        Object.fromEntries(
          (p.data ?? [])
            .filter((row) => known.has(row.topic_id))
            .map((row) => [row.topic_id, row as ProgressEntry]),
        ),
      );
      if (s.data) setSettings(s.data);
      setLastSync(new Date());
      setError('');
    } catch (e) {
      if (userRef.current === uid && readVersion.current === version)
        setError(
          e instanceof Error
            ? e.message
            : 'Could not sync your progress. Your saved data is still in the cloud.',
        );
    } finally {
      if (userRef.current === uid && readVersion.current === version)
        setSyncing(false);
    }
  }, [user?.id]);
  useEffect(() => {
    if (!user?.id) return;
    // oxlint-disable-next-line react/react-compiler -- An authentication change starts an external database fetch, including its loading state.
    void refresh();
    const onFocus = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    const interval = window.setInterval(onFocus, 30000);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
      window.clearInterval(interval);
    };
  }, [user?.id, refresh]);
  const saveEntry = useCallback(
    async (raw: ProgressEntry) => {
      const db = getSupabase();
      const uid = user?.id;
      if (!db || !uid)
        throw new Error('Sign in to save your progress across devices.');
      const topic = topics.find((t) => t.id === raw.topic_id);
      if (!topic) throw new Error('Unknown topic.');
      const value = validateEntry(raw, topic.steps.length);
      const { updated_at, ...fields } = value;
      readVersion.current++;
      setSyncing(false);
      let query;
      if (updated_at) {
        query = db
          .from('roadmap_progress')
          .update(fields)
          .eq('user_id', uid)
          .eq('topic_id', raw.topic_id)
          .eq('updated_at', updated_at)
          .select(
            'topic_id,status,checked_steps,notes,evidence_url,review_date,updated_at',
          )
          .maybeSingle();
      } else {
        query = db
          .from('roadmap_progress')
          .insert({ ...fields, user_id: uid })
          .select(
            'topic_id,status,checked_steps,notes,evidence_url,review_date,updated_at',
          )
          .single();
      }
      const { data, error } = await query;
      if (error) {
        if (error.code === '23505')
          throw new Error(
            'This topic changed on another device. Close this panel, refresh, and reopen it before saving.',
          );
        throw new Error(error.message);
      }
      if (!data)
        throw new Error(
          'This topic changed on another device. Keep a copy of your notes, then close, refresh, and reopen it.',
        );
      if (userRef.current !== uid)
        throw new Error(
          'Your sign-in changed. Reopen the topic to see its saved state.',
        );
      readVersion.current++;
      setEntries((prev) => ({
        ...prev,
        [data.topic_id]: data as ProgressEntry,
      }));
      setLastSync(new Date());
      setSyncing(false);
      setError('');
      return data as ProgressEntry;
    },
    [user?.id],
  );
  const saveSettings = useCallback(
    async (value: Settings) => {
      const db = getSupabase();
      const uid = user?.id;
      if (!db || !uid)
        throw new Error('Sign in to save your learning schedule.');
      if (
        !Number.isInteger(value.weekly_hours) ||
        value.weekly_hours < 1 ||
        value.weekly_hours > 40
      )
        throw new Error('Choose between 1 and 40 hours per week.');
      if (!isDateString(value.start_date))
        throw new Error('Choose a valid start date.');
      const { error } = await db
        .from('roadmap_settings')
        .upsert({ ...value, user_id: uid });
      if (error) throw new Error(error.message);
      if (userRef.current === uid) {
        readVersion.current++;
        setSettings(value);
        setSyncing(false);
        setLastSync(new Date());
      }
    },
    [user?.id],
  );
  const signOut = async () => {
    const db = getSupabase();
    if (!db) return;
    const { error } = await db.auth.signOut({ scope: 'local' });
    if (error) throw new Error(error.message);
    setUser(null);
    setEntries({});
  };
  return {
    user,
    entries,
    settings,
    ready,
    syncing,
    error,
    lastSync,
    refresh,
    saveEntry,
    saveSettings,
    signOut,
  };
}
