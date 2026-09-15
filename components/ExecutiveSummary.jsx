/**
 * ExecutiveSummary — the opening argument, plus the four deliverables and the
 * two findings the report rests on.
 *
 * The prose comes from content/sections/01-summary.md and arrives already
 * rendered to HTML by lib/content.js. The two lists come from
 * content/report.json. Display only, no state.
 */

import styles from './ExecutiveSummary.module.css';

export default function ExecutiveSummary({ html, assets, findings }) {
  return (
    <div className={styles.grid}>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      <div>
        <p className={styles.label}>Four linked assets</p>
        <ol className={styles.assets}>
          {assets.map((asset) => (
            <li key={asset.n} className={styles.asset}>
              <span className={styles.assetNumber}>{asset.n}</span>
              <span>
                <span className={styles.assetName}>{asset.name}</span>
                <span className={styles.assetNote}>{asset.note}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className={styles.findings}>
          <p className={styles.label}>{findings.label}</p>
          {findings.items.map((item) => (
            <p key={item} className={styles.finding}>
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
