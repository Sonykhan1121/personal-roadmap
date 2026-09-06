export const statuses = [
  'not_started',
  'learning',
  'practicing',
  'done',
  'skipped',
] as const;
export type LearningStatus = (typeof statuses)[number];
export const statusLabels: Record<LearningStatus, string> = {
  not_started: 'Not started',
  learning: 'Learning',
  practicing: 'Practicing',
  done: 'Completed',
  skipped: 'Skip for now',
};
export type ProgressEntry = {
  topic_id: string;
  status: LearningStatus;
  checked_steps: number[];
  notes: string;
  evidence_url: string;
  review_date: string | null;
  updated_at?: string;
};
export type Settings = { weekly_hours: number; start_date: string };
export const emptyEntry = (topic_id: string): ProgressEntry => ({
  topic_id,
  status: 'not_started',
  checked_steps: [],
  notes: '',
  evidence_url: '',
  review_date: null,
});
export function validateEntry(
  entry: ProgressEntry,
  stepCount: number,
): ProgressEntry {
  if (!statuses.includes(entry.status))
    throw new Error('Choose a valid learning status.');
  if (!entry.topic_id || entry.topic_id.length > 100)
    throw new Error('Unknown topic.');
  if (typeof entry.notes !== 'string' || entry.notes.length > 20000)
    throw new Error('Keep notes under 20,000 characters.');
  if (
    !Array.isArray(entry.checked_steps) ||
    entry.checked_steps.some(
      (i) => !Number.isInteger(i) || i < 0 || i >= stepCount,
    )
  )
    throw new Error('Invalid checklist item.');
  const evidence = entry.evidence_url.trim();
  if (evidence) {
    let url: URL;
    try {
      url = new URL(evidence);
    } catch {
      throw new Error('Use a complete https:// link for your project.');
    }
    if (!['https:', 'http:'].includes(url.protocol) || evidence.length > 2048)
      throw new Error('Use a valid https:// or http:// project link.');
  }
  if (entry.review_date && !isDateString(entry.review_date))
    throw new Error('Choose a valid review date.');
  return {
    ...entry,
    checked_steps: [...new Set(entry.checked_steps)].sort((a, b) => a - b),
    evidence_url: evidence,
  };
}
export function summarize(
  ids: string[],
  entries: Record<string, ProgressEntry>,
) {
  const done = ids.filter((id) => entries[id]?.status === 'done').length;
  const active = ids.filter((id) =>
    ['learning', 'practicing'].includes(entries[id]?.status || ''),
  ).length;
  const skipped = ids.filter((id) => entries[id]?.status === 'skipped').length;
  return {
    done,
    active,
    skipped,
    total: ids.length,
    percent: ids.length ? Math.round((done / ids.length) * 100) : 0,
  };
}
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function isDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export function phaseDates(start: string, index: number) {
  const ranges = [
    [0, 3],
    [3, 6],
    [6, 9],
    [9, 12],
    [12, 18],
    [18, 24],
  ];
  const [from, to] = ranges[index];
  const [y, m, d] = start.split('-').map(Number);
  const shift = (offset: number) => {
    const last = new Date(y, m - 1 + offset + 1, 0).getDate();
    return new Date(y, m - 1 + offset, Math.min(d, last));
  };
  const format = (date: Date) =>
    date.toLocaleDateString('en', { month: 'short', year: 'numeric' });
  return `${format(shift(from))} – ${format(shift(to))}`;
}
