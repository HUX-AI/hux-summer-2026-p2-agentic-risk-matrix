'use client';

/**
 * ControlMatrix — the centrepiece of the page.
 *
 * WHAT IT DOES
 *   Draws the autonomy x impact grid and shows the selected cell's control set
 *   underneath. Nothing about the matrix content is written here: every label,
 *   posture, control and rating comes from content/matrix.json and
 *   content/scales.json.
 *
 * IF YOU ARE EDITING CONTENT
 *   You do not need this file. Edit content/matrix.json.
 *
 * IF YOU ARE EDITING CODE
 *   This is a client component because it holds selection state. It receives
 *   all its data as props from app/page.js, which reads the files on the
 *   server at build time. Keep it that way — do not import from lib/content.js
 *   here, it will not work in the browser.
 */

import { useState } from 'react';
import styles from './ControlMatrix.module.css';

export default function ControlMatrix({ cells, autonomyLevels, impactClasses, riskLegend, showDrafts }) {
  const [selectedId, setSelectedId] = useState('L0-I3');

  const byId = Object.fromEntries(cells.map((c) => [c.id, c]));
  const selected = byId[selectedId];
  const riskById = Object.fromEntries(riskLegend.map((r) => [r.id, r]));

  const isHidden = (cell) => cell.status === 'draft' && !showDrafts;

  return (
    <div>
      <p className={styles.scrollHint} aria-hidden="true">
        Scroll the grid sideways for all {autonomyLevels.length} autonomy levels →
      </p>
      <div className={styles.scroller}>
        <table className={styles.grid}>
          <caption className={styles.caption}>
            Select any cell to see its control set. Rows are impact, columns are autonomy.
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.corner}>
                <span className={styles.cornerImpact}>Impact ↓</span>
                <span className={styles.cornerAutonomy}>Autonomy →</span>
              </th>
              {autonomyLevels.map((level) => (
                <th key={level.id} scope="col" className={styles.colHead}>
                  <span className={styles.axisId}>{level.id}</span>
                  <span className={styles.axisName}>{level.name}</span>
                  <span className={styles.axisSummary}>{level.summary}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {impactClasses.map((impact) => (
              <tr key={impact.id}>
                <th scope="row" className={styles.rowHead}>
                  <span className={styles.axisId}>{impact.id}</span>
                  <span className={styles.axisName}>{impact.name}</span>
                  <span className={styles.axisSummary}>{impact.summary}</span>
                </th>
                {autonomyLevels.map((level) => {
                  const cell = byId[`${level.id}-${impact.id}`];
                  if (!cell) return <td key={level.id} className={styles.cell} />;
                  const hidden = isHidden(cell);
                  return (
                    <td key={level.id} className={styles.cell}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(cell.id)}
                        aria-pressed={selectedId === cell.id}
                        className={[
                          styles.cellButton,
                          selectedId === cell.id ? styles.cellSelected : '',
                          hidden ? styles.cellHidden : '',
                        ].join(' ')}
                        data-risk={hidden ? 'empty' : cell.risk}
                      >
                        <span className={styles.cellPosture}>
                          {hidden ? 'In progress' : cell.posture}
                        </span>
                        {cell.status === 'draft' && showDrafts && (
                          <span className={styles.cellDraft}>draft</span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <CellDetail
          cell={selected}
          risk={riskById[selected.risk]}
          autonomy={autonomyLevels.find((l) => l.id === selected.autonomy)}
          impact={impactClasses.find((i) => i.id === selected.impact)}
          hidden={isHidden(selected)}
        />
      )}
    </div>
  );
}

function CellDetail({ cell, risk, autonomy, impact, hidden }) {
  return (
    <article className={styles.detail} aria-live="polite">
      <header className={styles.detailHead}>
        <span className={styles.detailId} data-risk={hidden ? 'empty' : cell.risk}>
          {cell.autonomy} × {cell.impact}
        </span>
        <div>
          <h3 className={styles.detailPosture}>{hidden ? 'Not yet published' : cell.posture}</h3>
          <p className={styles.detailAxes}>
            {autonomy?.name} — {autonomy?.summary}. Impact: {impact?.name.toLowerCase()}, {impact?.summary.toLowerCase()}.
          </p>
        </div>
        <span className={styles.detailRisk} data-risk={hidden ? 'empty' : cell.risk}>
          {hidden ? '—' : risk?.label}
        </span>
      </header>

      {hidden ? (
        <p className={styles.detailEmpty}>
          This cell is still being researched{cell.owner ? ` by ${cell.owner}` : ''}. It will appear here once
          reviewed and published.
        </p>
      ) : (
        <>
          <p className={styles.detailScenario}>{cell.scenario}</p>

          <div className={styles.detailCols}>
            <div>
              <h4 className={styles.detailLabel}>Required controls</h4>
              <ul className={styles.controlList}>
                {cell.controls.map((control) => (
                  <li key={control}>{control}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={styles.detailLabel}>Approval &amp; logging</h4>
              <p className={styles.detailBody}>{cell.approval}</p>
              <h4 className={styles.detailLabel}>Rollback</h4>
              <p className={styles.detailBody}>{cell.rollback}</p>
            </div>
          </div>

          {cell.sources?.length > 0 && (
            <p className={styles.detailSources}>
              <span className={styles.detailLabel}>Evidence</span>
              {cell.sources.map((s) => (
                <a key={s} href={`#ref-${slugify(s)}`} className={styles.sourceChip}>
                  {s}
                </a>
              ))}
            </p>
          )}
        </>
      )}
    </article>
  );
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
