/**
 * StatementList — a two-column list of named statements. Used for the
 * limitations, and suitable for any "term, then what it means" set.
 *
 * Display only, no state. Copy this if you need a definition list: it is the
 * smallest component in the project and shows the whole pattern — props in,
 * a native <dl> out, nothing read from the filesystem.
 */

import styles from './StatementList.module.css';

export default function StatementList({ lead, items }) {
  return (
    <div>
      {lead && <p className={styles.lead}>{lead}</p>}
      <dl className={styles.list}>
        {items.map((item) => (
          <div key={item.name} className={styles.row}>
            <dt className={styles.name}>{item.name}</dt>
            <dd className={styles.statement}>{item.statement}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
