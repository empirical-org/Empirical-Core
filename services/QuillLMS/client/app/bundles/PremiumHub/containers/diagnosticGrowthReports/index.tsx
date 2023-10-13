import * as React from 'react'

import { FULL, restrictedPage } from '../../shared'
import { Spinner, whiteArrowPointingDownIcon, filterIcon, documentFileIcon, DropdownInput } from '../../../Shared/index'
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import OverviewTable from './overviewTable'

const emailWhiteIconSrc = `${process.env.CDN_URL}/images/icons/email-icon-white.svg`
const barChartGreySrc = `${process.env.CDN_URL}/images/pages/diagnostic_reports/icons-bar-chart.svg`
const barChartWhiteIconSrc = `${process.env.CDN_URL}/images/icons/white-bar-chart-icon.svg`
const groupOfStudentsGreyIconSrc = `${process.env.CDN_URL}/images/pages/administrator/usage_snapshot_report/students.svg`
const groupOfStudentsWhiteIconSrc = `${process.env.CDN_URL}/images/icons/students-white.svg`
const pencilGreyIconSrc = `${process.env.CDN_URL}/images/pages/administrator/usage_snapshot_report/pencil.svg`
const pencilWhiteIconSrc = `${process.env.CDN_URL}/images/icons/white-pencil-icon.svg`

const OVERVIEW = 'overview'
const SKILL = 'skill'
const STUDENT = 'student'
const dropdownOptions = [{ label: 'Grade', value: 'grade' }, { label: 'Teacher', value: 'teacher'}, { label: 'Classroom', value: 'classroom' }]

export const DiagnosticGrowthReportsContainer = ({
  accessType,
  loadingFilters,
  customStartDate,
  customEndDate,
  pusherChannel,
  searchCount,
  selectedClassrooms,
  allClassrooms,
  selectedGrades,
  allGrades,
  selectedSchools,
  selectedTeachers,
  allTeachers,
  selectedTimeframe,
  handleClickDownloadReport,
  openMobileFilterMenu
}) => {

  const [activeTab, setActiveTab] = React.useState<string>(OVERVIEW)
  const [groupByValue, setGroupByValue] = React.useState<DropdownObjectInterface>(dropdownOptions[0])

  function handleFilterOptionChange(option) {
    setGroupByValue(option)
  }
  function handleTabChange(e) {
    setActiveTab(e.currentTarget.value)
  }

  if (loadingFilters) {
    return <Spinner />
  }

  if (accessType !== FULL) {
    return restrictedPage
  }

  const sharedProps = {
    loadingFilters,
    customStartDate,
    customEndDate,
    pusherChannel,
    searchCount,
    selectedClassrooms,
    allClassrooms,
    selectedGrades,
    allGrades,
    selectedSchools,
    selectedTeachers,
    allTeachers,
    selectedTimeframe,
    handleClickDownloadReport,
    openMobileFilterMenu
  }

  return (
    <main className="diagnostic-reports-main">
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
      <DropdownInput
        className="group-by-dropdown"
        handleChange={handleFilterOptionChange}
        isSearchable={true}
        label="Group by:"
        options={dropdownOptions}
        value={groupByValue}
      />
      <div className="filter-button-container">
        <button className="interactive-wrapper focus-on-light" onClick={openMobileFilterMenu} type="button">
          <img alt={filterIcon.alt} src={filterIcon.src} />
          Filters
        </button>
      </div>
      {activeTab === OVERVIEW && <OverviewTable {...sharedProps} />}
    </main>
  )
}

export default DiagnosticGrowthReportsContainer