import * as React from 'react'

import { Tooltip, } from '../../../Shared/index'

const helpIconSrc = `${process.env.CDN_URL}/images/icons/icons-help.svg`
const greenCheckSrc = `${process.env.CDN_URL}/images/icons/icons-check-green.svg`

const greenCheckCell = (<span className="check-or-empty-wrapper">
  <img alt="Check icon" src={greenCheckSrc} />
</span>)

const emptyCell = (<span className="check-or-empty-wrapper" />)

const InfoTooltip = ({ tooltipText, }) => (
  <Tooltip
    tooltipText={tooltipText}
    tooltipTriggerText={<img alt='Question mark icon' src={helpIconSrc} />}
  />
)

const Row = ({ label, tooltipText, basic, teacher, school, }) => (
  <div className="premium-features-table-row">
    <span className="label-and-tooltip">
      <p>{label}</p>
      <InfoTooltip tooltipText={tooltipText} />
    </span>
    {basic ? greenCheckCell : emptyCell}
    {teacher ? greenCheckCell : emptyCell}
    {school ? greenCheckCell : emptyCell}
  </div>
)

const writingTools = ({ independentPracticeActivityCount, lessonsActivityCount, diagnosticActivityCount, }) => (
  <React.Fragment>
    <div className="header-row">
      <h4>Writing tools</h4>
    </div>
    <Row
      basic={true}
      label={`${independentPracticeActivityCount} independent practice activities`}
      school={true}
      teacher={true}
      tooltipText="Researched-backed, 10-15 minute writing and grammar practice"
    />
    <Row
      basic={true}
      label={`${diagnosticActivityCount} diagnostic assessments`}
      school={true}
      teacher={true}
      tooltipText="Baseline assessments that build custom writing practice pathways"
    />
    <Row
      basic={true}
      label={`${lessonsActivityCount} collaborative full-class lessons`}
      school={true}
      teacher={true}
      tooltipText="Interactive, teacher-led learning experiences"
    />
  </React.Fragment>
)

const dataReports = (
  <React.Fragment>
    <div className="header-row">
      <h4>Data reports</h4>
    </div>
    <Row
      basic={true}
      label="Activity summary report"
      school={true}
      teacher={true}
      tooltipText="Visual overview of activity completion and performance"
    />
    <Row
      basic={true}
      label="Activity analysis report"
      school={true}
      teacher={true}
      tooltipText="In-depth look at a student's performance on individual activities"
    />
    <Row
      basic={true}
      label="Diagnostics report"
      school={true}
      teacher={true}
      tooltipText="TODO"
    />
    <Row
      label="Activity scores report"
      school={true}
      teacher={true}
      tooltipText="Comprehensive Quill report card that outlines proficiency over time"
    />
    <Row
      label="Concepts report"
      school={true}
      teacher={true}
      tooltipText="In-depth breakdown of each student's proficiency by grammar concept"
    />
    <Row
      label="Standards report"
      school={true}
      teacher={true}
      tooltipText="Common Core standard proficiency at the individual level and full-class level"
    />
    <Row
      label="Data export capabilities"
      school={true}
      teacher={true}
      tooltipText="Export student data as a CSV or PDF"
    />
    <Row
      label="Custom reporting"
      school={true}
      tooltipText="Student data breakdowns tailored to your specific requests"
    />
    <Row
      label="Monthly usage reports"
      school={true}
      tooltipText="Automated reports sent right to your inbox"
    />
    <Row
      label="Administrator dashboard"
      school={true}
      tooltipText="Provides administrators with access to school-wide data and usage information"
    />

  </React.Fragment>
)

const rostering = (
  <React.Fragment>
    <div className="header-row">
      <h4>Rostering</h4>
    </div>
    <Row
      basic={true}
      label="Manual rostering"
      school={true}
      teacher={true}
      tooltipText="Lets you and your students create your own login credentials for Quill"
    />
    <Row
      basic={true}
      label="Google Classroom sync"
      school={true}
      teacher={true}
      tooltipText="Lets teachers import class rosters from Google Classroom, allows users to log into Quill with Google credentials"
    />
    <Row
      basic={true}
      label="Clever Library sync"
      school={true}
      teacher={true}
      tooltipText="Lets teachers import class rosters from Clever Library, allows users to log into Quill with Clever Library credentials"
    />
    <Row
      label="Clever Secure sync at the school or district level"
      school={true}
      tooltipText="Lets entire schools or districts import class rosters, allows users to log into Quill with Clever credentials"
    />
    <Row
      label="Unlimited number of teacher licenses"
      school={true}
      tooltipText="Provides all teachers in a school or district with access to Premium features"
    />
  </React.Fragment>
)

const professionalDevelopmentAndSupport = (
  <React.Fragment>
    <div className="header-row">
      <h4>Professional development and support</h4>
    </div>
    <Row
      basic={true}
      label="Spotlight webinars"
      school={true}
      teacher={true}
      tooltipText="30 - 60 minute webinars to help teachers utilize Quill's tools with their students in meaningful and impactful ways"
    />
    <Row
      basic={true}
      label="Teacher Center best practice resources"
      school={true}
      teacher={true}
      tooltipText="Comprehensive overviews of Quill's best practices and implementation tips provided by Quill's instructional experts."
    />
    <Row
      label="Getting started training"
      school={true}
      tooltipText="Live, hour-long virtual training to help teachers get set up for success on Quill"
    />
    <Row
      label="Guided onboarding"
      school={true}
      tooltipText="Work with a Quill Partnerships Specialist to get everyone set up quickly"
    />
    <Row
      label="Two professional development sessions"
      school={true}
      tooltipText="Comprehensive workshop-style PDs tailored to the needs of teachers"
    />
    <Row
      label="Three one-on-one coaching sessions per teacher"
      school={true}
      tooltipText="Check ins with Quill coaches to help teachers meet their writing instruction goals"
    />
    <Row
      label="Priority technical support"
      school={true}
      tooltipText="Access to a direct support representative to help resolve tech issues swiftly"
    />
  </React.Fragment>
)

const PremiumFeaturesTable = ({ independentPracticeActivityCount, lessonsActivityCount, diagnosticActivityCount, }) => (
  <section className="premium-features-table">
    {writingTools({ independentPracticeActivityCount, lessonsActivityCount, diagnosticActivityCount, })}
    {dataReports}
    {rostering}
    {professionalDevelopmentAndSupport}
  </section>
)

export default PremiumFeaturesTable
