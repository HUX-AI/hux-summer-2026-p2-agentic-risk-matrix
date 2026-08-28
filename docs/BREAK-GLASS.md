# Break glass

What to do when something is wrong with the live site and the person who built it
is not available. Written to be followed by someone who has never deployed a
website.

Work down the list. Stop when it is fixed.

---

## The live site shows something wrong

**Undo the last deploy. Two minutes, no code.**

1. Go to the repository → **Actions** tab.
2. In the left sidebar, click **Deploy to GitHub Pages**.
3. Find the last run that has a **green tick** and predates the problem.
4. Open it → **Re-run all jobs** (top right).
5. Wait about two minutes and reload the site.

This republishes that older version. Nothing is lost — the newer changes are
still in the repository, they are just not published.

Then open an issue describing what was wrong, so it can be fixed properly.

---

## A pull request shows a red cross

Nothing is broken on the live site. The check did its job and stopped a bad
change.

1. On the pull request, click **Details** next to the red cross.
2. Scroll to the red text. It names the file and the problem in plain language.
3. Common causes:
   - **"not valid JSON"** → a missing comma, or a comma after the last item in a
     list. Paste the file into [jsonlint.com](https://jsonlint.com).
   - **"cites X, which is not in literature.json"** → add the reference to
     `content/literature.json` first, or fix the spelling. `refKey` is
     case-sensitive.
   - **"risk ... is not one of low, medium, high, critical"** → use the id, not
     the display label.
   - **"published cells need a scenario"** → either fill it in, or set
     `"status": "draft"`.
4. Edit the file again on the same branch. The check re-runs by itself.

---

## The deploy workflow itself is failing

1. Actions → the failed run → open the red step and read the last 20 lines.
2. If it says something about **Pages not enabled**: Settings → Pages → Source →
   **GitHub Actions**. Someone with admin rights on the org has to do this.
3. If it mentions **npm** or **install**: a dependency has probably broken. Open
   an issue and tag the maintainers. Do not attempt an upgrade under time
   pressure before the launch.

---

## Nothing appears on the site at all

The most likely cause is that everything is still marked as draft. Drafts do not
appear on the live site by design — but they DO appear on the preview site (the
live URL + `/preview/`). If the content is there, nothing is broken.

Check `content/matrix.json` and the files in `content/sections/` for
`"status": "draft"`. Change to `"published"` when the content is reviewed.

---

## We need to take the site down immediately

Settings → Pages → under **Build and deployment**, set Source to **None**. The
site stops being served. Set it back to **GitHub Actions** to restore it.

This is the equivalent of the kill switch the matrix itself asks for at I2 and
above. Worth testing once before launch so you know it works.

---

## Who to contact

Fill this in before the handover and keep it current.

| Role | Name | Contact |
|---|---|---|
| Site maintainer | | |
| Backup maintainer | | |
| HUX AI GitHub org admin | | |
| Project mentor | | |

**Do not leave the backup blank.** One named person who has actually merged a
pull request and re-run a deploy is the difference between a two-minute fix and a
lost launch week.
