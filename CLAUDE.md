# CLAUDE.md

Context for Claude Code and any other AI assistant working in this repository.
Read this before making changes. Humans should read `CONTRIBUTING.md` instead —
this file assumes you can already read the code.

**Also read [`docs/CONTEXT.md`](docs/CONTEXT.md).** This file covers how the code
works and what not to break. That one covers where the project is, who owns which
column, which ratings are contested and must not be "corrected", and what is
still undecided. You need both.

---

## What this project is

The public output of HUX AI Research Internship **Project 2: Agentic AI Risk
Control Matrix** (Summer 2026). A single-page interactive presentation of a
governance matrix that maps AI **autonomy levels (L0–L5)** against **impact
classes (I0–I3)**, and states the control posture required at each intersection.

The audience is enterprise governance, risk and security practitioners. The page
has one job: let someone locate their AI deployment on the grid and see what
controls they owe before deploying it.

This is **not** a marketing site and **not** an app. It is a research artifact.

## Hard constraints — do not violate these

1. **Static only.** `output: 'export'` in `next.config.mjs`. No API routes, no
   server actions, no database, no authentication, no runtime environment
   variables. If a request seems to need a backend, it is out of scope — say so
   rather than adding one.
2. **No secrets, ever.** Nothing in this repo is private. The repository may be
   public.
3. **Content is data, not code.** All matrix content, definitions and references
   live in `content/`. Never hardcode a control, posture, rating or citation
   inside a component. If you find yourself typing matrix content into a `.jsx`
   file, stop — it belongs in `content/matrix.json`.
4. **Colour means risk and nothing else.** The four risk colours are the only
   colour on the page. Do not introduce a brand accent, coloured buttons,
   gradients or coloured links. This is a deliberate design decision, not an
   oversight: a decorative accent makes the risk colours read as decoration.
5. **Draft content must never reach a published build.** `lib/content.js`
   redacts draft cells server-side. Hiding them in a component is not
   sufficient — hidden text still ships in the page source. If you touch
   `getAllCells()`, keep the redaction.

## Architecture

```
content/          Data. Edited by non-technical teammates. Treat as the source of truth.
  matrix.json       One entry per L×I cell.
  scales.json       Axis definitions + risk legend + audit categories.
  taxonomy.json     Hierarchical risk taxonomy: families A–C → domains (codes R1–R9) → child risks, plus amplification factors.
  literature.json   Shared reference tracker.
  sections/*.md     Prose, with title/status front matter.

lib/content.js    The ONLY file that reads content/. Handles draft filtering.
app/page.js       Reads content via lib/, passes plain data down as props.
components/       Presentation. Never read the filesystem here.
scripts/          Zero-dependency content validator. Runs before every build.
assets/           Design references, not served. hux-palette.png is the HUX
                  brand swatch the risk colours in globals.css are drawn from.
```

Data flows one way: `content/` → `lib/content.js` → `app/page.js` → components.
Components receive props and render. They do not fetch, import content, or
compute business rules.

## Conventions

- **Plain CSS with CSS Modules.** No Tailwind, no CSS-in-JS, no UI library. All
  design tokens are CSS custom properties in `app/globals.css`. Do not add a
  styling dependency.
- **Selectors in `.module.css` files must be class-scoped.** Attribute selectors
  like `[data-risk="high"]` fail the build in a module — they live in
  `globals.css`. This has bitten us once already.
- **JavaScript, not TypeScript.** Chosen so contributors who are new to web
  development are not fighting the type checker while learning. Do not migrate.
- **`'use client'` only where interaction state genuinely requires it.** Right
  now: `ControlMatrix`, `ScaleList`, `ReferenceTable`, `RiskTaxonomy`.
- **Branches are `name/short-description`; commit messages are one line,
  `part: what you did`** (e.g. `L2: add I1 scenario`). Full rules in
  `CONTRIBUTING.md` → "Branch names and commit messages".
- **Derive options from data.** Filter buttons, grid columns and legend entries
  are all generated from `content/`. Adding a data row should never require a
  code change.
- **Dependencies stay minimal.** Currently `next`, `react`, `react-dom`,
  `marked`. Adding one needs a reason in the PR description. The team maintaining
  this after August 2026 are not primarily web developers.

## When asked to add a feature

Ask first whether it is a **content** change or a **code** change. Most requests
("add the L2 column", "add a reference", "reword the intro") are content changes
and need no code at all. Say so and point at the file.

Genuine code changes should follow the existing component pattern: a `.jsx` file
plus a matching `.module.css`, props in, no filesystem access, no new
dependencies.

## Verify before you claim it works

```bash
npm run check                  # content validation only, fast
npm run build                  # validation + full static build
SHOW_DRAFTS=true npm run build # preview build, drafts visible
npx serve out                  # inspect the built output
```

A change is not finished until `npm run build` passes. If you changed anything in
`lib/content.js`, also confirm draft redaction still holds:

```bash
npm run build && grep -c "Restricted autonomy" out/index.html   # must be 0
```

## Things that are deliberate and should not be "fixed"

- The masthead has no hero image, logo or call-to-action button.
- Risk cells are plain coloured rectangles with no icons or gradients.
- The `L0 × I3` cell is rated **high**, not critical. This is a researched
  position, not an error — low autonomy does not mean low impact. See the
  references cited on that cell.
- Draft cells display as "In progress" rather than being removed from the grid.
  Showing the shape of the unfinished work is intentional.
- Several cells are unpublished. The site is designed to be honest about being
  in progress, following the same convention as the reference site this was
  modelled on.
