'use client';
import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import {
  emptyEntry,
  statuses,
  summarize,
  type LearningStatus,
  type ProgressEntry,
} from '@/lib/progress';
import { topics } from '@/lib/roadmap';
type Tool = {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
};
type Context = {
  registerTool: (
    tool: Tool,
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export function useRoadmapTools(
  entries: Record<string, ProgressEntry>,
  openTopic: (id: string) => void,
  saveEntry: (value: ProgressEntry) => Promise<ProgressEntry>,
) {
  const latest = useRef({ entries, openTopic, saveEntry });
  useEffect(() => {
    latest.current = { entries, openTopic, saveEntry };
  }, [entries, openTopic, saveEntry]);
  useEffect(() => {
    const context = (document as Document & { modelContext?: Context })
      .modelContext;
    if (!context?.registerTool) return;
    const life = new AbortController();
    const record = (input: unknown) => {
      if (typeof input !== 'object' || input === null || Array.isArray(input))
        throw new Error('Expected an object.');
      return input as Record<string, unknown>;
    };
    const idFrom = (input: unknown) => {
      const value = record(input);
      if (
        typeof value.topicId !== 'string' ||
        !topics.some((t) => t.id === value.topicId)
      )
        throw new Error('Unknown topicId.');
      return value.topicId;
    };
    const tools: Tool[] = [
      {
        name: 'read_learning_progress',
        title: 'Read learning progress',
        description:
          'Read topic statuses and overall completion for the signed-in learning roadmap. Does not include private notes.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute(input) {
          const value = record(input);
          if (Object.keys(value).length)
            throw new Error('No arguments expected.');
          return {
            summary: summarize(
              topics.map((t) => t.id),
              latest.current.entries,
            ),
            topics: topics.map((t) => ({
              id: t.id,
              title: t.title,
              phase: t.phase,
              status: latest.current.entries[t.id]?.status ?? 'not_started',
            })),
          };
        },
      },
      {
        name: 'open_learning_topic',
        title: 'Open a learning topic',
        description:
          'Open the requested topic’s resources and practice checklist. Does not save or change progress.',
        inputSchema: {
          type: 'object',
          properties: { topicId: { type: 'string' } },
          required: ['topicId'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const value = record(input);
          if (Object.keys(value).some((k) => k !== 'topicId'))
            throw new Error('Unexpected argument.');
          const id = idFrom(input);
          flushSync(() => latest.current.openTopic(id));
          return { openedTopicId: id };
        },
      },
      {
        name: 'save_learning_status',
        title: 'Save a topic status',
        description:
          'Save the requested learning status to the signed-in account and update the roadmap. Preserves notes and checklist. Requires sign-in; may fail on a concurrent edit.',
        inputSchema: {
          type: 'object',
          properties: {
            topicId: { type: 'string' },
            status: { type: 'string', enum: statuses },
          },
          required: ['topicId', 'status'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) {
          const value = record(input);
          if (
            Object.keys(value).some((k) => !['topicId', 'status'].includes(k))
          )
            throw new Error('Unexpected argument.');
          const id = idFrom(input);
          if (!statuses.includes(value.status as LearningStatus))
            throw new Error('Invalid status.');
          const saved = await latest.current.saveEntry({
            ...(latest.current.entries[id] ?? emptyEntry(id)),
            status: value.status as LearningStatus,
          });
          return { topicId: saved.topic_id, status: saved.status };
        },
      },
    ];
    for (const tool of tools) {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: life.signal }),
        ).catch(() => {});
      } catch {
        /* Optional browser capability. */
      }
    }
    return () => life.abort();
  }, []);
}
