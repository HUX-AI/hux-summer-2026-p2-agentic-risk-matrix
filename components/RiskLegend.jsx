/**
 * RiskLegend — a simple, non-interactive component.
 *
 * This is the pattern to copy if you are adding a new display component:
 * it takes data as a prop, renders it, holds no state, and has no 'use client'
 * line because it never runs in the browser.
 */

import styles from './RiskLegend.module.css';

export default function RiskLegend({ riskLegend }) {
  return (
    <ul className={styles.legend}>
      {riskLegend.map((level) => (
        <li key={level.id} className={styles.item}>
          <span className={styles.swatch} data-risk={level.id} aria-hidden="true" />
          <div>
            <span className={styles.label}>{level.label}</span>
            <span className={styles.posture}>{level.posture}</span>
            <span className={styles.note}>{level.note}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
