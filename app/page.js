/**
 * The page.
 *
 * This file is the only place that connects content to components. It runs on
 * the server at build time: it reads the content/ folder and passes plain data
 * down as props. Components never touch the filesystem.
 *
 * To add a new section of the page, add a <section className="band"> block.
 */

import ControlMatrix from '@/components/ControlMatrix';
import RiskLegend from '@/components/RiskLegend';
import ScaleList from '@/components/ScaleList';
import ReferenceTable from '@/components/ReferenceTable';
import RiskTaxonomy from '@/components/RiskTaxonomy';
import { getScales, getReferences, getAllCells, getSections, getTaxonomy, showDrafts } from '@/lib/content';

export default function Page() {
  const scales = getScales();
  const references = getReferences();
  const taxonomy = getTaxonomy();
  const cells = getAllCells();
  const sections = getSections();

  const publishedCount = cells.filter((c) => c.status === 'published').length;

  return (
    <>
      <header className="masthead">
        <div className="wrap">
          <p className="eyebrow">HUX AI · Research Internship · Project 2 · Summer 2026</p>
          <h1>Agentic AI Risk Control Matrix</h1>
          <p className="narrow">
            Governance for AI systems that act, not just answer. Autonomy on one axis, impact on the
            other, and the control posture you owe at every intersection.
          </p>
        </div>
      </header>

      {showDrafts && (
        <div className="wrap">
          <p className="wip-banner">
            PREVIEW BUILD — draft cells and sections are visible here and hidden on the live site.{' '}
            {publishedCount} of {cells.length} cells published.
          </p>
        </div>
      )}

      <section className="band" id="matrix">
        <div className="wrap">
          <h2>The matrix</h2>
          <ControlMatrix
            cells={cells}
            autonomyLevels={scales.autonomyLevels}
            impactClasses={scales.impactClasses}
            riskLegend={scales.riskLegend}
            showDrafts={showDrafts}
          />
        </div>
      </section>

      <section className="band" id="legend">
        <div className="wrap">
          <h2>Reading the colours</h2>
          <RiskLegend riskLegend={scales.riskLegend} />
        </div>
      </section>

      {sections.map((section) => (
        <section className="band" key={section.slug} id={section.slug}>
          <div className="wrap narrow">
            <h2>
              {section.title}{' '}
              {section.status === 'draft' && <span className="draft-badge">draft</span>}
            </h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: section.html }} />
          </div>
        </section>
      ))}

      <section className="band" id="scales">
        <div className="wrap">
          <h2>Autonomy levels</h2>
          <ScaleList items={scales.autonomyLevels} idLabel="L0 through L5 — what the system is permitted to do." />
        </div>
      </section>

      <section className="band" id="impact">
        <div className="wrap">
          <h2>Impact classes</h2>
          <ScaleList items={scales.impactClasses} idLabel="I0 through I3 — what happens when it is wrong." />
        </div>
      </section>

      <section className="band" id="audit">
        <div className="wrap">
          <h2>Evidence an auditor will ask for</h2>
          <ScaleList
            items={scales.auditCategories.map((c) => ({
              id: String(c.n),
              name: c.name,
              summary: '',
              detail: c.detail,
            }))}
            idLabel="Five categories, applied at every cell."
          />
        </div>
      </section>

      <section className="band" id="taxonomy">
        <div className="wrap">
          <h2>Risk taxonomy</h2>
          <RiskTaxonomy taxonomy={taxonomy} />
        </div>
      </section>

      <section className="band" id="references">
        <div className="wrap">
          <h2>References</h2>
          <ReferenceTable references={references} />
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p>
            Produced during the HUX AI Research Internship, Summer 2026. Conclusions are the
            authors&rsquo; own and do not represent HUX AI or the authors&rsquo; institutions.
          </p>
          <p>This matrix is a governance instrument, not an assurance certificate.</p>
        </div>
      </footer>
    </>
  );
}
