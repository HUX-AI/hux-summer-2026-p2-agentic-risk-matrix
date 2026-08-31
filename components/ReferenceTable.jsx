'use client';

/**
 * ReferenceTable — the shared reference tracker, filterable by column owner.
 *
 * Pattern to copy for any component that filters a list. Note that the filter
 * options are DERIVED from the data rather than hardcoded: add a reference with
 * a new "usedBy" value and a new filter button appears by itself. Avoid
 * hardcoding anything that could be read from content/.
 */

import { useState } from 'react';
import { slugify } from './ControlMatrix';
import styles from './ReferenceTable.module.css';

export default function ReferenceTable({ references }) {
  const [filter, setFilter] = useState('All');

  const owners = ['All', ...new Set(references.map((r) => r.usedBy))];
  const shown = filter === 'All' ? references : references.filter((r) => r.usedBy === filter);

  return (
    <div>
      <div className={styles.filters} role="group" aria-label="Filter references by column">
        {owners.map((owner) => (
          <button
            key={owner}
            type="button"
            onClick={() => setFilter(owner)}
            aria-pressed={filter === owner}
            className={`${styles.filter} ${filter === owner ? styles.filterOn : ''}`}
          >
            {owner}
          </button>
        ))}
      </div>

      <ol className={styles.list}>
        {shown.map((ref) => (
          <li key={ref.refKey} id={`ref-${slugify(ref.refKey)}`} className={styles.item}>
            <div className={styles.key}>
              <span className={styles.refKey}>{ref.refKey}</span>
              <span className={styles.type}>{ref.type}</span>
            </div>
            <div>
              <p className={styles.citation}>
                <strong>{ref.authors}</strong> {ref.title}
              </p>
              <p className={styles.evidences}>{ref.evidences}</p>
              {ref.url && (
                <a
                  className={styles.link}
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Open source — ${ref.refKey}`}
                >
                  Open source ↗
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
