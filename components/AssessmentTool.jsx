'use client';

/**
 * AssessmentTool — the scoring instrument, Appendix E.
 *
 * WHAT IT DOES
 *   Takes the base tier from the matrix, escalates it by an amplifier score,
 *   caps it at tier 4, and reports control coverage SEPARATELY. The separation
 *   is the point: coverage never lowers the inherent tier, so a deployment can
 *   hold 87% of its expected controls and still be unacceptable as configured.
 *
 * IF YOU ARE EDITING CONTENT
 *   Every weight, threshold, band and option label is in
 *   content/assessment.json under "scoring". Those numbers are project
 *   calibration constants with no external derivation — if the workbook moves
 *   one, move it there, not here.
 *
 * IF YOU ARE EDITING CODE
 *   scoreDeployment() below is the whole model and is deliberately pure: given
 *   the same inputs it returns the same result, with no reads of component
 *   state. Keep it that way so it stays checkable against the workbook.
 */

import { useState } from 'react';
import styles from './AssessmentTool.module.css';

export function scoreDeployment(config, state, tierOf) {
  const baseTier = tierOf(state.autonomy, state.impact);

  const flagScore = config.flags.reduce((n, f) => n + (state.flags[f.key] ? f.weight : 0), 0);
  const amplifierScore = config.amplifierGroups.reduce((n, g) => n + (state.amplifiers[g.key] || 0), 0) + flagScore;

  const escalation = config.escalationThresholds.find((t) => amplifierScore >= t.atLeast)?.tiers ?? 0;
  const inherentTier = Math.min(4, baseTier + escalation);

  const available = config.controlPoints.reduce((n, r) => n + r.options.length - 1, 0);
  const points = config.controlPoints.reduce((n, r) => n + (state.controls[r.key] || 0), 0);
  const coverage = Math.round((points / available) * 100);
  const band = config.coverageBands.find((b) => coverage < b.below)?.label ?? '';

  const minimum = config.minimumPointsByTier[String(inherentTier)];
  const status =
    inherentTier === 4
      ? config.unacceptableStatus
      : points >= minimum
        ? `Control set meets the minimum for this tier — ${points} of a required ${minimum} control points.`
        : `Control gap: ${points} of a required ${minimum} control points at this tier.`;

  return { baseTier, amplifierScore, escalation, inherentTier, points, available, coverage, band, status };
}

export default function AssessmentTool({ scoring, autonomyLevels, impactClasses, cells, riskLegend }) {
  const [state, setState] = useState(() => ({
    autonomy: scoring.defaults.autonomy,
    impact: scoring.defaults.impact,
    amplifiers: { ...scoring.defaults.amplifiers },
    flags: Object.fromEntries(scoring.defaults.flags.map((k) => [k, true])),
    controls: { ...scoring.defaults.controls },
    evidence: scoring.defaults.evidence,
  }));

  const tierById = Object.fromEntries(riskLegend.map((r) => [r.id, r.tier]));
  const cellAt = (autonomy, impact) => cells.find((c) => c.id === `${autonomy}-${impact}`);
  const tierOf = (autonomy, impact) => tierById[cellAt(autonomy, impact).risk];

  const out = scoreDeployment(scoring, state, tierOf);
  const cell = cellAt(state.autonomy, state.impact);
  const inherentRisk = riskLegend.find((r) => r.tier === out.inherentTier);

  const set = (patch) => setState({ ...state, ...patch });

  const loadWorked = () => {
    const w = scoring.workedExample;
    setState({
      autonomy: w.autonomy,
      impact: w.impact,
      amplifiers: { ...w.amplifiers },
      flags: Object.fromEntries(w.flags.map((k) => [k, true])),
      controls: { ...w.controls },
      evidence: w.evidence,
    });
  };

  return (
    <>
      <p className={styles.lead}>{scoring.lead}</p>

      <div className={styles.layout}>
        <div>
          <p className={styles.label}>Autonomy level</p>
          <div className={styles.options}>
            {autonomyLevels.map((l) => (
              <Choice
                key={l.id}
                label={`${l.id} ${l.name}`}
                on={state.autonomy === l.id}
                onPick={() => set({ autonomy: l.id })}
              />
            ))}
          </div>

          <p className={styles.label}>Impact class</p>
          <div className={styles.options}>
            {impactClasses.map((i) => (
              <Choice
                key={i.id}
                label={`${i.id} ${i.name}`}
                on={state.impact === i.id}
                onPick={() => set({ impact: i.id })}
              />
            ))}
          </div>

          <p className={styles.label}>Amplifiers — weights from Table E2</p>
          {scoring.amplifierGroups.map((group) => (
            <div key={group.key} className={styles.group}>
              <p className={styles.groupLabel}>{group.label}</p>
              <div className={styles.options}>
                {group.options.map((option, i) => (
                  <Choice
                    key={option}
                    label={`${option} · ${i}`}
                    small
                    on={state.amplifiers[group.key] === i}
                    onPick={() => set({ amplifiers: { ...state.amplifiers, [group.key]: i } })}
                  />
                ))}
              </div>
            </div>
          ))}

          <p className={styles.groupLabel}>Exposure flags</p>
          <div className={styles.options} role="group" aria-label="Exposure flags">
            {scoring.flags.map((flag) => (
              <Choice
                key={flag.key}
                label={`${flag.label} · ${flag.weight}`}
                small
                on={!!state.flags[flag.key]}
                onPick={() => set({ flags: { ...state.flags, [flag.key]: !state.flags[flag.key] } })}
              />
            ))}
          </div>

          <p className={styles.label}>
            Control points — Table E3, {out.available} available
          </p>
          {scoring.controlPoints.map((row) => (
            <div key={row.key} className={styles.controlRow}>
              <p className={styles.groupLabel}>
                {row.label}{' '}
                <span className={styles.score}>
                  {state.controls[row.key] || 0} / {row.options.length - 1}
                </span>
              </p>
              <div className={styles.options}>
                {row.options.map((option, i) => (
                  <Choice
                    key={option}
                    label={option}
                    small
                    on={(state.controls[row.key] || 0) === i}
                    onPick={() => set({ controls: { ...state.controls, [row.key]: i } })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.output} data-risk={inherentRisk?.id}>
          <div className={styles.outputHead}>
            <span className={styles.pair}>
              {state.autonomy} × {state.impact}
            </span>
            <span className={styles.posture}>{cell.posture}</span>
          </div>

          <dl className={styles.lines}>
            <Line label="Base rating, Table E1" value={`tier ${out.baseTier}`} />
            <Line label="Amplifier score" value={String(out.amplifierScore)} />
            <Line
              label="Escalation"
              value={out.escalation === 0 ? 'none' : `+${out.escalation} tier${out.escalation > 1 ? 's' : ''}`}
            />
            <Line label="Inherent tier (cap 4)" value={`tier ${out.inherentTier}`} />
            <Line label="Control points" value={`${out.points} / ${out.available}`} />
            <Line label="Indicative coverage" value={`${out.coverage}% — ${out.band}`} />
            <Line label="Evidence readiness" value={state.evidence} />
          </dl>

          <p className={styles.outputLabel}>Status</p>
          <p className={styles.status} aria-live="polite">
            {out.status}
          </p>

          <p className={styles.outputLabel}>Evidence readiness, reported separately</p>
          <div className={styles.options}>
            {scoring.evidenceStates.map((e) => (
              <Choice key={e} label={e} small on={state.evidence === e} onPick={() => set({ evidence: e })} />
            ))}
          </div>

          <p className={styles.note}>{scoring.note}</p>
          <button type="button" className={styles.loadButton} onClick={loadWorked}>
            {scoring.workedExample.label}
          </button>
        </div>
      </div>
    </>
  );
}

function Choice({ label, on, onPick, small }) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={on}
      className={`${styles.choice} ${small ? styles.choiceSmall : ''} ${on ? styles.choiceOn : ''}`}
    >
      {label}
    </button>
  );
}

function Line({ label, value }) {
  return (
    <div className={styles.line}>
      <dt className={styles.lineLabel}>{label}</dt>
      <dd className={styles.lineValue}>{value}</dd>
    </div>
  );
}
