# How to work on this site

There are two ways to contribute, and **most of the work is the first one.**

| | You want to | Read |
|---|---|---|
| **Path A** | Change wording, add a matrix cell, add a reference, edit a section | [Path A](#path-a--editing-content) — no software to install, works in your browser |
| **Path B** | Change how something looks or behaves, add a component | [Path B](#path-b--editing-code) — needs Node.js installed |

If you are not sure which you need: it is almost certainly Path A. Everything
written on the page comes from files in the `content/` folder.

---

## Why it is built this way

Three decisions shaped this repo, and knowing them will save you time.

**The site is static.** There is no server, no database and no login. The whole
thing is HTML, CSS and JavaScript files that get generated once and then served.
This means it is free to host, has nothing to keep patched, and will still work
in five years with nobody maintaining it.

**Content is separated from code.** All the writing lives in `content/` as data
files. The code just renders whatever it finds there. This is what lets most of
the team contribute without touching a component, and lets one or two people own
the code without becoming a bottleneck for every wording change.

**Nothing reaches the live site without passing a check.** Every change goes
through a pull request. An automatic check validates the content files and
rebuilds the site. If something is broken, it is caught there — not by a visitor.

---

## Path A — editing content

You do not need to install anything. You do not need to know Git. This all
happens on github.com in your browser.

### Before your first edit (one-time, five minutes)

1. Create a free account at [github.com](https://github.com) if you do not have
   one.
2. Accept the **repository invitation** — it arrives by email from GitHub when a
   maintainer adds you. Until you accept it, the buttons described below will
   look different (GitHub will talk about "forking"). If that happens, you have
   not accepted the invite yet.
3. Open the repository page and **bookmark it** — every edit starts there. If
   you do not have the link, ask in the project Slack channel.

### The seven steps

1. Go to the file you want to change in the `content/` folder on GitHub.
2. Click the **pencil icon** (top right of the file) to edit it.
3. Make your change.
4. Scroll to the bottom, write one line describing what you changed — start
   with the part you touched, then what you did. Examples:
   `L2: add I1 scenario and controls` · `references: add NIST AI 600-1` ·
   `intro: reword second paragraph`.
5. Choose **"Create a new branch for this commit and start a pull request"**, then
   **Propose changes**. GitHub suggests a branch name that starts with your
   username — keep it as is.
6. On the next screen, click **Create pull request**.
7. Wait about two minutes. A check runs automatically:
   - **Green tick** → ask a maintainer (see `docs/BREAK-GLASS.md` for who) to
     merge it. It will be live a minute later.
   - **Red cross** → click **Details** to see what is wrong. The message says which
     file and what to fix in plain English. Edit the file again on your branch and
     the check re-runs.

**If you closed the tab after a red cross:** go back to the repository page,
click the **Pull requests** tab, open yours, click the **Files changed** tab,
then the **pencil icon** on the file. You are now editing your branch again;
saving re-runs the check.

**You cannot break the live site this way.** That is the point of the design.
The worst case is a red cross and a message telling you what to fix.

### Seeing your work rendered

Draft cells and sections are hidden on the live site, so how do you see yours?
The **preview site** — the live URL with `/preview/` on the end. It shows
everything, drafts included, and carries a "PREVIEW BUILD" banner so it cannot
be mistaken for the real thing.

The loop most column owners will use:

1. Edit your cell, keep `"status": "draft"`, open the pull request as above.
2. After it is merged, wait two minutes and open the preview site. There is
   your cell, rendered.
3. Repeat until happy. Then change `"status"` to `"published"` in one final
   pull request — that is the step that puts it on the live site, so it is the
   one that needs review first.

The preview updates on the same two-minute cycle as the live site, and it is
public — drafts are unreviewed, not secret.

### Which file do I want?

| To change | Edit |
|---|---|
| A matrix cell: posture, controls, approval, rollback, rating | `content/matrix.json` |
| The L0–L5 or I0–I3 definitions, risk legend, audit categories | `content/scales.json` |
| A taxonomy family, domain or child risk (e.g. B.2.1), or an amplification factor | `content/taxonomy.json` |
| A reference | `content/literature.json` |
| Prose on the page (intro, method, limitations) | `content/sections/*.md` |

### Editing a matrix cell

Find your cell by its `id` — `"L3-I2"` is autonomy L3, impact I2. Fill in the
fields:

```json
{
  "id": "L3-I2",
  "autonomy": "L3",
  "impact": "I2",
  "owner": "Your name",
  "status": "draft",
  "risk": "high",
  "posture": "Strict human approval",
  "scenario": "Initiating automated customer refunds.",
  "controls": ["Human approval before execution", "Transaction limits", "Immutable approval logs"],
  "approval": "Named approver signs each transaction above the threshold.",
  "rollback": "Reverse the transaction and notify the customer within one business day.",
  "sources": ["NIST AI 600-1"]
}
```

Rules the checker enforces:

- `status` is `"draft"` or `"published"`. **Draft cells are hidden from the live
  site** and show as "In progress" — work in the open without publishing
  half-finished research. Set it to `"published"` when it has been reviewed.
- `risk` must be one of `low`, `medium`, `high`, `critical` — the ids from
  `scales.json`, not the display labels.
- Anything in `sources` must exist as a `refKey` in `literature.json`. If you
  cite something that is not in the tracker, **the build fails on purpose.** Add
  the reference first.
- Published cells need a `scenario`, at least one `control`, and a `rollback`.

One more habit that avoids headaches: **one cell (or one reference) per pull
request, merged promptly.** Everyone edits the same files, and two long-lived
branches touching the same file can conflict — small, quick pull requests never
get there.

### Adding a reference

Copy an existing entry in `content/literature.json` and change every field:

```json
{
  "refKey": "NIST AI 600-1",
  "usedBy": "All columns",
  "authors": "NIST (2023; Generative AI Profile July 2024)",
  "title": "AI Risk Management Framework 1.0 (AI 100-1) and Generative AI Profile (AI 600-1).",
  "type": "Framework",
  "evidences": "Names confabulation as a first-class risk; supplies testing, monitoring and incident-response actions.",
  "url": "https://www.nist.gov/itl/ai-risk-management-framework"
}
```

Rules the checker enforces:

- Every field except `url` is required. `url` is optional but worth adding for
  anything that is online.
- `refKey` is the short handle a matrix cell cites in its `sources` — it must be
  **unique**, and the spelling (including capitals) must match the cell exactly.
- `usedBy` is the column the reference supports (`"L0"` … `"L5"`), or
  `"All columns"`. The filter buttons above the reference list on the page are
  generated from this field.
- `type` says what kind of source it is (`Peer-reviewed`, `Regulation`,
  `Framework`, …), and `evidences` says in one sentence what the source
  actually supports. Be honest about weight — the tracker deliberately labels
  litigation as *"allegations, not findings"*.

### JSON, briefly

JSON is fussy about punctuation. Four rules cover almost every mistake:

- Text goes in `"double quotes"`. Never `'single'`.
- Every item in a list needs a comma after it — **except the last one**.
- Every `{` needs a matching `}`, every `[` a matching `]`.
- No comments. Lines starting with `//` will break it.

If the checker says "not valid JSON", paste the file into
[jsonlint.com](https://jsonlint.com) — it will point at the exact line.

### Editing prose

Files in `content/sections/` are Markdown. Each starts with a small block:

```markdown
---
title: How to use it
status: published
---

Your text here. **Bold** with double asterisks. Numbered lists work.
```

Keep the `---` lines. Set `status: draft` while you are still working on it —
draft sections do not appear on the live site.

---

## Path B — editing code

### One-time setup

You need two tools installed: **Git** and **Node.js 22 or later**. Commands
below are typed into **Terminal** on macOS (Cmd+Space, type "Terminal") or
**Git Bash** on Windows (installed with Git, below).

**Check what you already have** — you may be done before you start:

```bash
git --version     # any version is fine
node --version    # needs to say v22 or higher
```

If either says "command not found" (or Node is below 22):

- **Git** — macOS: run `xcode-select --install` and accept the prompt.
  Windows: install [Git for Windows](https://git-scm.com/download/win),
  accepting the defaults; this also gives you Git Bash.
- **Node.js** — download the **LTS installer** from
  [nodejs.org](https://nodejs.org) and run it, accepting the defaults.
  `npm` comes with it — there is nothing separate to install.

Close and reopen your terminal after installing, and run the two version
checks again.

**First time using Git on this machine?** Tell it who you are (this is what
appears next to your commits):

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

**Then get the project running:**

```bash
git clone <repo-url>     # the URL is under the green "Code" button on the repo page
cd hux-p2-agentic-risk-matrix
npm install
npm run dev              # open http://localhost:3000
```

Drafts are visible automatically in development, so you see everything.

### Making a change

Work on a branch, never directly on `main` — branch protection rejects direct
pushes to `main` anyway. The full loop, if Git is new to you:

```bash
git checkout main && git pull        # start from the latest version
git checkout -b yourname/what-it-is  # e.g. kevin/l2-scenario — see naming below
# ... make your changes ...
npm run build                        # validates content and builds the site
git add -A
git commit -m "L2: add I1 scenario and controls"
git push -u origin yourname/what-it-is
```

Then open the repository on GitHub — it shows a **Compare & pull request**
button for the branch you just pushed. Click it, then **Create pull request**.

**If `npm run build` fails locally it will fail in CI** — fix it before opening
the pull request.

### Branch names and commit messages

Two conventions, both one rule long:

- **Branch:** `yourname/short-description`, all lowercase, hyphens between
  words — `kevin/l2-scenario`, `frances/l5-references`. Your name goes in the
  branch so anyone scanning the branch list can see whose work it is without
  opening anything. (Path A editors: GitHub's suggested branch name already
  starts with your username, which is why step 5 says keep it.)
- **Commit message:** one line, `part: what you did` — `L2: add I1 scenario
  and controls`, `docs: fix broken CONTEXT link`, `validator: check taxonomy
  ids`. The "part" is whatever you touched: a column (L0–L5), a content file,
  `docs`, or a component name. No need to put your name in it — Git records
  the author automatically.

### Where things are

```
content/          The writing. See Path A.
lib/content.js    The only file that reads content/. Draft filtering lives here.
app/page.js       Assembles the page. Reads content, passes data to components.
app/globals.css   All design tokens and shared styles.
components/       One .jsx + one .module.css per component.
scripts/          The content validator.
assets/           Design references, not served. hux-palette.png is the HUX
                  brand swatch the risk colours are drawn from — if you touch
                  the colour tokens in globals.css, match against it.
.github/workflows/ CI checks and deployment.
```

Data flows one way: `content/` → `lib/` → `page.js` → components. Components
receive props and render. They never read files.

### Adding a component

Copy the pattern in `components/RiskLegend.jsx` — it is the simplest one. If you
need click state, copy `ScaleList.jsx` instead. Then:

1. Create `components/YourThing.jsx` and `components/YourThing.module.css`.
2. Import it in `app/page.js` and pass it data from `lib/content.js`.
3. Run `npm run build`.

Three rules that will save you an afternoon:

- Attribute selectors like `[data-risk="high"]` **fail the build** inside a
  `.module.css` file. Put them in `app/globals.css`.
- Add `'use client'` at the top only if the component uses `useState` or event
  handlers.
- **Check your component at phone width** — drag the browser window narrow (or
  open device mode in dev tools) before opening the pull request. Layouts should
  reflow or stack on small screens; if something is genuinely too wide to reflow,
  wrap it in a container with `overflow-x: auto` so it scrolls sideways on its
  own, the way the matrix grid does — the page itself must never scroll
  horizontally.

### If you use Claude Code

Read `CLAUDE.md` first, and point Claude at it. It documents the constraints that
are easy to violate accidentally — particularly "no backend", "content is data,
not code", and the draft-redaction rule. Ask Claude to run `npm run build`
before it tells you a change works.

---

## Merging a pull request (maintainers)

If you are the maintainer on duty (see the contact table in
`docs/BREAK-GLASS.md`), merging is three clicks:

1. Open the pull request. Confirm the check shows a **green tick** — if it is
   red, do not merge; ask the author to fix it (the Details link says what).
2. Skim the **Files changed** tab. For content changes you are checking one
   thing: does the change say what the author meant it to say? The validator has
   already checked the structure.
3. Click **Merge pull request**, then **Confirm merge**. The site republishes
   itself in about two minutes — nothing else to run.

If a merge publishes something wrong, `docs/BREAK-GLASS.md` covers rolling back.

## Deployment

Merging to `main` publishes the site automatically in about two minutes. There is
nothing to run and nobody to ask. Each deploy publishes two things from the same
build: the live site (drafts hidden) at the root URL, and the preview site
(drafts visible, banner on top) at `/preview/`.

**If something goes wrong on the live site**, see `docs/BREAK-GLASS.md`. The
short version: Actions tab → last good "Deploy" run → **Re-run all jobs**. That
republishes the previous version.

### One-time repository setup (admin)

Already done for this repo. Recorded here so it can be redone if the repository
is ever transferred or recreated. Needs admin rights on the repo:

1. **Enable Pages:** Settings → Pages → under "Build and deployment", set
   Source to **GitHub Actions**. Without this, the deploy workflow fails on
   every merge.
2. **Protect `main`:** Settings → Branches → Add branch ruleset (or classic
   protection rule) for `main`: require a **pull request before merging** and
   require the **check** job (from the "Check content" workflow) to pass. This
   is what turns "every change goes through a PR and a green tick" from a
   convention into a guarantee — including for maintainers.
3. **Invite the team:** Settings → Collaborators → add each contributor with
   **Write** access. Until someone accepts their email invitation, the Path A
   buttons look different for them (GitHub offers a fork instead).
4. **Fill the contact table** in `docs/BREAK-GLASS.md` and confirm the backup
   maintainer has merged one pull request and re-run one deploy themselves.
5. **Test the kill switch once:** Settings → Pages → Source → **None**, confirm
   the site stops serving, set it back to **GitHub Actions**.

---

## Getting help

Open an issue in this repo, or ask in the project Slack channel. If you are stuck
on a red cross that does not make sense, paste the error message — it is usually
a missing comma.
