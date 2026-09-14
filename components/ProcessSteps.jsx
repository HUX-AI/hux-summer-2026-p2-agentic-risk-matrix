/**
 * ProcessSteps — the four-step assessment protocol.
 *
 * Steps come from content/report.json. Adding a fifth step is a content
 * change: the grid reflows on its own and no code changes.
 */

import styles from './ProcessSteps.module.css';

export default function ProcessSteps({ steps, note }) {
  return (
    <div>
      <ol className={styles.steps}>
        {steps.map((step, i) => (
          <li key={step} className={styles.step}>
            <span className={styles.stepNumber}>Step {i + 1}</span>
            <span className={styles.stepBody}>{step}</span>
          </li>
        ))}
      </ol>
      <p className={styles.note}>{note}</p>
    </div>
  );
}
