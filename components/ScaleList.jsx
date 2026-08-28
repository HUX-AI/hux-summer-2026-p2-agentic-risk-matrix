'use client';

/**
 * ScaleList — an expandable list of the L0-L5 or I0-I3 definitions.
 *
 * Pattern to copy for any "click to reveal more" component. Uses the native
 * <details> element rather than custom state, so keyboard and screen-reader
 * behaviour is correct without any extra work.
 */

import styles from './ScaleList.module.css';

export default function ScaleList({ items, idLabel }) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <details key={item.id} className={styles.row}>
          <summary className={styles.summary}>
            <span className={styles.id}>{item.id}</span>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.short}>{item.summary}</span>
          </summary>
          <p className={styles.detail}>{item.detail}</p>
        </details>
      ))}
      <p className={styles.footnote}>{idLabel}</p>
    </div>
  );
}
