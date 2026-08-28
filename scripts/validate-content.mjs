/**
 * Content validator.
 *
 * Runs before every build and on every pull request. If someone edits a content
 * file and breaks it, this stops the change BEFORE it reaches the live site and
 * explains what to fix in plain language.
 *
 * Deliberately has zero dependencies so it cannot itself break on an install.
 *
 * Run it yourself any time:   npm run check
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'content');

const problems = [];
const warnings = [];

const fail = (file, msg) => problems.push({ file, msg });
const warn = (file, msg) => warnings.push({ file, msg });

/* ---------- helpers ---------------------------------------------------- */

function readJson(name) {
  const path = join(CONTENT, name);
  if (!existsSync(path)) {
    fail(name, `File is missing. It should be at content/${name}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    fail(
      name,
      `This file is not valid JSON, so the site cannot read it.\n` +
        `      ${err.message}\n` +
        `      Most common cause: a missing comma between entries, or a comma after the LAST entry in a list.\n` +
        `      Paste the file into https://jsonlint.com to see exactly where.`
    );
    return null;
  }
}

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

/* ---------- 1. scales.json --------------------------------------------- */

const scales = readJson('scales.json');
let autonomyIds = [];
let impactIds = [];
let riskIds = [];

if (scales) {
  for (const key of ['autonomyLevels', 'impactClasses', 'riskLegend', 'auditCategories']) {
    if (!Array.isArray(scales[key]) || scales[key].length === 0) {
      fail('scales.json', `"${key}" is missing or empty. It must be a list with at least one entry.`);
    }
  }
  autonomyIds = (scales.autonomyLevels || []).map((l) => l.id);
  impactIds = (scales.impactClasses || []).map((i) => i.id);
  riskIds = (scales.riskLegend || []).map((r) => r.id);
}

/* ---------- 2. literature.json ----------------------------------------- */

const literature = readJson('literature.json');
const refKeys = new Set();

if (literature) {
  if (!Array.isArray(literature.references)) {
    fail('literature.json', '"references" must be a list.');
  } else {
    literature.references.forEach((ref, i) => {
      const where = `reference ${i + 1}${ref.refKey ? ` ("${ref.refKey}")` : ''}`;
      for (const field of ['refKey', 'authors', 'title', 'type', 'evidences']) {
        if (!isNonEmptyString(ref[field])) {
          fail('literature.json', `${where}: "${field}" is missing or empty.`);
        }
      }
      if (!isNonEmptyString(ref.usedBy)) {
        fail(
          'literature.json',
          `${where}: "usedBy" is missing or empty. The filter buttons above the reference list ` +
            `are generated from this field. Use the column it belongs to (e.g. "L0") or "All columns".`
        );
      }
      if (refKeys.has(ref.refKey)) {
        fail('literature.json', `${where}: this refKey is used twice. Each refKey must be unique.`);
      }
      refKeys.add(ref.refKey);
      if (ref.url && !/^https?:\/\//.test(ref.url)) {
        fail('literature.json', `${where}: "url" must start with http:// or https://`);
      }
      if (!ref.url) {
        warn('literature.json', `${where}: no url. Fine for offline sources, worth adding otherwise.`);
      }
    });
  }
}

/* ---------- 3. matrix.json --------------------------------------------- */

const matrix = readJson('matrix.json');
const seenIds = new Set();

if (matrix) {
  if (!Array.isArray(matrix.cells)) {
    fail('matrix.json', '"cells" must be a list.');
  } else {
    matrix.cells.forEach((cell, i) => {
      const where = `cell ${i + 1}${cell.id ? ` ("${cell.id}")` : ''}`;

      if (!isNonEmptyString(cell.id)) {
        fail('matrix.json', `${where}: "id" is missing.`);
        return;
      }
      if (seenIds.has(cell.id)) {
        fail('matrix.json', `${where}: duplicate id. Each cell id must appear once.`);
      }
      seenIds.add(cell.id);

      if (cell.id !== `${cell.autonomy}-${cell.impact}`) {
        fail(
          'matrix.json',
          `${where}: id should be "${cell.autonomy}-${cell.impact}" to match its autonomy and impact fields.`
        );
      }
      if (!autonomyIds.includes(cell.autonomy)) {
        fail('matrix.json', `${where}: autonomy "${cell.autonomy}" is not one of ${autonomyIds.join(', ')}`);
      }
      if (!impactIds.includes(cell.impact)) {
        fail('matrix.json', `${where}: impact "${cell.impact}" is not one of ${impactIds.join(', ')}`);
      }
      if (!riskIds.includes(cell.risk)) {
        fail(
          'matrix.json',
          `${where}: risk "${cell.risk}" is not one of ${riskIds.join(', ')}. ` +
            `These are the ids in scales.json, not the display labels.`
        );
      }
      if (!['published', 'draft'].includes(cell.status)) {
        fail('matrix.json', `${where}: status must be "published" or "draft" (you wrote "${cell.status}").`);
      }
      if (!isNonEmptyString(cell.posture)) {
        fail('matrix.json', `${where}: "posture" is the label shown in the grid and cannot be empty.`);
      }

      // Published cells have to actually say something.
      if (cell.status === 'published') {
        if (!isNonEmptyString(cell.scenario)) {
          fail('matrix.json', `${where}: published cells need a "scenario". Set status to "draft" if not ready.`);
        }
        if (!Array.isArray(cell.controls) || cell.controls.length === 0) {
          fail('matrix.json', `${where}: published cells need at least one entry in "controls".`);
        }
        if (!isNonEmptyString(cell.rollback)) {
          fail('matrix.json', `${where}: published cells need a "rollback" plan.`);
        }
      }

      // Every cited source must exist in the tracker.
      (cell.sources || []).forEach((key) => {
        if (!refKeys.has(key)) {
          fail(
            'matrix.json',
            `${where}: cites "${key}", which is not in literature.json.\n` +
              `      Either add it to content/literature.json or fix the spelling. ` +
              `refKeys are case-sensitive.`
          );
        }
      });
    });

    // Every axis intersection should exist.
    for (const a of autonomyIds) {
      for (const im of impactIds) {
        if (!seenIds.has(`${a}-${im}`)) {
          fail('matrix.json', `No cell for ${a}-${im}. Every intersection needs an entry, even a draft one.`);
        }
      }
    }
  }
}

/* ---------- 4. taxonomy.json -------------------------------------------- */

const taxonomy = readJson('taxonomy.json');
let taxonomyRiskCount = 0;
const RISK_TYPES = ['Model-output', 'Governance', 'Action-execution'];

if (taxonomy) {
  if (!Array.isArray(taxonomy.families) || taxonomy.families.length === 0) {
    fail('taxonomy.json', '"families" must be a list with at least one entry (the workbook has A, B and C).');
  } else {
    const seenCodes = new Set();
    taxonomy.families.forEach((family, f) => {
      const fwhere = `family ${f + 1}${family.id ? ` ("${family.id}")` : ''}`;

      if (!/^[A-Z]$/.test(family.id ?? '')) {
        fail('taxonomy.json', `${fwhere}: "id" must be a single capital letter like A, B, C (you wrote "${family.id}").`);
      }
      if (!isNonEmptyString(family.name)) {
        fail('taxonomy.json', `${fwhere}: "name" is missing or empty.`);
      }
      if (!Array.isArray(family.domains) || family.domains.length === 0) {
        fail('taxonomy.json', `${fwhere}: a family with no domains is not a taxonomy - it is a label. Add at least one domain.`);
        return;
      }

      family.domains.forEach((domain, i) => {
        const where = `domain ${i + 1} of family ${family.id}${domain.id ? ` ("${domain.id}")` : ''}`;

        const expectedDomainId = `${family.id}.${i + 1}`;
        if (domain.id !== expectedDomainId) {
          fail(
            'taxonomy.json',
            `${where}: id should be "${expectedDomainId}".\n` +
              `      Domain ids are positional within their family - the second domain of B is always B.2. ` +
              `If you inserted a domain mid-list, renumber the ones after it.`
          );
        }
        if (!isNonEmptyString(domain.name)) {
          fail('taxonomy.json', `${where}: "name" is missing or empty.`);
        }
        if (!/^R\d+$/.test(domain.code ?? '')) {
          fail('taxonomy.json', `${where}: "code" must be the workbook code, like R1 (you wrote "${domain.code}").`);
        } else if (seenCodes.has(domain.code)) {
          fail('taxonomy.json', `${where}: code "${domain.code}" is used twice. Each workbook code maps to one domain.`);
        }
        seenCodes.add(domain.code);
        if (!RISK_TYPES.includes(domain.riskType)) {
          fail(
            'taxonomy.json',
            `${where}: "riskType" must be one of ${RISK_TYPES.join(', ')} (you wrote "${domain.riskType}").`
          );
        }
        if (!Array.isArray(domain.risks) || domain.risks.length === 0) {
          fail(
            'taxonomy.json',
            `${where}: a parent domain with no child risks is not a taxonomy - it is a list. Add at least one child risk.`
          );
          return;
        }
        domain.risks.forEach((risk, j) => {
          const expected = `${domain.id}.${j + 1}`;
          if (risk.id !== expected) {
            fail(
              'taxonomy.json',
              `${where}: child ${j + 1} has id "${risk.id}" but should be "${expected}".\n` +
                `      Child ids are positional - the third child of B.2 is always B.2.3. ` +
                `If you inserted a risk mid-list, renumber the ones after it.`
            );
          }
          if (!isNonEmptyString(risk.name)) {
            fail('taxonomy.json', `${where}: child ${j + 1} ("${risk.id}"): "name" is missing or empty.`);
          }
        });
        taxonomyRiskCount += domain.risks.length;
      });
    });
  }

  if (!Array.isArray(taxonomy.amplificationFactors) || taxonomy.amplificationFactors.length === 0) {
    fail('taxonomy.json', '"amplificationFactors" must be a list with at least one entry (the workbook has six).');
  } else {
    taxonomy.amplificationFactors.forEach((factor, i) => {
      const where = `amplification factor ${i + 1}${factor.name ? ` ("${factor.name}")` : ''}`;
      if (!isNonEmptyString(factor.name)) {
        fail('taxonomy.json', `${where}: "name" is missing or empty.`);
      }
      if (!isNonEmptyString(factor.description)) {
        fail('taxonomy.json', `${where}: "description" is missing or empty.`);
      }
    });
  }
}

/* ---------- 5. sections ------------------------------------------------- */

const sectionsDir = join(CONTENT, 'sections');
if (!existsSync(sectionsDir)) {
  fail('sections/', 'The content/sections folder is missing.');
} else {
  const files = readdirSync(sectionsDir).filter((f) => f.endsWith('.md'));
  if (files.length === 0) warn('sections/', 'No .md files found.');
  files.forEach((file) => {
    const raw = readFileSync(join(sectionsDir, file), 'utf8');
    if (!raw.startsWith('---')) {
      fail(
        `sections/${file}`,
        'Missing the front matter block at the top. The file must start with a line of exactly ---\n' +
          '      then title: and status: lines, then another --- line.'
      );
      return;
    }
    const end = raw.indexOf('\n---', 3);
    if (end === -1) {
      fail(`sections/${file}`, 'The front matter block is never closed. Add a --- line after status:.');
      return;
    }
    const front = raw.slice(3, end);
    if (!/^\s*title:\s*\S/m.test(front)) fail(`sections/${file}`, 'Front matter needs a "title:" line.');
    const status = /^\s*status:\s*(\S+)/m.exec(front)?.[1];
    if (!status) fail(`sections/${file}`, 'Front matter needs a "status:" line (published or draft).');
    else if (!['published', 'draft'].includes(status))
      fail(`sections/${file}`, `status must be "published" or "draft" (you wrote "${status}").`);
    if (raw.slice(end + 4).trim().length === 0)
      warn(`sections/${file}`, 'This section has no body text yet.');
  });
}

/* ---------- report ------------------------------------------------------ */

const GREEN = '\u001b[32m';
const RED = '\u001b[31m';
const YELLOW = '\u001b[33m';
const DIM = '\u001b[2m';
const OFF = '\u001b[0m';

if (warnings.length) {
  console.log(`\n${YELLOW}Warnings${OFF} ${DIM}(these do not stop the build)${OFF}`);
  warnings.forEach((w) => console.log(`  • ${w.file}: ${w.msg}`));
}

if (problems.length === 0) {
  console.log(`\n${GREEN}Content check passed.${OFF} ${DIM}${seenIds.size} matrix cells, ${taxonomyRiskCount} taxonomy risks, ${refKeys.size} references.${OFF}\n`);
  process.exit(0);
}

console.log(`\n${RED}Content check failed — ${problems.length} problem${problems.length > 1 ? 's' : ''} to fix.${OFF}`);
console.log(`${DIM}Nothing has been published. Fix these in the content/ folder and commit again.${OFF}\n`);
const byFile = {};
problems.forEach((p) => (byFile[p.file] ||= []).push(p.msg));
for (const [file, msgs] of Object.entries(byFile)) {
  console.log(`  ${RED}content/${file}${OFF}`);
  msgs.forEach((m) => console.log(`    - ${m}`));
  console.log('');
}
console.log(`${DIM}Stuck? Open an issue in this repo, or contact a maintainer from the table in docs/BREAK-GLASS.md.${OFF}\n`);
process.exit(1);
