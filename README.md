# Agentic AI Risk Control Matrix

Public output of **HUX AI Research Internship, Project 2** (Summer 2026).

An interactive presentation of a control matrix mapping AI **autonomy levels
(L0–L5)** against **impact classes (I0–I3)**, with the controls, evidence
requirements and rollback plan owed at each intersection.

**A governance instrument, not an assurance certificate.**

---

## Start here

| You are | Read |
|---|---|
| Editing wording, cells or references | **[CONTRIBUTING.md → Path A](CONTRIBUTING.md#path-a--editing-content)** — browser only, nothing to install |
| Working on the code | **[CONTRIBUTING.md → Path B](CONTRIBUTING.md#path-b--editing-code)** |
| Naming a branch or writing a commit message | **[CONTRIBUTING.md → Branch names and commit messages](CONTRIBUTING.md#branch-names-and-commit-messages)** |
| Merging pull requests (maintainer on duty) | **[CONTRIBUTING.md → Merging a pull request](CONTRIBUTING.md#merging-a-pull-request-maintainers)** |
| Setting the repository up from scratch (admin) | **[CONTRIBUTING.md → One-time repository setup](CONTRIBUTING.md#one-time-repository-setup-admin)** |
| Using Claude Code or another AI assistant | **[CLAUDE.md](CLAUDE.md)** |
| Presenting or demoing the site | **[docs/DEMO-GUIDE.md](docs/DEMO-GUIDE.md)** |
| Fixing something that is broken | **[docs/BREAK-GLASS.md](docs/BREAK-GLASS.md)** |
| Wondering why it is built this way | **[docs/PROPOSAL.md](docs/PROPOSAL.md)** |

## Running it locally

Requires Node.js 22+. If you need to install Git or Node first, follow
[CONTRIBUTING.md → One-time setup](CONTRIBUTING.md#one-time-setup).

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run check    # validate content files only
npm run build    # validate + build the static site into out/
```

## How it works, in one paragraph

Everything written on the page lives in `content/` as JSON and Markdown.
`lib/content.js` reads it, `app/page.js` passes it to components, and the
components render it. Nothing is hardcoded in a component, so most contributions
never touch code. A validator runs before every build and on every pull request;
merging to `main` deploys automatically in about two minutes.

## Deployment

GitHub Pages, built by GitHub Actions on every push to `main`. Static export —
no server, no database, no secrets.
