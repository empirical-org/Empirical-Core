import * as React from 'react'

import { FULL, restrictedPage, OVERVIEW, SKILL, STUDENT, mapItemsIfNotAll } from '../../shared'
import { Spinner, whiteArrowPointingDownIcon, filterIcon, documentFileIcon } from '../../../Shared/index'
import OverviewSection from './overviewSection'
import SkillSection from './skillSection'
import StudentSection from './studentSection'

const emailWhiteIconSrc = `${process.env.CDN_URL}/images/icons/email-icon-white.svg`
const barChartGreySrc = `${process.env.CDN_URL}/images/pages/diagnostic_reports/icons-bar-chart.svg`
const barChartWhiteIconSrc = `${process.env.CDN_URL}/images/icons/white-bar-chart-icon.svg`
const groupOfStudentsGreyIconSrc = `${process.env.CDN_URL}/images/pages/administrator/usage_snapshot_report/students.svg`
const groupOfStudentsWhiteIconSrc = `${process.env.CDN_URL}/images/icons/students-white.svg`
const pencilGreyIconSrc = `${process.env.CDN_URL}/images/pages/administrator/usage_snapshot_report/pencil.svg`
const pencilWhiteIconSrc = `${process.env.CDN_URL}/images/icons/white-pencil-icon.svg`

// these reports only show for the current school year
const SELECTED_TIMEFRAME = "this-school-year"

export const DiagnosticGrowthReportsContainer = ({
  accessType,
  loadingFilters,
  pusherChannel,
  searchCount,
  selectedClassrooms,
  allClassrooms,
  selectedGrades,
  allGrades,
  selectedSchools,
  selectedTeachers,
  allTeachers,
  handleClickDownloadReport,
  openMobileFilterMenu,
  hasAdjustedFiltersFromDefault
}) => {

  const [activeTab, setActiveTab] = React.useState<string>(OVERVIEW)
  const [noDiagnosticData, setNoDiagnosticData] = React.useState<boolean>(false)

  function handleTabChange(e) {
    setActiveTab(e.currentTarget.value)
  }

  function handleSetNoDiagnosticData(value: boolean) {
    setNoDiagnosticData(value)
  }

  function renderContent() {

    if (noDiagnosticData) {
      return <div className="no-diagnostic-data-container">
        <h2>There are not yet any completed diagnostics.</h2>
        <p>The Quill Diagnostic enables you to provide a Pre-Diagnostic at the start of the year to identify skills students need to practice. The Post-Diagnostic allows you to then measure students&apos; learning gains over the course of the school year.</p>
        <p>At the moment, there are no teachers connected to your admin account who have completed a diagnostic. Once at least one teacher has completed a diagnostic with at least one student, you will be able to see their results in this report. View our guide our guide to learn how teachers can assign diagnostics to their students.</p>
        <a className="assign-link focus-on-light" href="" rel="noopener noreferrer" target="_blank">How to Assign a Diagnostic</a>
      </div>
    }

    return(
      <React.Fragment>
        <div className="tabs-for-pages-container">
          <button className={`interactive-wrapper performance-type-button overview ${activeTab === OVERVIEW ? 'active' : ''}`} onClick={handleTabChange} value={OVERVIEW}>
            <img alt="" src={activeTab === OVERVIEW ? barChartWhiteIconSrc : barChartGreySrc} />
            <span>Performance Overview</span>
          </button>
          <button className={`interactive-wrapper performance-type-button skill ${activeTab === SKILL ? 'active' : ''}`} onClick={handleTabChange} value={SKILL}>
            <img alt="" src={activeTab === SKILL ? pencilWhiteIconSrc : pencilGreyIconSrc} />
            <span>Performance by Skill</span>
          </button>
          <button className={`interactive-wrapper performance-type-button student ${activeTab === STUDENT ? 'active' : ''}`} onClick={handleTabChange} value={STUDENT}>
            <img alt="" src={activeTab === STUDENT ? groupOfStudentsWhiteIconSrc : groupOfStudentsGreyIconSrc} />
            <span>Performance by Student</span>
          </button>
        </div>
        <div className="filter-button-container">
          <button className="interactive-wrapper focus-on-light" onClick={openMobileFilterMenu} type="button">
            <img alt={filterIcon.alt} src={filterIcon.src} />
            Filters
          </button>
        </div>
        {activeTab === OVERVIEW && <OverviewSection {...sharedProps} />}
        {activeTab === SKILL && <SkillSection {...sharedProps} />}
        {activeTab === STUDENT && <StudentSection {...sharedProps} />}
      </React.Fragment>
    )
  }

  if (loadingFilters) {
    return <Spinner />
  }

  if (accessType !== FULL) {
    return restrictedPage
  }

  const sharedProps = {
    searchCount,
    selectedGrades: mapItemsIfNotAll(selectedGrades, allGrades, 'value'),
    selectedSchoolIds: selectedSchools.map(school => school.id),
    selectedTeacherIds: mapItemsIfNotAll(selectedTeachers, allTeachers),
    selectedClassroomIds: mapItemsIfNotAll(selectedClassrooms, allClassrooms),
    selectedTimeframe: SELECTED_TIMEFRAME,
    pusherChannel,
    hasAdjustedFiltersFromDefault,
    handleSetNoDiagnosticData
  }

  return (
    <main>
      <div className="header">
        <h1>
          <span>Diagnostic Growth Report</span>
          <a href="" rel="noopener noreferrer" target="_blank">
            <img alt={documentFileIcon.alt} src={documentFileIcon.src} />
            <span>Guide</span>
          </a>
        </h1>
        <div className="buttons-container">
          <button className="quill-button manage-subscription-button contained primary medium focus-on-light" onClick={handleClickDownloadReport} type="button">
            <img alt="" src={emailWhiteIconSrc} />
            <span>Manage subscription</span>
          </button>
          <button className="quill-button download-report-button contained primary medium focus-on-light" onClick={handleClickDownloadReport} type="button">
            <img alt={whiteArrowPointingDownIcon.alt} src={whiteArrowPointingDownIcon.src} />
            <span>Download</span>
          </button>
        </div>
      </div>
      {renderContent()}
    </main>
  )
}

export default DiagnosticGrowthReportsContainer
