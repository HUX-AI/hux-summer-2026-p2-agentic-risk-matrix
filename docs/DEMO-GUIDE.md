# Demo guide

For anyone presenting this site live — to the team, to mentors, or at the Week 10
launch.

---

## The 30-second version

> "Enterprise AI is moving from systems that answer to systems that act. Most
> organisations govern both with the same policy. This matrix separates two
> questions — how much can it do on its own, and how bad is it if it's wrong —
> and tells you what controls you owe at the intersection."

---

## The five-minute demo

**1. Open on the matrix.** Do not scroll first. The grid is the argument; the
prose supports it. Let people look at it for a beat before talking.

**2. Explain the axes, briefly.** Columns are autonomy, L0 (information only)
through L5 (open agent). Rows are impact, I0 (negligible) through I3 (critical).
Colour is risk. Point out that colour appears nowhere else on the page — that is
deliberate, so colour always means one thing.

**3. Click `L0 × I0`.** Low, teal, permitted. An internal FAQ assistant.
Baseline controls: disclosure, retrieval scoping, logging, a named owner.
Establishes the floor.

**4. Now click `L0 × I3` — this is the demo.** Same column. Same technology. The
system still cannot *do* anything: no tools, no write access. But the rating is
high and the control set is long — impact assessment, professional-authored
content, deterministic crisis routing, 24/7 suspension authority.

Then say the line the whole matrix exists to make sayable:

> "Low autonomy does not mean low impact. At L0 the system has no action
> capability, so impact isn't set by what the agent can do — it's set by what a
> human does with the answer. Systems with no tool access at all are the subject
> of wrongful-death litigation."

Click the **Raine / Garcia** chip to jump to the reference. That move — cell to
evidence in one click — is the thing that separates this from a slide.

**5. Contrast down the column if you have time.** `L5 × I3` is prohibited. The
grid gets darker to the bottom-right — purple is the tier beyond red — but the
top-left corner is not empty of risk. Both halves of that sentence matter.

**6. Close on the reference tracker.** Filter to "All columns". Every rating cites
evidence; every source says what it evidences and what type it is. Point out that
the litigation entry is explicitly typed *"allegations, not findings"* — the
matrix is careful about the weight of its own evidence.

---

## Questions you will get, and honest answers

**"Why is L0/I3 high and not critical?"**
Because critical is the top assurance tier — regulatory and compliance grade —
and prohibition is a *cell posture*, not a colour. Safeguarding and crisis
information services should exist, so the right posture here is restricted
deployment with exceptional justification, not prohibition. The control set is
what carries the weight, not the colour.

**"Some cells are empty."**
Those columns are still being researched, and we would rather show the shape of
the unfinished work than pretend it is done. Drafts are hidden from the public
build and visible on our internal previews.

**"Is this compliance advice?"**
No. It is a governance instrument, not an assurance certificate, and not legal
advice. It helps you ask the right questions before deploying; it does not
certify anything. That is stated in the limitations section and the footer.

**"How is it different from NIST AI RMF or ISO 42001?"**
Those tell you to manage risk proportionately. They do not tell you what
proportionate looks like for an agent that can issue refunds. This is the layer
underneath: a specific posture at a specific intersection, with the evidence for
why.

**"Could we use this on a real client engagement?"**
That is the intent — it was built as a HUX AI asset. It is at v1, several columns
are unpublished, and the ratings would need reviewing against the client's own
impact definitions. Worth being straight about that rather than overselling.

**"What's it built with?"**
A static site — Next.js exported to plain HTML, hosted on GitHub Pages. No
server, no database, nothing to maintain. All the content lives in data files, so
the research team edits it without touching code.

---

## Before you present

- [ ] Open the site once **that morning**. Deploys are automatic; make sure the
      last one worked.
- [ ] Check whether you are on the **live URL or the preview site** (the live
      URL + `/preview/`). The preview shows draft cells and carries a
      "PREVIEW BUILD" banner — fine internally, confusing to an external
      audience.
- [ ] Have `L0 × I3` pre-clicked if you are screen-sharing cold.
- [ ] Zoom to about 110% on a projector. The grid is dense.
- [ ] The grid scrolls sideways on a narrow window. Widen the browser before
      sharing your screen.

---

## What not to claim

Three things to avoid saying, because they are not true and someone in the room
will know:

- **Do not say the matrix makes a system safe.** It structures a decision. It
  does not assure an outcome.
- **Do not present the litigation cases as findings.** They are filed
  allegations. Say "the subject of wrongful-death claims", not "was found to have
  caused".
- **Do not claim the columns are consistent yet.** They were researched
  separately against a shared scale, and reconciliation is ongoing. Saying so
  makes the work more credible, not less.
