'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Cloud,
  CloudOff,
  GitBranch,
  LoaderCircle,
  RefreshCw,
  Save,
  Settings2,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Sheet,
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
import { StudyGuide } from '@/components/study-guide';
import { ResizableTopicSheet } from '@/components/resizable-topic-sheet';
import { isCloudConfigured } from '@/lib/supabase';
import { phases, topics } from '@/lib/roadmap';
import {
  emptyEntry,
  localDate,
  phaseWindow,
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
  const [phaseId, setPhaseId] = useState('dart');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProgressEntry>(emptyEntry(''));
  const [baseline, setBaseline] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [detailTab, setDetailTab] = useState('learn');
  const previousUser = useRef<string | null>(null);
  const selected = topics.find((t) => t.id === selectedId);
  const selectedPhase = phases.find((p) => p.id === selected?.phase);
  const dirty = !!selected && JSON.stringify(draft) !== baseline;
  const overall = summarize(
    topics.map((t) => t.id),
    entries,
  );
  const phase = phases.find((p) => p.id === phaseId) ?? phases[0];
  const phaseIndex = phases.indexOf(phase);
  const phaseTopics = topics.filter((t) => t.phase === phase.id);
  const phaseStats = summarize(
    phaseTopics.map((t) => t.id),
    entries,
  );
  const visibleTopics = phaseTopics.filter(
    (t) =>
      filter === 'all' ||
      (filter === 'active' &&
        ['learning', 'practicing'].includes(entries[t.id]?.status ?? '')) ||
      (filter === 'done' && entries[t.id]?.status === 'done'),
  );
  const nextTopic =
    phaseTopics.find((t) =>
      ['learning', 'practicing'].includes(entries[t.id]?.status ?? ''),
    ) ??
    phaseTopics.find(
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
      setDetailTab('learn');
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
                    : 'Synced'}
              </output>
              <button
                className="header-button"
                aria-label="Account and learning schedule"
                onClick={() => setScheduleOpen(true)}
              >
                <Settings2 size={18} />
                <span>Settings</span>
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
            <h1>My learning roadmap</h1>
            <p>Flutter, full-stack development, and practical AI.</p>
          </div>
          <div className="compact-progress">
            <span>
              <strong>{overall.done}</strong> of {overall.total} completed
            </span>
            <Progress value={overall.percent} aria-label="Overall completion" />
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
        {!user && ready && (
          <p className="guest-hint">
            Sign in to save your progress across devices.
          </p>
        )}
        <section className="learning-stage" aria-labelledby="stage-heading">
          <div className="stage-picker">
            <label htmlFor="phase-jump">Learning stage</label>
            <select
              id="phase-jump"
              value={phaseId}
              onChange={(event) => {
                setPhaseId(event.target.value);
                setFilter('all');
              }}
            >
              {phases.map((p, index) => (
                <option key={p.id} value={p.id}>
                  {index + 1}. {p.shortTitle}
                </option>
              ))}
            </select>
          </div>
          <div className="stage-heading">
            <div className="stage-label">
              <span>
                {phase.optional
                  ? 'Optional stage'
                  : `Stage ${phaseIndex + 1} of ${phases.length}`}
              </span>
              <span>
                {phaseStats.done} / {phaseStats.total} completed
              </span>
            </div>
            <h2 id="stage-heading">{phase.shortTitle}</h2>
            <p>{phase.focus}</p>
            <details className="stage-details" key={phase.id}>
              <summary>About this stage</summary>
              <div>
                <p>{phase.description}</p>
                <p>{phase.focusNote}</p>
                <p>
                  <strong>Goal:</strong> {phase.outcome}
                </p>
                <p>
                  <strong>Suggested timing:</strong>{' '}
                  {settings.start_date && phase.months
                    ? phaseWindow(settings.start_date, ...phase.months)
                    : phase.period}
                </p>
                <p>
                  {phaseTopics.reduce((sum, t) => sum + t.hours, 0)} estimated
                  study hours · Your pace: {settings.weekly_hours} hours / week
                </p>
                <button
                  className="text-button"
                  onClick={() =>
                    user ? setScheduleOpen(true) : setAuthOpen(true)
                  }
                >
                  Adjust schedule <Settings2 size={16} />
                </button>
              </div>
            </details>
          </div>
          {nextTopic ? (
            <div className="next-lesson">
              <div>
                <span>Your next topic</span>
                <strong>{nextTopic.title}</strong>
              </div>
              <button
                className="primary-button"
                onClick={() => openTopic(nextTopic.id)}
              >
                {['learning', 'practicing'].includes(
                  entries[nextTopic.id]?.status ?? '',
                )
                  ? 'Continue learning'
                  : 'Start learning'}
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <p className="stage-finished">
              <Check size={18} /> You’ve worked through this stage. Review a
              topic or explore the next stage.
            </p>
          )}
          <div className="list-heading">
            <h3>
              Topics <span>{phaseTopics.length}</span>
            </h3>
            <label>
              <span className="sr-only">Filter topics</span>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="all">All topics</option>
                <option value="active">In progress</option>
                <option value="done">Completed</option>
              </select>
            </label>
          </div>
          <ol className="topic-list" aria-label={`${phase.shortTitle} topics`}>
            {visibleTopics.map((topic) => {
              const status = entries[topic.id]?.status ?? 'not_started';
              return (
                <li key={topic.id}>
                  <button
                    className={`topic-row status-${status}`}
                    onClick={() => openTopic(topic.id)}
                    aria-label={`${topic.title}: ${statusLabels[status]}`}
                  >
                    <span className="topic-number" aria-hidden="true">
                      {status === 'done' ? (
                        <Check size={18} />
                      ) : (
                        String(phaseTopics.indexOf(topic) + 1).padStart(2, '0')
                      )}
                    </span>
                    <span className="topic-copy">
                      <strong>{topic.title}</strong>
                      <span>
                        {topic.project ? 'Practice project · ' : ''}
                        {topic.hours} hours
                      </span>
                    </span>
                    <span className={`topic-state ${status}`}>
                      {statusLabels[status]}
                    </span>
                    <ChevronRight
                      size={18}
                      className="topic-arrow"
                      aria-hidden="true"
                    />
                  </button>
                </li>
              );
            })}
          </ol>
          {!visibleTopics.length && (
            <div className="empty-topics">
              <p>
                {filter === 'done'
                  ? 'No completed topics in this stage yet.'
                  : 'No topics in progress in this stage yet.'}
              </p>
              <button className="text-button" onClick={() => setFilter('all')}>
                Show all topics <ArrowRight size={16} />
              </button>
            </div>
          )}
          {phaseIndex < phases.length - 1 && (
            <button
              className="next-stage"
              onClick={() => {
                setPhaseId(phases[phaseIndex + 1].id);
                setFilter('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Next stage: {phases[phaseIndex + 1].shortTitle}
              <ArrowRight size={17} />
            </button>
          )}
        </section>
        {dueTopics.length > 0 && (
          <details className="review-list">
            <summary>
              Ready to review <span>{dueTopics.length}</span>
            </summary>
            {dueTopics.map((t) => (
              <button key={t.id} onClick={() => openTopic(t.id)}>
                {t.title}
                <ChevronRight size={17} />
              </button>
            ))}
          </details>
        )}
      </main>
      <footer className="footer">
        <span>Learn at your own pace.</span>
        <a href="https://roadmap.sh/flutter" target="_blank" rel="noreferrer">
          Inspired by roadmap.sh <ArrowUpRight size={14} />
        </a>
      </footer>
      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) closeTopic();
        }}
      >
        <ResizableTopicSheet open={!!selected}>
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
                aria-label="Topic lessons, progress, and notes"
              >
                <Tabs
                  className="topic-details-tabs"
                  value={detailTab}
                  onValueChange={(value) => setDetailTab(String(value))}
                >
                  <TabsList className="detail-tabs" aria-label="Topic sections">
                    <TabsTrigger value="learn">Learn</TabsTrigger>
                    <TabsTrigger value="practice">Practice</TabsTrigger>
                    <TabsTrigger value="notes">My notes</TabsTrigger>
                  </TabsList>
                  <TabsContent className="detail-panel" value="learn">
                    <h3>Learning resources</h3>
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
                        <ArrowUpRight size={18} />
                      </a>
                    ))}
                    {selected.guide && (
                      <section
                        className="lesson-section"
                        aria-label="Study guide"
                      >
                        <h3>Study guide</h3>
                        <StudyGuide content={selected.guide} />
                      </section>
                    )}
                    <button
                      className="secondary-button practice-link"
                      onClick={() => setDetailTab('practice')}
                    >
                      Go to practice <ArrowRight size={17} />
                    </button>
                  </TabsContent>
                  <TabsContent className="detail-panel" value="practice">
                    <h3>My progress</h3>
                    <RadioGroup
                      value={draft.status}
                      onValueChange={(v) =>
                        setField('status', v as LearningStatus)
                      }
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
                  </TabsContent>
                  <TabsContent className="detail-panel" value="notes">
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
                  </TabsContent>
                </Tabs>
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
        </ResizableTopicSheet>
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
