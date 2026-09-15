'use client';

/**
 * ClassificationTree — the seven-question autonomy classifier, Appendix B.
 *
 * WHAT IT DOES
 *   Walks the assessor through Q1-Q7 to assign an autonomy level, then asks Q8
 *   for the impact class SEPARATELY. Q8 never changes the level: keeping the
 *   two assessments apart is the finding the whole project rests on, so the
 *   question order here is load-bearing, not cosmetic.
 *
 * IF YOU ARE EDITING CONTENT
 *   The questions, their yes/no routing and the footnotes are all in
 *   content/assessment.json. You do not need this file to reword a question or
 *   change where an answer leads.
 *
 * The result panel can push its cell into the matrix section further up the
 * page. See the SELECT_EVENT comment in ControlMatrix.jsx for why it is done
 * with an event rather than shared state.
 */

import { useState } from 'react';
import { SELECT_EVENT } from './ControlMatrix';
import styles from './ClassificationTree.module.css';

export default function ClassificationTree({ tree, autonomyLevels, impactClasses, cells, riskLegend }) {
  const [current, setCurrent] = useState('Q1');
  const [history, setHistory] = useState([]);
  const [level, setLevel] = useState(null);
  const [impact, setImpact] = useState(null);
  const [note, setNote] = useState('');

  const byQid = Object.fromEntries(tree.questions.map((q) => [q.id, q]));
  const question = current ? byQid[current] : null;

  const reset = () => {
    setCurrent('Q1');
    setHistory([]);
    setLevel(null);
    setImpact(null);
  };

  const answer = (yes) => {
    const q = byQid[current];
    const next = yes ? q.yes : q.no;
    const step = { qid: q.id, short: q.short, answer: yes ? 'Yes' : 'No' };

    if (next === 'RESTART') {
      reset();
      setNote(tree.restartNote);
    } else if (next.startsWith('L')) {
      setHistory(history.concat([step]));
      setLevel(next);
      setCurrent(null);
      setNote('');
    } else {
      setHistory(history.concat([step]));
      setCurrent(next);
      setNote('');
    }
  };

  const levelMeta = autonomyLevels.find((l) => l.id === level);
  const cell = level && impact ? cells.find((c) => c.id === `${level}-${impact}`) : null;
  const tier = cell ? riskLegend.find((r) => r.id === cell.risk) : null;
  const impactMeta = impactClasses.find((i) => i.id === impact);

  const selectInMatrix = () => {
    window.dispatchEvent(new CustomEvent(SELECT_EVENT, { detail: cell.id }));
    document.getElementById('matrix')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const stepLabel = question
    ? `Question ${question.id.slice(1)} of ${tree.questions.length}`
    : impact
      ? 'Result'
      : 'Impact — question 8';

  return (
    <>
      <p className={styles.lead}>{tree.lead}</p>

      <div className={styles.layout}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.stepLabel}>{stepLabel}</span>
            <button type="button" className={styles.ghostButton} onClick={reset}>
              Start again
            </button>
          </div>

          {question && (
            <div>
              <p className={styles.question}>{question.text}</p>
              <div className={styles.answers}>
                <button type="button" className={styles.yes} onClick={() => answer(true)}>
                  Yes
                </button>
                <button type="button" className={styles.no} onClick={() => answer(false)}>
                  No
                </button>
              </div>
            </div>
          )}

          {levelMeta && !impact && (
            <div>
              <p className={styles.levelId}>
                {levelMeta.id} — {levelMeta.name}
              </p>
              <p className={styles.levelDefinition}>{levelMeta.detail}</p>
              <p className={styles.levelOversight}>Oversight: {levelMeta.oversight}</p>
              <p className={styles.question}>{tree.impactQuestion}</p>
              <div className={styles.answers}>
                {impactClasses.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    className={styles.no}
                    onClick={() => setImpact(i.id)}
                  >
                    {i.id} — {i.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {cell && (
            <div className={styles.result} data-risk={cell.risk}>
              <span className={styles.resultId}>
                {cell.autonomy} × {cell.impact}
              </span>
              <p className={styles.resultPosture}>
                {cell.posture} — tier {tier?.tier}
              </p>
              <p className={styles.resultNote}>
                {tier?.note} {impactMeta?.name} impact: {impactMeta?.summary.toLowerCase()}.
              </p>
              <button type="button" className={styles.linkButton} onClick={selectInMatrix}>
                Select this cell in the matrix ↑
              </button>
            </div>
          )}
        </div>

        <div>
          <p className={styles.historyLabel}>Your answers</p>
          <ol className={styles.history}>
            {history.map((step) => (
              <li key={step.qid} className={styles.historyRow}>
                <span className={styles.historyQid}>{step.qid}</span>
                <span className={styles.historyShort}>{step.short}</span>
                <span className={styles.historyAnswer}>{step.answer}</span>
              </li>
            ))}
            {note && (
              <li className={styles.historyRow}>
                <span className={styles.historyQid}>—</span>
                <span className={styles.historyShort}>{note}</span>
                <span className={styles.historyAnswer} />
              </li>
            )}
          </ol>
          <p className={styles.footnote}>{tree.footnote}</p>
        </div>
      </div>
    </>
  );
}
