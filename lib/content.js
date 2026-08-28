/**
 * The only place in the codebase that reads the content/ folder.
 *
 * Components never read files. They receive data from here. That keeps the
 * content/code split honest: if you are editing content you never open a
 * component, and if you are editing a component you never hardcode content.
 *
 * Draft handling
 * --------------
 * Anything with status: "draft" is hidden on the live site but visible on
 * preview builds. That is what lets the team work in the open without
 * publishing half-finished work.
 *
 * SHOW_DRAFTS is set to "true" by the deploy workflow's second build, which is
 * published at <live URL>/preview/ so content editors can see drafts rendered
 * without running anything. Locally, drafts show by default so you can see
 * what you are editing.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';

const CONTENT = join(process.cwd(), 'content');

export const showDrafts =
  process.env.SHOW_DRAFTS === 'true' || process.env.NODE_ENV === 'development';

const read = (file) => JSON.parse(readFileSync(join(CONTENT, file), 'utf8'));

export function getScales() {
  return read('scales.json');
}

export function getTaxonomy() {
  const { families, amplificationFactors } = read('taxonomy.json');
  return { families, amplificationFactors };
}

export function getReferences() {
  return read('literature.json').references;
}

/**
 * Every cell regardless of status — the grid needs to draw all 24 squares even
 * when most are unpublished.
 *
 * IMPORTANT: on a published build, draft cells are REDACTED here rather than
 * merely hidden in the component. Hiding text in the UI still ships it inside
 * the page source, where anyone can read it with View Source. Stripping it at
 * the source is what actually keeps unreviewed work off the public site.
 *
 * If you add a new field to a cell, add it to the redacted shape below only if
 * it is safe to publish before review.
 */
export function getAllCells() {
  const { cells } = read('matrix.json');
  if (showDrafts) return cells;

  return cells.map((cell) =>
    cell.status === 'published'
      ? cell
      : {
          id: cell.id,
          autonomy: cell.autonomy,
          impact: cell.impact,
          owner: cell.owner,
          status: 'draft',
          risk: 'empty',
          posture: '',
          scenario: '',
          controls: [],
          approval: '',
          rollback: '',
          sources: [],
        }
  );
}

export function getSections() {
  const dir = join(CONTENT, 'sections');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const raw = readFileSync(join(dir, file), 'utf8');
      const end = raw.indexOf('\n---', 3);
      const front = raw.slice(3, end);
      const body = raw.slice(end + 4);
      const field = (name) => new RegExp(`^\\s*${name}:\\s*(.+)$`, 'm').exec(front)?.[1]?.trim();
      return {
        slug: file.replace(/\.md$/, ''),
        title: field('title') ?? file,
        status: field('status') ?? 'draft',
        html: marked.parse(body, { async: false }),
      };
    })
    .filter((s) => showDrafts || s.status === 'published');
}
