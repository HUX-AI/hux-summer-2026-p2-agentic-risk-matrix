/**
 * The page.
 *
 * This file is the only place that connects content to components. It runs on
 * the server at build time: it reads the content/ folder and passes plain data
 * down as props. Components never touch the filesystem.
 *
 * Sections are placed explicitly rather than looped, because the prose is
 * interleaved with the matrix, the instruments and the appendices rather than
 * sitting in one run. To add a section of the page, add a
 * <section className="band"> block with an id and a heading.
 */

import ControlMatrix from '@/components/ControlMatrix';
import RiskLegend from '@/components/RiskLegend';
import ScaleList from '@/components/ScaleList';
import ReferenceTable from '@/components/ReferenceTable';
import RiskTaxonomy from '@/components/RiskTaxonomy';
import ExecutiveSummary from '@/components/ExecutiveSummary';
import ProcessSteps from '@/components/ProcessSteps';
import ClassificationTree from '@/components/ClassificationTree';
import ScenarioLibrary from '@/components/ScenarioLibrary';
import AssessmentTool from '@/components/AssessmentTool';
import ReconciliationTable from '@/components/ReconciliationTable';
import StatementList from '@/components/StatementList';
import {
  getScales,
  getReferences,
  getAllCells,
  getSectionsBySlug,
  getTaxonomy,
  getReport,
  getScenarios,
  getAssessment,
  showDrafts,
} from '@/lib/content';

export default function Page() {
  // Set by the GitHub Pages workflow (see next.config.mjs). public/ assets in
  // plain <img> tags do not get the prefix automatically.
  const basePath = process.env.BASE_PATH || '';

  const scales = getScales();
  const references = getReferences();
  const taxonomy = getTaxonomy();
  const cells = getAllCells();
  const sections = getSectionsBySlug();
  const report = getReport();
  const scenarios = getScenarios();
  const assessment = getAssessment();

  const publishedCount = cells.filter((c) => c.status === 'published').length;
  const { masthead } = report;

  return (
    <>
      <header className="masthead">
        {/* Decorative. The orb is the one place a non-risk colour appears; it is
            bled off the corner at low opacity so it reads as paper texture and
            never competes with a risk swatch. See CLAUDE.md. */}
        <img
          className="masthead-orb"
          src={`${basePath}/hux-orb.png`}
          alt=""
          aria-hidden="true"
          width="768"
          height="768"
        />
        <div className="wrap masthead-inner">
          <img
            className="masthead-lockup"
            src={`${basePath}/hux-logo-tagline.png`}
            alt="HUX AI — empowering humanity, shaping tomorrow"
            width="785"
            height="272"
          />
          <p className="eyebrow">{masthead.eyebrow}</p>
          <h1>{masthead.title}</h1>
          <p className="standfirst">{masthead.standfirst}</p>
          <dl className="credits">
            <div>
              <dt>Research team</dt>
              <dd>
                <ul className="credit-names">
                  {masthead.team.map((person) => (
                    <li key={person}>{person}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Mentors</dt>
              <dd>
                <ul className="credit-names credit-names-single">
                  {masthead.mentors.map((person) => (
                    <li key={person}>{person}</li>
                  ))}
                </ul>
              </dd>
              <dt>Published</dt>
              <dd>{masthead.published}</dd>
            </div>
          </dl>
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

      <section className="band" id="summary">
        <div className="wrap">
          <h2>{sections.summary.title}</h2>
          <ExecutiveSummary
            html={sections.summary.html}
            assets={report.summaryAssets}
            findings={report.findings}
          />
        </div>
      </section>

      <section className="band" id="matrix">
        <div className="wrap">
          <h2>The control matrix</h2>
          <ControlMatrix
            cells={cells}
            autonomyLevels={scales.autonomyLevels}
            impactClasses={scales.impactClasses}
            riskLegend={scales.riskLegend}
            showDrafts={showDrafts}
          />
        </div>
      </section>

      <section className="band" id="tiers">
        <div className="wrap">
          <h2>Reading the colours</h2>
          <RiskLegend riskLegend={scales.riskLegend} />
          <p className="footnote">{report.legendNote}</p>
        </div>
      </section>

      <section className="band" id="protocol">
        <div className="wrap">
          <h2>How to use it</h2>
          <ProcessSteps steps={report.protocol.steps} note={report.protocol.note} />
        </div>
      </section>

      <section className="band" id="tree">
        <div className="wrap">
          <h2>Classify a use case</h2>
          <ClassificationTree
            tree={assessment.tree}
            autonomyLevels={scales.autonomyLevels}
            impactClasses={scales.impactClasses}
            cells={cells}
            riskLegend={scales.riskLegend}
          />
        </div>
      </section>

      <section className="band" id="scales">
        <div className="wrap">
          <h2>The two scales</h2>
          <div className="two-up">
            <div>
              <p className="column-label">Autonomy levels — what the system is permitted to do</p>
              <ScaleList
                items={scales.autonomyLevels}
                idLabel="L0 through L5. Assess what this deployment is permitted to do, not what the technology could do."
              />
            </div>
            <div>
              <p className="column-label">Impact classes — what happens when it is wrong</p>
              <ScaleList
                items={scales.impactClasses}
                idLabel="I0 through I3. Impact is a property of the deployment, not the technology."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="band" id="taxonomy">
        <div className="wrap">
          <h2>Risk taxonomy — what can fail</h2>
          <RiskTaxonomy
            taxonomy={taxonomy}
            footnote={report.taxonomyNote}
            amplifierLead={report.amplifierLead}
          />
        </div>
      </section>

      <section className="band" id="scenarios">
        <div className="wrap">
          <h2>Scenario library</h2>
          <ScenarioLibrary scenarios={scenarios} cells={cells} />
        </div>
      </section>

      <section className="band" id="tool">
        <div className="wrap">
          <h2>Run the assessment</h2>
          <AssessmentTool
            scoring={assessment.scoring}
            autonomyLevels={scales.autonomyLevels}
            impactClasses={scales.impactClasses}
            cells={cells}
            riskLegend={scales.riskLegend}
          />
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

      <section className="band" id="method">
        <div className="wrap narrow">
          <h2>{sections.method.title}</h2>
          <div className="prose" dangerouslySetInnerHTML={{ __html: sections.method.html }} />
        </div>
      </section>

      <section className="band" id="reconciliation">
        <div className="wrap">
          <h2>Where the drafts disagreed</h2>
          <ReconciliationTable reconciliation={report.reconciliation} />
        </div>
      </section>

      <section className="band" id="limitations">
        <div className="wrap">
          <h2>Limitations</h2>
          <StatementList lead={report.limitations.lead} items={report.limitations.items} />
        </div>
      </section>

      <section className="band" id="conclusion">
        <div className="wrap narrow">
          <h2>{sections.conclusion.title}</h2>
          <div className="prose" dangerouslySetInnerHTML={{ __html: sections.conclusion.html }} />
          <div className="disclosure">
            <p className="column-label">{report.disclosure.label}</p>
            <p>{report.disclosure.body}</p>
          </div>
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
          <img
            className="footer-mark"
            src={`${basePath}/hux-icon.png`}
            alt="HUX AI"
            width="41"
            height="50"
          />
          {report.colophon.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </footer>
    </>
  );
}
