'use client';

/**
 * ScenarioLibrary — the annotated use cases, Appendix D.
 *
 * Same filter pattern as ReferenceTable: the buttons are DERIVED from the
 * cards, so adding a card at a new autonomy level adds its filter by itself.
 *
 * A card never states its own colour or posture. Both are looked up from the
 * matrix cell its autonomy x impact pair points at, so a card can never drift
 * out of agreement with the grid above it.
 */

import { useState } from 'react';
import styles from './ScenarioLibrary.module.css';

export default function ScenarioLibrary({ scenarios, cells }) {
  const [filter, setFilter] = useState('All');

  const byId = Object.fromEntries(cells.map((c) => [c.id, c]));
  const levels = ['All', ...new Set(scenarios.cards.map((c) => c.autonomy))];
  const shown =
    filter === 'All' ? scenarios.cards : scenarios.cards.filter((c) => c.autonomy === filter);

  const tallest = Math.max(...scenarios.distribution.map((b) => b.count));

  return (
    <div>
      <p className={styles.lead}>{scenarios.lead}</p>

      <div className={styles.chart} aria-hidden="true">
        {scenarios.distribution.map((bucket) => (
          <div key={bucket.id} className={styles.bar}>
            <div
              className={styles.barFill}
              style={{ height: `${(bucket.count / tallest) * 100}%` }}
            />
            <p className={styles.barLabel}>
              {bucket.id} · {bucket.count}
            </p>
          </div>
        ))}
      </div>
      <p className={styles.chartCaption}>
        {scenarios.distributionLabel}:{' '}
        {scenarios.distribution.map((b) => `${b.id} ${b.count}`).join(', ')}.
      </p>

      <div className={styles.filters} role="group" aria-label="Filter scenarios by autonomy level">
        {levels.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setFilter(level)}
            aria-pressed={filter === level}
            className={`${styles.filter} ${filter === level ? styles.filterOn : ''}`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className={styles.cards}>
        {shown.map((card) => {
          const cell = byId[`${card.autonomy}-${card.impact}`];
          return (
            <article key={card.code} className={styles.card} data-risk={cell?.risk}>
              <div className={styles.cardHead}>
                <span className={styles.code}>{card.code}</span>
                <span className={styles.pair}>
                  {card.autonomy} × {card.impact}
                </span>
                <span className={styles.posture}>{cell?.posture}</span>
              </div>
              <h3 className={styles.name}>{card.name}</h3>
              <p className={styles.task}>{card.task}</p>
              <dl className={styles.fields}>
                {card.fields.map((field) => (
                  <div key={field.label} className={styles.field}>
                    <dt className={styles.fieldLabel}>{field.label}</dt>
                    <dd className={styles.fieldValue}>{field.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          );
        })}
      </div>

      <p className={styles.footnote}>{scenarios.footnote}</p>
    </div>
  );
}
