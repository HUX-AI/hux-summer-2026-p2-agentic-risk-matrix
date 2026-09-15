# Project context

Situational background for anyone — human or AI — picking this repo up mid-project.

`CLAUDE.md` covers **how the code works and what not to break**. This file covers
**where the project is, who owns what, and what is deliberately unresolved.**
Read both.

---

## Situation

This site is the Week 10 public deliverable of the HUX AI Research Internship,
Project 2 (Summer 2026). Ten-week programme, launch window **14–18 September 2026**.

The person who built the scaffold (Ben, L0 column) leaves around **31 August**
for another fellowship and will be **absent for Weeks 8, 9 and launch week**. The
architecture exists in its current form because of that: content split from code,
validation in CI, one-click rollback, and documentation aimed at contributors who
have never deployed a website.

**Design assumption to preserve:** most of the remaining work is content, done by
people who will not clone the repo. Do not introduce anything that requires a
local dev environment for a wording change.

## Who owns which column

Level names changed in the final report. The ladder shifted as well as the
labels: what used to be `L1 — Bounded assistant` (drafts and proposes) is now
`L2 — Prepare action`, and `L1` is advice-only. Anything written against the old
names needs re-reading, not renaming.

| Column | Owner | State |
|---|---|---|
| L0 — Respond only | Ben | Annotated, complete, evidenced |
| L1 — Advise only | Shalom | Annotated (judiciary advisory scoring), evidenced |
| L2 — Prepare action | Kevin / Bhoomika | Annotated (GMP biologics drafting), evidenced |
| L3 — Approved execution | Asli & Beste | Posture and tier published; no scenario card |
| L4 — Bounded autonomy | Peri | Annotated, complete, evidenced |
| L5 — Open autonomy | Frances | Posture and tier published; no scenario card |

**Every one of the 24 cells now carries a reconciled posture and tier** from the
final report (Appendix C Table C1, Appendix E Table E1). What varies is research
depth: sixteen cells have a researched scenario card, and the eight in L3 and L5
carry `"annotated": false` and fall back to the generic tier floor. The page
labels that fallback rather than hiding it.

Owners fill in their own column. **Do not write content for someone else's
column** — the ratings are researched positions, and a missing scenario card is
a statement about what was researched, not a gap to fill with plausible text.

## Where content comes from

The upstream source of truth is the team's shared workbook,
`HUX_AI_2026_P2_Master_Workbook.xlsx` — specifically the `W5 - Control Matrix v1`,
`W5 - L0 Controls (Ben)` and `W5 - Literature` tabs. The files in `content/` are
exported from it.

When they disagree, **the workbook wins** and the export should be redone. Do not
silently reconcile a difference in one direction.

## Contested cells — do not "fix" these

Two ratings differ from the version of the matrix another team member circulated.
Both are deliberate, evidenced positions, not errors:

- **L0 × I1** — rated `medium` here; the other version says `low` / permitted.
  Basis: *Moffatt v. Air Canada* (2024 BCCRT 149), where an organisation was held
  liable for negligent misrepresentation by an information-only chatbot.
- **L0 × I2** — rated `high` here; the other version says `medium`. Basis: the NYC
  MyCity chatbot, an information-only public-sector service that gave unlawful
  guidance at scale and stayed online after publication.

The underlying disagreement is conceptual. The other version treats L0 as
inherently low-risk because the system cannot execute. This one treats impact at
L0 as set by the **reliance pathway** — what a human does with the output. Both
are defensible; the team has not settled it. If asked to align the columns,
surface the disagreement rather than resolving it silently.

Related: `L0 × I3` is `high`, not `critical`. Under the aligned legend, critical
demands regulatory-grade assurance, and cells beyond even that carry the
*Prohibited / redesign* posture — but safeguarding or crisis information services
should exist. The control set carries the weight, not the colour.

## Known issues in the upstream workbook

Flagged to the team, not yet resolved. They will surface as inconsistencies
between columns as more content lands:

1. ~~**Two incompatible impact-scale definitions are in circulation.**~~
   **Settled.** The final report adopts the workbook reference scale —
   *reversibility and blast radius* — and `content/scales.json` was moved onto
   that wording in September 2026. The materiality phrasing is gone. If a column
   still reads as if it were classified against materiality, that column needs
   re-reading, not the scale.
2. ~~**Two non-monotonic cells in the circulated grid.**~~ **Settled by
   reconciliation.** The published grid is monotonic: risk never falls as
   impact or autonomy rises. The `L2 × I3` case was resolved to *mandatory
   verified sign-off* at tier 3 rather than *prohibited* — the permitting draft
   cited 21 C.F.R. pt. 11, *Mata v. Avianca* and draft FDA guidance; the
   prohibiting draft recorded no scenario, controls or citation. The full
   eight-row reconciliation is published on the page under "Where the drafts
   disagreed" and lives in `content/report.json`.
3. **The risk taxonomy has no ID for confabulation / information integrity**,
   which is the dominant failure mode at L0. Taxonomy v2 briefly resolved this
   as `R5.3 Confabulated or unsupported output`, but the v3 restructure
   (families A–C) dropped it again — no child under `B.2 Data, Memory &
   Information Boundaries` (or anywhere else) covers confabulated output, and
   in v3 the code `R5` now means `B.3 Planning, Workflow & Delegation`.
   **Re-flagged.** Natural home would be a new child `B.2.4`, mapping to NIST
   AI 600-1 "Confabulation" and OWASP LLM09:2025. Raise with the team; do not
   add it unilaterally — the workbook wins.

## Settled since the scaffold was built

- **The masthead now carries the tagline lockup and the gradient orb.** Both
  were previously banned in `CLAUDE.md` — the lockup as marketing copy, the orb
  as a breach of colour-means-risk. Reversed in September 2026 at the team's
  request; `CLAUDE.md` records the exception and its limits. The rest of the
  rule is unchanged: no second coloured element anywhere on the page.
- **Repo lives in the HUX AI GitHub org.** `deploy.yml` assumes GitHub Pages;
  switch to Cloudflare Pages only if the repo must stay private on a free plan.
  (Vercel remains rejected — its free tier prohibits commercial use.)
- **Taxonomy v3 adopted** (supersedes v2's flat `R1`–`R10`) — three families
  (`A` Intent & Authority, `B` Execution & Interaction, `C` Governance &
  Assurance) hold nine domains (`A.1`–`C.3`, keeping workbook codes `R1`–`R9`),
  each tagged with a risk type (Model-output / Governance / Action-execution)
  and holding child risks. Child IDs are the unit of assessment; a control
  cites a child such as `B.2.1`, never a family or domain alone. The sheet also
  defines six **risk amplification factors** — deployment conditions
  (irreversibility, external impact, sensitive data, financial impact,
  vulnerable users, execution velocity) that raise the impact of any failure
  mode. Lives in `content/taxonomy.json`.
- **Tiering rule: the highest single factor sets the tier** — no weighting, no
  averaging. Averaging would score L0 × I3 as medium, which is the exact failure
  the L0 column exists to argue against.
- **Risk legend top tier aligned to the HUX house model.** The top tier is now
  "Critical — Regulatory & compliance assurance". Tier and posture are separate
  concepts: "Prohibited / redesign" survives as a *cell posture* for
  intersections where even maximum assurance is insufficient. Risk **ids** did
  not change — only labels.
- **The taxonomy and the tiering model are separate artifacts.** The tiering
  model classifies a *deployment*; the taxonomy catalogues *failure modes* and
  does not change per deployment. They join through the deployment: factor
  scores determine which child risks are in scope, the tier determines how much
  evidence each needs. Do not present one as derived from the other.
- **The pyramid diagram is retired** — it was a misread of what a taxonomy is.
- **Draft preview site.** `deploy.yml` builds twice and publishes the
  drafts-visible build at `<live URL>/preview/`, so column owners see their
  draft cells rendered without running anything locally. The preview is public
  (drafts are unreviewed, not secret) and carries a PREVIEW BUILD banner. If
  hosting later lands on Cloudflare Pages, its built-in per-PR previews can
  supplement this.
- **Risk colours re-mapped to the HUX AI brand palette** (swatch kept at
  `assets/hux-palette.png`): low `#81cfce` teal, medium `#e4815c` orange, high
  `#e66e6d` coral, critical `#9366ab` purple, empty `#d8d4d6` grey. The brand
  swatch has no green/yellow, so the ramp encodes severity by monotonic
  darkening, with purple as the tier beyond red (AQI convention). The
  colour-means-risk rule is unchanged — the four remaining brand colours are
  deliberately unused. **The workbook legend still shows the old
  green/yellow/orange/red swatches** — per the workbook-wins rule this is a
  flagged divergence: update the workbook legend to match, do not revert the
  site.

## Undecided

- **Named backup maintainer.** Blank in `docs/BREAK-GLASS.md` and the single
  biggest handover risk. Needs someone who has actually merged a PR and re-run a
  deploy before 31 August.
- ~~**Which columns commit to publishing by Week 10.**~~ **Settled:** all 24
  carry a posture and tier; L3 and L5 publish without a scenario card, labelled
  as the tier floor.
- **Whether L3 and L5 get scenario cards after launch.** The instrument does not
  need them — the postures are reconciled and published — but the two columns
  read thinner than the other four, and the limitations section says so.
- **Repo ownership and HUX affiliation after Week 10.**

## Recent technical decisions worth knowing

- **Next.js upgraded to 16.3.1.** The initial scaffold used 15.1.6, which carries
  a published security advisory (CVE-2025-66478). Do not downgrade.
- **Draft cells are redacted server-side in `lib/content.js`, not hidden in the
  component.** Hiding text in the UI still ships it in the page source. Verified:
  a published build contains zero draft text. If you touch `getAllCells()`, keep
  this and re-verify.
- **Attribute selectors fail inside `.module.css`.** `[data-risk="high"]` must
  live in `app/globals.css`. This broke the build once.
- **No Tailwind, no TypeScript, no UI library** — chosen for contributors new to
  web development, not by accident.

## Out of scope

~~A separate interactive assessment tool has been discussed as its own project
with its own repo. This site presents the matrix; it does not compute with
it.~~ **Reversed, September 2026.** The classification tree and the scoring
instrument are published research output — report Appendices B and E — not a
speculative feature, and they now ship on this page
(`components/ClassificationTree.jsx`, `components/AssessmentTool.jsx`,
constants in `content/assessment.json`).

The line that replaces it is narrower and still worth holding: **the instruments
report the report's own calibration, they do not invent any.** Every weight,
threshold and coverage band comes from the workbook and is labelled on the page
as a project calibration rule with no external derivation and no sensitivity
analysis. A request to add a scoring dimension the report does not define, or to
tune a constant to make an output "look right", belongs upstream in the workbook
— say so rather than editing the number.

Still out of scope: persistence of any kind. The site is a static export with no
backend, so an assessment cannot be saved, shared by link or exported. Requests
for that are a different project.

## Likely next tasks

1. Confirm hosting with HUX, adjust `deploy.yml` if Cloudflare.
2. Enable branch protection on `main`: require a PR and a passing check
   (steps in `CONTRIBUTING.md` → "One-time repository setup").
3. Walk the backup maintainer through a real PR merge and a rollback.
4. Column owners fill their cells and flip `status` to `published` after review.
5. Fill the contact table in `docs/BREAK-GLASS.md`.
6. Test the kill switch once (Settings → Pages → Source → None, then restore).
7. Re-point matrix cells at taxonomy child IDs (e.g. `B.2.1`) instead of
   legacy IDs (`D-01`). Beware stale `R<n>` citations: v3 re-used the R-codes
   for different domains than v2 (v2's `R5` was data integrity; v3's `R5` is
   planning & workflow).
