import * as React from 'react'
const diagnosticSrc = `${process.env.CDN_URL}/images/illustrations/diagnostic-monochromatic.svg`

const EmptyDiagnosticProgressReport = () => (
  <section className="diagnostic-reports-empty-state container">
    <h1>Diagnostic Reports</h1>
    <img alt="Illustration showing a monochromatic document with a magnifying glass inspecting the document" src={diagnosticSrc} />
    <h2>Start by assigning a diagnostic</h2>
    <p>Nothing to see here yet! Once you assign a diagnostic your students’ reports will show up here.</p>
    <a className="quill-button medium primary contained" href="/assign/diagnostic">Assign a diagnostic</a>
    <a href="/tools/diagnostic">Learn more about Quill Diagnostic</a>
  </section>
)


export default EmptyDiagnosticProgressReport
