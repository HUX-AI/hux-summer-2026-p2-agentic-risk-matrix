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
   **One exception, and it is the only one:** the masthead orb
   (`public/hux-orb.png`), bled off the top-right corner at 0.45 opacity behind
   the title. It marks no element, carries no state and labels nothing — it is
   an atmospheric wash above the fold, never in sight of a risk swatch. It was
   added deliberately in September 2026 along with the tagline lockup. Do not
   read it as permission for a second coloured element: a coloured button,
   link, rule or icon anywhere is exactly what this rule exists to prevent, and
   adding one makes the orb read as the start of a palette instead.
5. **Draft content must never reach a published build.** `lib/content.js`
   redacts draft cells server-side. Hiding them in a component is not
   sufficient — hidden text still ships in the page source. If you touch
   `getAllCells()`, keep the redaction. All 24 cells are currently `published`,
   so the redaction path has nothing to redact today — it stays in place for
   the next cell that goes back to draft, and the check below still exercises
   it.

## Architecture

```
content/          Data. Edited by non-technical teammates. Treat as the source of truth.
  matrix.json       One entry per L×I cell. "annotated" says whether the cell has a researched
                    scenario card or falls back to the generic tier floor.
  scales.json       Axis definitions (with oversight band) + tier legend + audit categories.
  taxonomy.json     Hierarchical risk taxonomy: families A–C → domains (codes R1–R9) → child risks,
                    each domain carrying its OWASP mapping, failure scenario, triggers and control themes,
                    plus the amplification factors.
  literature.json   Shared reference tracker.
  report.json       The list-shaped parts of the report: masthead credits, the four assets, the two
                    findings, the protocol steps, the reconciliation table, the limitations, the
                    AI-use disclosure and the footer colophon.
  scenarios.json    Scenario library — the distribution across levels, plus the annotated cards.
  assessment.json   The two instruments: the classification tree (Appendix B) and the scoring model
                    (Appendix E). Every weight, threshold and band is a PROJECT CALIBRATION CONSTANT.
  sections/*.md     Flowing prose, with title/status front matter. Anything list- or table-shaped
                    belongs in report.json instead.

lib/content.js    The ONLY file that reads content/. Handles draft filtering.
app/page.js       Reads content via lib/, passes plain data down as props.
components/       Presentation. Never read the filesystem here.
scripts/          Zero-dependency content validator. Runs before every build.
assets/           Design references, not served. hux-palette.png is the HUX
                  brand swatch the risk colours in globals.css are drawn from.
                  The 4000px logo files are the brand originals; the served
                  copies (public/hux-icon.png, app/icon.png) are cropped and
                  downscaled from B_HUX_Icon_4000px.png.
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
  now: `ControlMatrix`, `ScaleList`, `ReferenceTable`, `RiskTaxonomy`,
  `ClassificationTree`, `AssessmentTool`, `ScenarioLibrary`. The display-only
  components (`RiskLegend`, `ExecutiveSummary`, `ProcessSteps`,
  `ReconciliationTable`, `StatementList`) have no directive and should not
  acquire one.
- **The classification tree selects a cell in the matrix through a
  `matrix:select` window event**, not shared state — the two sections are four
  bands apart and lifting state would make `app/page.js` a client component,
  which would break the server-reads-content rule. Both ends are commented; if
  you rename the event, rename it in both.
- **`scoreDeployment()` in `AssessmentTool.jsx` is a pure function.** Same
  inputs, same result, no reads of component state. Keep it that way so it can
  be checked against the workbook line by line.
- **Branches are `name/short-description`; commit messages are one line,
  `part: what you did`** (e.g. `L2: add I1 scenario`). Full rules in
  `CONTRIBUTING.md` → "Branch names and commit messages".
- **Every component must work at phone width.** The page has no fixed layout
  width: global spacing uses `clamp()`, text is capped by `max-width` measures,
  and anything genuinely too wide to reflow (the matrix grid) scrolls sideways
  inside its own `overflow-x: auto` container — never the page itself. New
  components follow suit: prefer intrinsically responsive layouts
  (`repeat(auto-fit, minmax(...))`, `max-width`, relative units) and add a
  `@media (max-width: ...)` query in the component's `.module.css` where
  stacking is needed. Breakpoints are content-driven and chosen per component —
  there is no shared breakpoint token, and that is fine. The viewport meta tag
  is injected by Next.js; do not add one.
- **Accessibility is a floor, not a feature.** Native elements first: the grid
  is a real `<table>` with `scope`d headers, expand/collapse is `<details>`
  (copy `ScaleList`), anything clickable is a real `<button>`. Interactive
  state is mirrored in ARIA — `aria-pressed` on toggles and filters,
  `aria-live` on the cell detail panel — and purely decorative visuals
  (legend swatches, the scroll hint) are `aria-hidden`. Colour is never the
  only carrier of meaning: a cell's risk level is in its accessible name and
  in the detail panel text, not just its background. All text meets WCAG AA
  contrast (≥ 4.5:1) against both paper tokens — the greys in `globals.css`
  are chosen for exactly that, so do not lighten them, and note the matrix
  cells use `#000` text because `#111` fails against the critical purple.
  Keep the `:focus-visible` outline and `prefers-reduced-motion` rules in
  `globals.css`.
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
`lib/content.js`, also confirm draft redaction still holds. Every cell is
published right now, so prove it by flipping one to draft and putting it back:

```bash
node -e "const f='content/matrix.json',d=require('./'+f);d.cells.find(c=>c.id==='L2-I3').status='draft';require('fs').writeFileSync(f,JSON.stringify(d,null,2)+'\n')"
npm run build              && grep -c "CAPA proposal" out/index.html   # must be 0
SHOW_DRAFTS=true npm run build && grep -c "CAPA proposal" out/index.html   # must be 1
git checkout content/matrix.json
```

## Things that are deliberate and should not be "fixed"

- The masthead carries the HUX wordmark-with-tagline lockup and the gradient
  orb. Both were added deliberately in September 2026, at the team's request,
  and both reversed an earlier rule that kept them off the page. The earlier
  reasoning still holds for everything else: no hero image, no call-to-action
  button, and no second coloured element anywhere. The footer keeps the small
  monochrome icon, not the lockup.
- Risk cells are plain coloured rectangles with no icons or gradients.
- The `L0 × I3` cell is rated **high**, not critical. This is a researched
  position, not an error — low autonomy does not mean low impact. See the
  references cited on that cell.
- Draft cells display as "In progress" rather than being removed from the grid.
  Showing the shape of the unfinished work is intentional. No cell is in that
  state today, but the behaviour is kept for the next one that is.
- **Eight of the twenty-four cells have no researched scenario card** — the
  whole of L3 and L5 — and they say so: `"annotated": false` makes the detail panel show the tier floor and
  label it "Required controls at tier N". That is an honest statement about
  research depth, not a gap to quietly fill with plausible-sounding controls.
  Writing a card means researching the cell and citing it.
- The classification tree and the scoring instrument compute. This reverses the
  earlier "the site presents the matrix, it does not compute with it" line: both
  are now published research output (report Appendices B and E), not a
  speculative feature. Their constants live in `content/assessment.json` and
  carry a health warning there and on the page — they are project calibration
  rules with no external derivation and no sensitivity analysis.
