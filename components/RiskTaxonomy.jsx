'use client';

/**
 * RiskTaxonomy — the hierarchical risk register.
 *
 * Three levels, matching the workbook sheet: families (A–C) group domains
 * (A.1–C.3, workbook codes R1–R9), and each domain holds the child risks that
 * are the actual unit of assessment. Below the hierarchy sit the risk
 * amplification factors — deployment conditions that raise the impact of any
 * failure mode above.
 *
 * Same native-<details> approach as ScaleList: keyboard and screen-reader
 * behaviour comes for free. The dark summary bar is deliberate — it makes the
 * parent/child levels legible at a glance.
 *
 * "Expand all" works by remounting the <details> elements with a new key and
 * the open attribute set. Controlling `open` directly fights the browser once
 * a user has toggled one by hand; a remount sets a fresh default instead.
 */

import { useState } from 'react';
import styles from './RiskTaxonomy.module.css';

export default function RiskTaxonomy({ taxonomy }) {
  const [allOpen, setAllOpen] = useState(false);
  const [generation, setGeneration] = useState(0);

  const { families, amplificationFactors } = taxonomy;
  const domainCount = families.reduce((n, f) => n + f.domains.length, 0);
  const riskCount = families.reduce(
    (n, f) => n + f.domains.reduce((m, d) => m + d.risks.length, 0),
    0
  );

  const toggleAll = () => {
    setAllOpen(!allOpen);
    setGeneration(generation + 1);
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <p className={styles.count}>
          {families.length} families &middot; {domainCount} domains &middot; {riskCount} child risks
        </p>
        <button type="button" className={styles.toggle} onClick={toggleAll}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {families.map((family) => (
        <section key={family.id} className={styles.family}>
          <h3 className={styles.familyHead}>
            <span className={styles.familyId}>{family.id}</span>
            {family.name}
          </h3>
          <div className={styles.grid}>
            {family.domains.map((domain) => (
              <details key={`${domain.id}-${generation}`} className={styles.domain} open={allOpen}>
                <summary className={styles.summary}>
                  <span className={styles.domainId}>{domain.id}</span>
                  <span className={styles.domainName}>{domain.name}</span>
                  <span className={styles.domainMeta}>
                    {domain.code} · {domain.riskType}
                  </span>
                </summary>
                <ul className={styles.risks}>
                  {domain.risks.map((risk) => (
                    <li key={risk.id} className={styles.risk}>
                      <span className={styles.riskId}>{risk.id}</span>
                      <span className={styles.riskName}>{risk.name}</span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>
      ))}

      <p className={styles.footnote}>
        Child risks are the unit of assessment. A control cites a child ID such as B.2.1, never a
        family or domain alone.
      </p>

      {amplificationFactors?.length > 0 && (
        <div className={styles.amplifiers}>
          <h3 className={styles.amplifiersHead}>Risk amplification factors</h3>
          <p className={styles.amplifiersLead}>
            Deployment conditions that raise the impact of any failure mode above, whichever domain
            it comes from.
          </p>
          <ul className={styles.amplifierList}>
            {amplificationFactors.map((factor) => (
              <li key={factor.name} className={styles.amplifier}>
                <span className={styles.amplifierName}>{factor.name}</span>
                <span className={styles.amplifierDesc}>{factor.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
