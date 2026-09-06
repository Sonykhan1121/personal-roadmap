'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Cloud,
  CloudOff,
  Code2,
  Compass,
  Flag,
  GitBranch,
  Layers3,
  LoaderCircle,
  Minus,
  RefreshCw,
  Save,
  Settings2,
  Sparkles,
  Target,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { AuthDialog } from '@/components/auth-dialog';
import { ScheduleDialog } from '@/components/schedule-dialog';
import { isCloudConfigured } from '@/lib/supabase';
import { phases, topics } from '@/lib/roadmap';
import {
  emptyEntry,
  localDate,
  phaseDates,
  statusLabels,
  statuses,
  summarize,
  type LearningStatus,
  type ProgressEntry,
} from '@/lib/progress';
import { useRoadmap } from '@/hooks/use-roadmap';
import { useRoadmapTools } from '@/hooks/use-roadmap-tools';

export default function Home() {
  const roadmap = useRoadmap();
  const { user, entries, settings, ready, syncing, error, refresh, saveEntry } =
    roadmap;
  const [phaseId, setPhaseId] = useState('flutter');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProgressEntry>(emptyEntry(''));
  const [baseline, setBaseline] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const previousUser = useRef<string | null>(null);
  const selected = topics.find((t) => t.id === selectedId);
  const selectedPhase = phases.find((p) => p.id === selected?.phase);
  const dirty = !!selected && JSON.stringify(draft) !== baseline;
  const overall = summarize(
    topics.map((t) => t.id),
    entries,
  );
  const nextTopic =
    topics.find((t) =>
      ['learning', 'practicing'].includes(entries[t.id]?.status ?? ''),
    ) ??
    topics.find(
      (t) => !entries[t.id] || entries[t.id].status === 'not_started',
    );
  const dueTopics = topics.filter(
    (t) =>
      entries[t.id]?.review_date && entries[t.id].review_date! <= localDate(),
  );
  const openTopic = useCallback(
    (id: string) => {
      const topic = topics.find((t) => t.id === id);
      if (!topic) return;
      if (dirty)
        throw new Error(
          'Save or close the current topic before opening another.',
        );
      const value = entries[id] ?? emptyEntry(id);
      setDraft({ ...value, checked_steps: [...value.checked_steps] });
      setBaseline(JSON.stringify(value));
      setSaveMessage('');
      setPhaseId(topic.phase);
      setSelectedId(id);
    },
    [entries, dirty],
  );
  useRoadmapTools(entries, openTopic, saveEntry);
  useEffect(() => {
    if (previousUser.current && previousUser.current !== user?.id) {
      setSelectedId(null);
      setDraft(emptyEntry(''));
      setBaseline('');
      setDiscardOpen(false);
    }
    previousUser.current = user?.id ?? null;
  }, [user?.id]);
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [dirty]);
  const setField = <K extends keyof ProgressEntry>(
    key: K,
    value: ProgressEntry[K],
  ) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaveMessage('');
  };
  async function save() {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setSaving(true);
    setSaveMessage('');
    try {
      const value = await saveEntry(draft);
      setDraft(value);
      setBaseline(JSON.stringify(value));
      setSaveMessage('Saved. Available on your other devices.');
    } catch (e) {
      setSaveMessage(
        e instanceof Error
          ? e.message
          : 'Could not save. Your changes are still here; try again.',
      );
    } finally {
      setSaving(false);
    }
  }
  function exportBackup() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            format: 'nextchapter-progress',
            version: 1,
            exported_at: new Date().toISOString(),
            settings,
            progress: Object.values(entries),
          },
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nextchapter-progress-${localDate()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function closeTopic() {
    if (saving) return;
    if (dirty) {
      setDiscardOpen(true);
      return;
    }
    setSelectedId(null);
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to roadmap
      </a>
      <header className="topbar">
        <a href="#main" className="brand">
          <span className="brand-icon">
            <GitBranch size={23} />
          </span>
          <span>
            nextchapter<span className="brand-dot">.</span>
          </span>
          <span className="personal-label">MY ROADMAP</span>
        </a>
        <div className="header-actions">
          {user ? (
            <>
              <output className="sync-label">
                {error ? (
                  <CloudOff size={17} />
                ) : syncing ? (
                  <LoaderCircle size={17} className="spinning" />
                ) : (
                  <Cloud size={17} />
                )}{' '}
                {error
                  ? 'Sync needs attention'
                  : syncing
                    ? 'Syncing…'
                    : 'Cloud connected'}
              </output>
              <button
                className="header-button"
                aria-label="Account and learning schedule"
                onClick={() => setScheduleOpen(true)}
              >
                <Settings2 size={18} />
                <span>My schedule</span>
              </button>
            </>
          ) : (
            <button
              className="header-button signin-button"
              disabled={!ready}
              onClick={() => setAuthOpen(true)}
            >
              <Cloud size={17} />
              {!isCloudConfigured
                ? 'Cloud setup pending'
                : ready
                  ? 'Sign in to sync'
                  : 'Loading…'}
            </button>
          )}
        </div>
      </header>
      <main id="main" className="workspace">
        <div className="page-heading">
          <div>
            <div className="eyebrow">
              <Compass size={15} /> YOUR NEXT 24 MONTHS
            </div>
            <h1>My learning roadmap</h1>
            <p>
              Flutter developer <span>→</span> mobile / full-stack engineer{' '}
              <span>→</span> build with AI
            </p>
          </div>
          <div className="overall-progress">
            <span className="progress-number">
              {overall.percent}
              <span>%</span>
            </span>
            <div>
              <strong>
                {overall.done} of {overall.total} topics completed
              </strong>
              <p>
                {overall.active
                  ? `${overall.active} in progress · Keep going.`
                  : 'Build on your 1.5+ years of Flutter.'}
              </p>
              <Progress
                value={overall.percent}
                aria-label="Overall completion"
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="sync-error" role="alert">
            <CloudOff size={18} />
            <span>{error}</span>
            <button onClick={() => void refresh()} disabled={syncing}>
              <RefreshCw size={15} /> Retry sync
            </button>
          </div>
        )}
        {!user && (
          <div className="guest-notice">
            <span>
              <Cloud size={17} />{' '}
              {isCloudConfigured
                ? 'Explore your roadmap. Sign in to save checklists, notes, and progress across devices.'
                : 'Your roadmap is ready to explore. Saving and device sync will unlock once cloud setup is complete.'}
            </span>
            <button onClick={() => setAuthOpen(true)}>
              {isCloudConfigured ? 'Connect my progress' : 'Connection status'}{' '}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
        <Tabs
          value={phaseId}
          onValueChange={(value) => {
            setPhaseId(String(value));
            setFilter('all');
          }}
          className="phase-tabs"
        >
          <TabsList className="phase-rail" aria-label="Learning phases">
            {phases.map((phase, index) => {
              const summary = summarize(
                topics.filter((t) => t.phase === phase.id).map((t) => t.id),
                entries,
              );
              return (
                <TabsTrigger
                  key={phase.id}
                  value={phase.id}
                  className="phase-tab"
                >
                  <span
                    className={`phase-index ${summary.percent === 100 ? 'finished' : ''}`}
                  >
                    {summary.percent === 100 ? (
                      <Check size={16} />
                    ) : (
                      String(index + 1).padStart(2, '0')
                    )}
                  </span>
                  <span>
                    <strong>{phase.shortTitle}</strong>
                    <small>
                      {phase.period}
                      <span className="phase-count">
                        {summary.done}/{summary.total}
                      </span>
                    </small>
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {phases.map((phase, index) => {
            const phaseTopics = topics.filter((t) => t.phase === phase.id);
            const stats = summarize(
              phaseTopics.map((t) => t.id),
              entries,
            );
            const visibleTopics = phaseTopics.filter(
              (t) =>
                filter === 'all' ||
                (filter === 'active' &&
                  ['learning', 'practicing'].includes(
                    entries[t.id]?.status ?? '',
                  )) ||
                (filter === 'done' && entries[t.id]?.status === 'done'),
            );
            return (
              <TabsContent
                key={phase.id}
                value={phase.id}
                className="phase-content"
              >
                <div className="learning-layout">
                  <section
                    className="roadmap-board"
                    aria-label={`${phase.shortTitle} roadmap`}
                  >
                    <div className="board-topline">
                      <span>
                        <span className="live-dot" />
                        {stats.done} OF {stats.total} COMPLETED
                      </span>
                      <span>
                        {settings.start_date
                          ? phaseDates(settings.start_date, index)
                          : phase.period}
                      </span>
                    </div>
                    <div className="phase-intro">
                      <span className="phase-kicker">
                        PHASE {String(index + 1).padStart(2, '0')} ·{' '}
                        {phase.period.toUpperCase()}
                      </span>
                      <h2>{phase.title}</h2>
                      <p>{phase.description}</p>
                      <div className="phase-meta">
                        <span>
                          <Clock3 size={14} />
                          {phaseTopics.reduce(
                            (sum, t) => sum + t.hours,
                            0,
                          )}{' '}
                          estimated hours
                        </span>
                        <span>
                          <Flag size={14} />1 practical milestone
                        </span>
                      </div>
                    </div>
                    <div className="board-controls">
                      <Tabs
                        value={filter}
                        onValueChange={(v) => setFilter(String(v))}
                      >
                        <TabsList
                          className="filter-tabs"
                          aria-label="Topic filter"
                        >
                          <TabsTrigger value="all">All topics</TabsTrigger>
                          <TabsTrigger value="active">In progress</TabsTrigger>
                          <TabsTrigger value="done">Completed</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="sr-only">
                          All topics shown below
                        </TabsContent>
                        <TabsContent value="active" className="sr-only">
                          In-progress topics shown below
                        </TabsContent>
                        <TabsContent value="done" className="sr-only">
                          Completed topics shown below
                        </TabsContent>
                      </Tabs>
                      <div className="graph-help">
                        <BookOpen size={14} /> Click a topic to explore
                      </div>
                    </div>
                    <div className="graph">
                      <div className="graph-root">
                        <Layers3 size={18} />
                        {phase.shortTitle}
                      </div>
                      <div className="topic-grid">
                        {visibleTopics.map((topic) => {
                          const status =
                            entries[topic.id]?.status ?? 'not_started';
                          const step = phaseTopics.indexOf(topic) + 1;
                          return (
                            <button
                              className={`topic-node ${topic.project ? 'project-node' : ''} status-${status}`}
                              key={topic.id}
                              onClick={() => openTopic(topic.id)}
                              aria-label={`${topic.title}: ${statusLabels[status]}`}
                            >
                              <span className="node-top">
                                <span className="node-kind">
                                  {topic.project ? (
                                    <Flag size={15} />
                                  ) : (
                                    <Code2 size={15} />
                                  )}{' '}
                                  {topic.project
                                    ? 'BUILD & PROVE'
                                    : `SKILL ${String(step).padStart(2, '0')}`}
                                </span>
                                <span
                                  className={`node-status ${status}`}
                                  aria-hidden="true"
                                >
                                  {status === 'done' ? (
                                    <Check size={12} />
                                  ) : status === 'skipped' ? (
                                    <Minus size={12} />
                                  ) : null}
                                </span>
                              </span>
                              <strong>{topic.title}</strong>
                              <p>{topic.summary}</p>
                              <span className="node-bottom">
                                <span>
                                  <Clock3 size={14} />
                                  {topic.hours} hours
                                </span>
                                <span className="node-state-label">
                                  {statusLabels[status]}
                                  <ChevronRight size={15} />
                                </span>
                              </span>
                            </button>
                          );
                        })}
                        {!visibleTopics.length && (
                          <div className="empty-topics">
                            <BookOpen size={25} />
                            <strong>
                              {filter === 'done'
                                ? 'Your completed topics will appear here.'
                                : 'No topics in progress in this phase yet.'}
                            </strong>
                            <button
                              className="text-button"
                              onClick={() => setFilter('all')}
                            >
                              Explore all topics <ArrowRight size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="graph-end">
                        <Target size={17} />
                        {phase.outcome}
                      </div>
                    </div>
                    {index < phases.length - 1 && (
                      <button
                        className="next-phase"
                        onClick={() => {
                          setPhaseId(phases[index + 1].id);
                          setFilter('all');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Next: {phases[index + 1].shortTitle}
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </section>
                  <aside className="focus-column">
                    {nextTopic && (
                      <button
                        className="continue-card"
                        onClick={() => openTopic(nextTopic.id)}
                      >
                        <span className="eyebrow">
                          <Compass size={15} />
                          {overall.active
                            ? 'PICK UP WHERE YOU LEFT OFF'
                            : 'A GOOD PLACE TO START'}
                        </span>
                        <strong>{nextTopic.title}</strong>
                        <span>
                          Open topic <ArrowRight size={16} />
                        </span>
                      </button>
                    )}
                    <div className="focus-card">
                      <span className="eyebrow">
                        <Sparkles size={15} /> YOUR FOCUS
                      </span>
                      <h3>{phase.focus}</h3>
                      <p>{phase.focusNote}</p>
                      <div className="focus-divider" />
                      <span className="eyebrow">A SUSTAINABLE PACE</span>
                      <div className="weekly-hours">
                        {settings.weekly_hours}
                        <span> hours / week</span>
                      </div>
                      <div className="rhythm">
                        <span>Build & practice</span>
                        <strong>60%</strong>
                        <span>Learn the concepts</span>
                        <strong>25%</strong>
                        <span>Review & explain</span>
                        <strong>15%</strong>
                      </div>
                      <button
                        className="text-button schedule-link"
                        onClick={() =>
                          user ? setScheduleOpen(true) : setAuthOpen(true)
                        }
                      >
                        Adjust my schedule <Settings2 size={14} />
                      </button>
                    </div>
                    {dueTopics.length > 0 && (
                      <div className="review-card">
                        <span className="eyebrow">READY TO REVISIT</span>
                        {dueTopics.map((t) => (
                          <button key={t.id} onClick={() => openTopic(t.id)}>
                            {t.title}
                            <ChevronRight size={16} />
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="note-card">
                      <span className="note-icon">
                        <Check size={17} />
                      </span>
                      <h3>Already know a topic?</h3>
                      <p>
                        Use its checklist to check your understanding, then mark
                        it complete. Your experience counts.
                      </p>
                    </div>
                    <a
                      className="reference-link"
                      href="https://roadmap.sh/flutter"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Inspired by roadmap.sh <ArrowUpRight size={15} />
                    </a>
                  </aside>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </main>
      <footer className="footer">
        Made for your next chapter.
        <span>
          {overall.done} completed · {overall.active} in progress ·{' '}
          {overall.skipped} skipped
        </span>
      </footer>
      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) closeTopic();
        }}
      >
        <SheetContent className="topic-sheet">
          {selected && (
            <>
              <SheetHeader>
                <div className="eyebrow">
                  {selectedPhase?.shortTitle} · {selected.hours} HOURS
                </div>
                <SheetTitle>{selected.title}</SheetTitle>
                <SheetDescription>{selected.summary}</SheetDescription>
              </SheetHeader>
              <fieldset
                className="sheet-body"
                disabled={saving}
                aria-label="Topic progress and notes"
              >
                <h3>My progress</h3>
                <RadioGroup
                  value={draft.status}
                  onValueChange={(v) => setField('status', v as LearningStatus)}
                  className="status-options"
                  aria-label="Learning status"
                >
                  {statuses.map((status) => (
                    <label
                      className={`status-option ${draft.status === status ? 'selected' : ''}`}
                      key={status}
                    >
                      <RadioGroupItem value={status} />
                      <span>{statusLabels[status]}</span>
                    </label>
                  ))}
                </RadioGroup>
                <h3>
                  What to practice{' '}
                  <span className="check-count">
                    {draft.checked_steps.length}/{selected.steps.length}
                  </span>
                </h3>
                <div className="practice-checks">
                  {selected.steps.map((step, i) => (
                    <label
                      key={step}
                      className={
                        draft.checked_steps.includes(i) ? 'checked' : ''
                      }
                    >
                      <Checkbox
                        checked={draft.checked_steps.includes(i)}
                        onCheckedChange={(checked) =>
                          setField(
                            'checked_steps',
                            checked
                              ? [...draft.checked_steps, i]
                              : draft.checked_steps.filter((n) => n !== i),
                          )
                        }
                      />
                      <span>{step}</span>
                    </label>
                  ))}
                </div>
                <h3>Know it when you can…</h3>
                <p className="proof-box">{selected.proof}</p>
                <h3>Start learning</h3>
                {selected.resources.map((r) => (
                  <a
                    className="resource-link"
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>
                      {r.title}
                      <small>{new URL(r.url).hostname}</small>
                    </span>
                    <ArrowUpRight size={19} />
                  </a>
                ))}
                <label className="field-label" htmlFor="topic-notes">
                  My notes
                </label>
                <Textarea
                  id="topic-notes"
                  value={draft.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  maxLength={20000}
                  placeholder="What did I learn? What was difficult? What should I revisit?"
                  rows={5}
                />
                <label className="field-label" htmlFor="project-link">
                  Project or evidence link <span>optional</span>
                </label>
                <Input
                  id="project-link"
                  type="url"
                  value={draft.evidence_url}
                  onChange={(e) => setField('evidence_url', e.target.value)}
                  maxLength={2048}
                  placeholder="https://github.com/…"
                />
                <label className="field-label" htmlFor="review-date">
                  Revisit on <span>optional</span>
                </label>
                <Input
                  id="review-date"
                  type="date"
                  value={draft.review_date ?? ''}
                  onChange={(e) =>
                    setField('review_date', e.target.value || null)
                  }
                />
                <p className="field-help">
                  Appears in your review list on this date. No email
                  notification.
                </p>
              </fieldset>
              <div className="sheet-save">
                <output
                  className={
                    saveMessage && dirty ? 'save-warning' : 'save-feedback'
                  }
                >
                  {saving
                    ? 'Saving to your private account…'
                    : saveMessage ||
                      (dirty
                        ? 'Unsaved changes'
                        : user
                          ? 'Your changes will sync across devices.'
                          : 'Sign in to keep your progress and notes.')}
                </output>
                <button
                  className="primary-button"
                  disabled={saving || (!!user && !dirty)}
                  onClick={() => void save()}
                >
                  {saving ? (
                    <LoaderCircle size={17} className="spinning" />
                  ) : user ? (
                    <Save size={17} />
                  ) : (
                    <Cloud size={17} />
                  )}{' '}
                  {saving
                    ? 'Saving…'
                    : user
                      ? 'Save progress'
                      : 'Sign in to save'}
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <AuthDialog open={authOpen && !user} onOpenChange={setAuthOpen} />
      {scheduleOpen && (
        <ScheduleDialog
          open={scheduleOpen}
          onOpenChange={setScheduleOpen}
          settings={settings}
          email={user?.email ?? ''}
          onSave={roadmap.saveSettings}
          onExport={exportBackup}
          onSignOut={roadmap.signOut}
        />
      )}
      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Keep your changes?</AlertDialogTitle>
          <AlertDialogDescription>
            Your latest edits have not been saved. Keep editing to save them, or
            discard this draft.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setDiscardOpen(false);
                setSelectedId(null);
                setDraft(emptyEntry(''));
                setBaseline('');
              }}
            >
              Discard draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
