import * as React from 'react'

import { FULL, restrictedPage, OVERVIEW, SKILL, STUDENT, mapItemsIfNotAll } from '../../shared'
import { Spinner, whiteArrowPointingDownIcon, filterIcon, documentFileIcon } from '../../../Shared/index'
import OverviewSection from './overviewSection'
import SkillSection from './skillSection'
import StudentSection from './studentSection'

const barChartGreySrc = `${process.env.CDN_URL}/images/pages/diagnostic_reports/icons-bar-chart.svg`
const barChartWhiteIconSrc = `${process.env.CDN_URL}/images/icons/white-bar-chart-icon.svg`
const groupOfStudentsGreyIconSrc = `${process.env.CDN_URL}/images/pages/administrator/usage_snapshot_report/students.svg`
const groupOfStudentsWhiteIconSrc = `${process.env.CDN_URL}/images/icons/students-white.svg`
const pencilGreyIconSrc = `${process.env.CDN_URL}/images/pages/administrator/usage_snapshot_report/pencil.svg`
const pencilWhiteIconSrc = `${process.env.CDN_URL}/images/icons/white-pencil-icon.svg`

// these reports only show for the current school year
const SELECTED_TIMEFRAME = "this-school-year"

const reportButtons = [
  {
    tab: OVERVIEW,
    displayName: 'Performance Overview',
    inactiveIconSrc: barChartGreySrc,
    activeIconSrc: barChartWhiteIconSrc
  },
  {
    tab: SKILL,
    displayName: 'Performance by Skill',
    inactiveIconSrc: pencilGreyIconSrc,
    activeIconSrc: pencilWhiteIconSrc
  },
  {
    tab: STUDENT,
    displayName: 'Performance by Student',
    inactiveIconSrc: groupOfStudentsGreyIconSrc,
    activeIconSrc: groupOfStudentsWhiteIconSrc
  },
]

export const DiagnosticGrowthReportsContainer = ({
  accessType,
  loadingFilters,
  pusherChannel,
  searchCount,
  selectedClassrooms,
  availableClassrooms,
  selectedGrades,
  availableGrades,
  selectedSchools,
  selectedTeachers,
  availableTeachers,
  handleClickDownloadReport,
  openMobileFilterMenu,
  hasAdjustedFiltersFromDefault,
  passedData
}) => {

  const [activeTab, setActiveTab] = React.useState<string>(OVERVIEW)
  const [selectedDiagnosticId, setSelectedDiagnosticId] = React.useState<number>(null)
  const [noDiagnosticDataAvailable, setNoDiagnosticDataAvailable] = React.useState<boolean>(!!passedData)

  const sharedProps = {
    searchCount,
    selectedGrades: mapItemsIfNotAll(selectedGrades, availableGrades, 'value'),
    selectedSchoolIds: selectedSchools.map(school => school.id),
    selectedTeacherIds: mapItemsIfNotAll(selectedTeachers, availableTeachers),
    selectedClassroomIds: mapItemsIfNotAll(selectedClassrooms, availableClassrooms),
    selectedTimeframe: SELECTED_TIMEFRAME,
    pusherChannel,
    hasAdjustedFiltersFromDefault,
    handleSetNoDiagnosticDataAvailable,
    passedData: null
  }

  const studentSectionProps = {
    ...sharedProps,
    passedRecommendationsData: null,
    passedStudentData: null,
    passedVisibleData: null
  }

  function handleTabChange(e) {
    setActiveTab(e.currentTarget.value)
  }

  function handleTabChangeFromDataChip(value) {
    setActiveTab(value)
  }

  function handleSetNoDiagnosticDataAvailable(value: boolean) {
    setNoDiagnosticDataAvailable(value)
  }

  function handleSetSelectedDiagnosticId(e) {
    setSelectedDiagnosticId(Number(e.target.value))
  }

  function renderButtons() {
    return(
      <div className="tabs-for-pages-container">
        {reportButtons.map((button, i) => {
          const { tab, displayName, activeIconSrc, inactiveIconSrc } = button
          return (
            <button className={`interactive-wrapper performance-type-button ${tab} ${tab === activeTab ? 'active' : ''}`} key={`${displayName}-${i}`} onClick={handleTabChange} value={tab}>
              <img alt="" src={tab === activeTab ? activeIconSrc : inactiveIconSrc} />
              <span>{displayName}</span>
            </button>
          )
        })}
      </div>
    )
  }

  function renderContent() {
    if (noDiagnosticDataAvailable) {
      return(
        <div className="no-diagnostic-data-container">
          <h2>There are not yet any completed diagnostics.</h2>
          <p>The Quill Diagnostic enables you to provide a Pre-Diagnostic at the start of the year to identify skills students need to practice. The Post-Diagnostic allows you to then measure students&apos; learning gains over the course of the school year.</p>
          <p>At the moment, there are no teachers connected to your admin account who have completed a diagnostic. Once at least one teacher has completed a diagnostic with at least one student, you will be able to see their results in this report. View our guide to learn how teachers can assign diagnostics to their students.</p>
          <a className="assign-link focus-on-light" href="https://support.quill.org/en/articles/1049933-how-do-i-assign-a-quill-diagnostic" rel="noopener noreferrer" target="_blank">How to Assign a Diagnostic</a>
        </div>
      )
    }
    return(
      <React.Fragment>
        {renderButtons()}
        <div className="filter-button-container">
          <button className="interactive-wrapper focus-on-light" onClick={openMobileFilterMenu} type="button">
            <img alt={filterIcon.alt} src={filterIcon.src} />
            Filters
          </button>
        </div>
        {activeTab === OVERVIEW && <OverviewSection {...sharedProps} handleSetSelectedDiagnosticId={handleSetSelectedDiagnosticId} handleTabChangeFromDataChip={handleTabChangeFromDataChip} />}
        {activeTab === SKILL && <SkillSection {...sharedProps} selectedDiagnosticId={selectedDiagnosticId} />}
        {activeTab === STUDENT && <StudentSection {...studentSectionProps} />}
      </React.Fragment>
    )
  }

  if (loadingFilters) {
    return <Spinner />
  }

  if (accessType !== FULL) {
    return restrictedPage
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
        {/* <div className="buttons-container">
          <button className="quill-button download-report-button contained primary medium focus-on-light" onClick={handleClickDownloadReport} type="button">
            <img alt={whiteArrowPointingDownIcon.alt} src={whiteArrowPointingDownIcon.src} />
            <span>Download</span>
          </button>
        </div> */}
      </div>
      {renderContent()}
    </main>
  )
}

export default DiagnosticGrowthReportsContainer
