# Proposal: web platform for the Project 2 public output

**For:** Project 2 team and mentors
**Status:** For discussion — scaffold is already built and deploying, so this is
a proposal you can click on rather than imagine.

---

## 1. What we are building

An interactive single page presenting the Agentic AI Risk Control Matrix: the
grid itself, the L0–L5 and I0–I3 definitions, the control set behind every cell,
and the shared reference tracker.

Modelled on [memory.cobanov.dev](https://memory.cobanov.dev/) in **format** —
an interactive essay where the artifact itself is the hero rather than a
screenshot of it. Not in polish: that site is one very skilled person's craft
project. We are aiming for its structure with our content, honestly labelled.

**Explicitly out of scope.** A full assessment-tool web app is a separate
project with its own repo and timeline. This site presents findings. Keeping
that line is what lets us ship by Week 10.

## 2. The stack, and why

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js**, static export | Mostly-content page with a few interactive pieces. Static export means plain HTML out the other end. Largest ecosystem, so AI coding assistants are most reliable here — which matters given our experience mix. |
| Styling | **Plain CSS + CSS Modules** | No Tailwind, no UI library. One fewer thing to learn, one fewer thing to break. All design tokens in one file. |
| Language | **JavaScript, not TypeScript** | Contributors new to web development should not be fighting a type checker while learning. |
| Content | **JSON + Markdown in `content/`** | The keystone decision. See §3. |
| Hosting | **GitHub Pages** from the HUX org | Free, no new vendor, no new accounts, lives in infrastructure HUX already controls. |
| CI | **GitHub Actions** | Validates content on every pull request; deploys on merge. |

**No backend anywhere.** No database, no login, no API routes. Everything the
page does runs in the browser. This is not a cost-saving compromise — it is
what the deliverable actually needs, and it means there is nothing to patch,
nothing to pay for and no security surface to own after the internship ends.

### Options we considered and rejected

**Vercel.** Better developer experience, but its free tier prohibits commercial
use — defined broadly enough that a HUX-branded project likely does not qualify
— and its free tier may use hosted content for model training. Paid is
$20/seat/month for a static site we can host for nothing.

**Webflow / Framer / WordPress.** Non-coders can edit, which is genuinely
attractive. But our custom components *are* the deliverable, and builders resist
custom code — we would end up writing JavaScript anyway, inside a platform
fighting us, with a messy handover to HUX and an ongoing bill.

**Lovable and similar AI app builders.** Good for a throwaway visual spike.
Poor fit for the actual product: strongest at generic layouts, weakest at the
bespoke components that carry our value, and it leaves us maintaining code
nobody on the team designed.

**Cloudflare Pages** remains the fallback if HUX needs the repository to stay
private. GitHub Pages on a free plan requires a public repository.

## 3. The architecture decision that matters

**Content is separated from code.**

```
content/          matrix.json · scales.json · literature.json · sections/*.md
     ↓
lib/content.js    the only file that reads content/, handles draft filtering
     ↓
app/page.js       assembles the page, passes plain data down
     ↓
components/       render props. Never read files. Never contain matrix content.
```

Everything written on the page lives in `content/`. Components render whatever
they find there. Filter buttons, grid columns and legend entries are all derived
from the data, so **adding a row never requires a code change.**

This is what makes the split viable for a team with mixed experience:

- **Four or five people** contribute by editing data files in the browser. They
  never open a component, never install anything, never learn Git.
- **One or two people** own the code.
- Neither group blocks the other. Wording changes do not queue behind the one
  person who can run `npm install`.

It also prevents the failure mode where the site and the workbook drift apart:
the content files are exported from the workbook, so there is one source of
truth for what the matrix says.

## 4. Development flow

### For everyone (content)

Seven steps, entirely in the browser at github.com:

1. Open the file in `content/` → click the pencil icon
2. Make the change
3. Commit → **"Create a new branch and start a pull request"**
4. Automatic check runs (~2 min)
5. Green tick → a maintainer merges → live in about a minute
6. Red cross → click Details, read the plain-English message, fix, re-runs itself
7. Done

No terminal. No clone. No Node.js. **You cannot break the live site this way** —
that is the design, not a claim.

### For maintainers (code)

`git clone` → `npm install` → `npm run dev`. Build with `npm run build` before
pushing; if it fails locally it will fail in CI.

### The four safeguards

1. **Content validation in CI.** A zero-dependency script checks every content
   file before any build: valid JSON, valid risk ratings, required fields on
   published cells, and — the useful one — **every cited source must exist in
   the reference tracker**. Cite something that is not there and the build fails
   on purpose. Errors are written for non-developers, naming the file and the
   fix.

2. **Branch protection on `main`.** Pull request plus a passing check required.
   Nothing reaches the public site unreviewed. This mirrors the two-person
   release gate the matrix itself specifies at I2.

3. **Draft flags.** Any cell or section marked `"status": "draft"` is hidden
   from the live site and visible on preview builds. Draft content is
   **redacted server-side**, not merely hidden in the interface — hidden text
   still ships in the page source where anyone can read it. This is what lets us
   work in the open without publishing unreviewed research.

4. **One-click rollback.** Actions tab → last good deploy → Re-run all jobs.
   Republishes the previous version in two minutes. Documented in
   `docs/BREAK-GLASS.md` for someone who has never deployed anything.

## 5. On deploying before we are finished

Three things get conflated here, and separating them removes most of the risk:

**Deployed is not announced.** The site can be live at a URL nobody has been
given. We get a proven pipeline for weeks; the public gets nothing until launch.

**The preview site is unannounced, not secret.** Drafts are visible at the live
URL + `/preview/`, behind a PREVIEW BUILD banner and linked from nowhere public.
(As built: one always-on preview of `main`, not per-pull-request copies — the
same honesty rule applies: drafts are unreviewed, not confidential.)

**Visible work-in-progress labels beat hiding.** The site we are modelling on
ships a banner on its unfinished section saying the demo is a teaching sketch,
not production-validated guidance. For a project whose thesis is honest control
claims, shipping with visible scope limits is more on-brand than shipping late
and polished.

## 6. What is already done

- Working site, building and deploying, with the full L0 column live and the
  other five columns present as labelled drafts
- Interactive matrix, expandable definition lists, filterable reference tracker
- Content validator and both CI workflows
- `CONTRIBUTING.md` (both paths), `CLAUDE.md` (for AI-assisted work),
  `docs/BREAK-GLASS.md`, `docs/DEMO-GUIDE.md`

## 7. What we need to decide

| Question | Needed by | Who decides |
|---|---|---|
| Can the repository be public? Determines GitHub Pages vs Cloudflare Pages | This week | HUX |
| Who has org admin to enable Pages and Actions | This week | HUX |
| Named site maintainer **and named backup** | Before Week 8 | Team |
| Which columns commit to publishing by Week 10 | Week 7 | Team |
| Do we announce under HUX affiliation, and who owns the repo after Week 10 | Before launch | HUX + mentors |

The backup maintainer is the one people skip. One person who has actually merged
a pull request and re-run a deploy is the difference between a two-minute fix and
a lost launch week.

## 8. Risks

**Single maintainer.** The main risk, and the reason for the content/code split,
the documentation and the break-glass runbook. Mitigation is a named backup who
has done a real merge before Week 8 — not on the day.

**Columns not ready.** Handled by design: unpublished cells display as "In
progress" and the site is honest about being in progress. The site does not need
all 24 cells to launch.

**Scope creep into an app.** The interactive assessment tool will be tempting.
It is a separate project. The line is: this site *presents* the matrix; it does
not *compute* with it.
