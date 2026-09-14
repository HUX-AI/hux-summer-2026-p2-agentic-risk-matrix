/**
 * ReconciliationTable — where the independently-authored drafts disagreed,
 * Appendix C Table C1.
 *
 * Display only, no state, no 'use client'. Copy this component's shape for any
 * plain table: a real <table> with scope'd headers, wrapped in its own
 * overflow-x container so the table scrolls sideways rather than the page.
 */

import styles from './ReconciliationTable.module.css';

export default function ReconciliationTable({ reconciliation }) {
  const { lead, headers, rows, note } = reconciliation;

  return (
    <div>
      <p className={styles.lead}>{lead}</p>
      <div className={styles.scroller}>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.map((head) => (
                <th key={head} scope="col" className={styles.head}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.cell}>
                <th scope="row" className={styles.cellId}>
                  {row.cell}
                </th>
                <td className={styles.soft}>{row.column}</td>
                <td className={styles.soft}>{row.review}</td>
                <td className={styles.resolved}>{row.resolved}</td>
                <td className={styles.soft}>{row.basis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.note}>{note}</p>
    </div>
  );
}
