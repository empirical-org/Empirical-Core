import * as React from 'react'

import OverviewSection from './overviewSection'
import SkillSection from './skillSection'
import StudentSection from './studentSection'

import { FULL, restrictedPage, OVERVIEW, SKILL, STUDENT, mapItemsIfNotAll, groupByDropdownOptions, getDiagnosticTypeDropdownOptions } from '../../shared'
import { LightButtonLoadingSpinner, Snackbar, Spinner, whiteArrowPointingDownIcon, filterIcon, defaultSnackbarTimeout, documentFileIcon, whiteEmailIcon } from '../../../Shared/index'
import useSnackbarMonitor from '../../../Shared/hooks/useSnackbarMonitor';
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces'
import { requestPost } from '../../../../modules/request'
import ReportSubscriptionModal from '../../components/usage_snapshots/reportSubscriptionModal';

const barChartGreySrc = `${process.env.CDN_URL}/images/pages/diagnostic_reports/icons-bar-chart.svg`
const barChartWhiteIconSrc = `${process.env.CDN_URL}/images/icons/white-bar-chart-icon.svg`
const groupOfStudentsGreyIconSrc = `${process.env.CDN_URL}/images/pages/administrator/usage_snapshot_report/students.svg`
const groupOfStudentsWhiteIconSrc = `${process.env.CDN_URL}/images/icons/students-white.svg`
const pencilGreyIconSrc = `${process.env.CDN_URL}/images/pages/administrator/usage_snapshot_report/pencil.svg`
const pencilWhiteIconSrc = `${process.env.CDN_URL}/images/icons/white-pencil-icon.svg`

const FILTER_SELECTIONS_REPORT_BASE = 'diagnostic_growth_report_'

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
  selectedTimeframe,
  selectedGrades,
  availableGrades,
  selectedSchools,
  selectedTeachers,
  availableTeachers,
  openMobileFilterMenu,
  hasAdjustedFiltersFromDefault,
  handleSetDiagnosticIdForStudentCount,
  passedData
}) => {

  const [activeTab, setActiveTab] = React.useState<string>(OVERVIEW)
  const [selectedDiagnosticType, setSelectedDiagnosticType] = React.useState<DropdownObjectInterface>(null)
  const [selectedGroupByValue, setSelectedGroupByValue] = React.useState<DropdownObjectInterface>(null)
  const [noDiagnosticDataAvailable, setNoDiagnosticDataAvailable] = React.useState<boolean>(!!passedData)
  const [downloadButtonBusy, setDownloadButtonBusy] = React.useState<boolean>(false)
  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
  const [snackbarCopy, setSnackbarCopy] = React.useState<boolean>(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = React.useState(false)
  const [currentEmailSubscription, setCurrentEmailSubscription] = React.useState(null)

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  React.useEffect(() => {
    // this is for testing purposes; this value will always be null in a non-testing environment
    if (!passedData) {
      getFilterSelections(activeTab)
    }
  }, [activeTab])

  React.useEffect(() => {
    if (!passedData && selectedGroupByValue && selectedDiagnosticType) {
      saveFilterSelections(activeTab)
    }
  }, [selectedGroupByValue, selectedDiagnosticType])

  const sharedProps = {
    searchCount,
    selectedGrades: mapItemsIfNotAll(selectedGrades, availableGrades, 'value'),
    selectedSchoolIds: selectedSchools.map(school => school.id),
    selectedTeacherIds: mapItemsIfNotAll(selectedTeachers, availableTeachers),
    selectedClassroomIds: mapItemsIfNotAll(selectedClassrooms, availableClassrooms),
    selectedTimeframe: selectedTimeframe.value,
    pusherChannel,
    hasAdjustedFiltersFromDefault,
    handleSetNoDiagnosticDataAvailable,
    handleSetDiagnosticIdForStudentCount,
    passedData: null
  }

  const overviewProps = {
    ...sharedProps,
    groupByValue: selectedGroupByValue,
    handleSetSelectedDiagnosticType,
    handleTabChangeFromDataChip,
    handleSetSelectedGroupByValue
  }

  const skillSectionProps = {
    ...sharedProps,
    groupByValue: selectedGroupByValue,
    diagnosticTypeValue: selectedDiagnosticType,
    handleSetSelectedDiagnosticType,
    handleSetSelectedGroupByValue
  }

  const studentSectionProps = {
    ...sharedProps,
    createCsvReportDownload: createCsvReportDownload,
    diagnosticTypeValue: selectedDiagnosticType,
    handleSetSelectedDiagnosticType,
    passedStudentData: null,
    passedRecommendationsData: null,
    passedVisibleData: null
  }

  function showInSnackbar(snackbarCopy: string) {
    setSnackbarCopy(snackbarCopy)
    setShowSnackbar(true)
  }

  function getFilterSelections(tab) {
    requestPost('/admin_report_filter_selections/show', { report: `${FILTER_SELECTIONS_REPORT_BASE}${tab}` }, (selections) => {
      if (selections) {
        const { group_by_value, diagnostic_type_value } = selections.filter_selections
        setSelectedGroupByValue(group_by_value)
        setSelectedDiagnosticType(diagnostic_type_value)
      } else {
        setSelectedGroupByValue(groupByDropdownOptions[0])
        setSelectedDiagnosticType(getDiagnosticTypeDropdownOptions(selectedTimeframe.value)[0])
      }
    })
  }

  function saveFilterSelections(tab, successCallback = () => { }) {
    const filterSelections = {
      group_by_value: selectedGroupByValue,
      diagnostic_type_value: selectedDiagnosticType
    }

    postFilterSelections(tab, filterSelections, successCallback)
  }

  function postFilterSelections(tab, filterSelections, successCallback = () => { }) {
    console.log('postFilterSelections')
    const params = {
      admin_report_filter_selection: {
        filter_selections: filterSelections,
        report: `${FILTER_SELECTIONS_REPORT_BASE}${tab}`
      }
    }

    requestPost('/admin_report_filter_selections/create_or_update', params, successCallback)
  }

  function handleTabChange(e) {
    setActiveTab(e.currentTarget.value)
    setSelectedGroupByValue(null)
    setSelectedDiagnosticType(null)
  }

  function handleTabChangeFromDataChip(value) {
    setActiveTab(value)
  }

  function handleSetNoDiagnosticDataAvailable(value: boolean) {
    setNoDiagnosticDataAvailable(value)
  }

  function handleSetSelectedDiagnosticType(value: DropdownObjectInterface) {
    setSelectedDiagnosticType(value)
  }

  function handleSetSelectedGroupByValue(value: DropdownObjectInterface) {
    setSelectedGroupByValue(value)
  }

  function createCsvReportDownload() {
    const buttonDisableTime = 2000
    setDownloadButtonBusy(true)

    requestPost('/admin_diagnostic_reports/download', {}, (body) => {
      showInSnackbar("You will receive an email with a download link shortly.")
      setTimeout(() => { setDownloadButtonBusy(false) }, buttonDisableTime);
    })
  }

  function handleClickSubscribe() {
    setIsSubscriptionModalOpen(!isSubscriptionModalOpen);
  }

  function handleSubscriptionCancel() {
    setIsSubscriptionModalOpen(false);
  }

  function handleSubscriptionSave(isSubscribed, frequency) {
    setIsSubscriptionModalOpen(false);
    if (isSubscribed) {
      requestPost('/admin_report_filter_selections/show', { report: `${FILTER_SELECTIONS_REPORT_BASE}${OVERVIEW}` }, (overviewSelections) => {
        requestPost('/admin_report_filter_selections/show', { report: `${FILTER_SELECTIONS_REPORT_BASE}${SKILL}` }, (skillSelections) => {
          requestPost('/admin_report_filter_selections/show', { report: `${FILTER_SELECTIONS_REPORT_BASE}${STUDENT}` }, (studentSelections) => {
            console.log(overviewSelections)
//            if (overviewSelections) postFilterSelections(`subscription_${OVERVIEW}`, overviewSelections.filterSelections)
//            if (skillSelections) postFilterSelections(`subscription_${SKILL}`, skillSelections.filterSelections)
//            if (studentSelections) postFilterSelections(`subscription_${STUDENT}`, studentSelections.filterSelections)

            // createOrUpdateEmailSubscription
          })
        })
      })

    } else if (currentEmailSubscription) {
      deleteEmailSubscription(currentEmailSubscription.id)
    }
    showInSnackbar('Subscription settings saved')
  }

  function createOrUpdateEmailSubscription(frequency) {
    if (!adminReportFilterSelection?.id) { return }

    const emailSubscriptionParams = {
      email_subscription: {
        admin_report_filter_selection_id: adminReportFilterSelection.id,
        frequency
      }
    }

    requestPost('/pdf_subscriptions/create_or_update', pdfSubscriptionParams, (pdfSubscription) => {
      setCurrentPdfSubscription(pdfSubscription)
    })
  }

  function deleteEmailSubscription(subscriptionId) {
    requestDelete(`/email_subscriptions/${subscriptionId}`, {}, () => setCurrentEmailSubscription(null), error => { throw (error) })
  }

  function renderButtons() {
    return(
      <div className="tabs-for-pages-container">
        {reportButtons.map((button, i) => {
          const { tab, displayName, activeIconSrc, inactiveIconSrc } = button
          return (
            <button className={`interactive-wrapper performance-type-button ${tab} ${tab === activeTab ? 'active' : ''}`} key={`${displayName}-${i}`} onClick={handleTabChange} type="button" value={tab}>
              <img alt="" src={tab === activeTab ? activeIconSrc : inactiveIconSrc} />
              <span>{displayName}</span>
            </button>
          )
        })}
      </div>
    )
  }

  function renderContent() {
    /* TEMPORARILY DISABLING THIS CODE
       TODO: re-enable this once we get code in place so that the "Apply filters" button will actually apply filters if this cut-out view is showing
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
    */
    return (
      <React.Fragment>
        {renderButtons()}
        <div className="filter-button-container">
          <button className="interactive-wrapper focus-on-light" onClick={openMobileFilterMenu} type="button">
            <img alt={filterIcon.alt} src={filterIcon.src} />
            Filters
          </button>
        </div>
        {activeTab === OVERVIEW && <OverviewSection {...overviewProps} />}
        {activeTab === SKILL && <SkillSection {...skillSectionProps} />}
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
        <ReportSubscriptionModal
          cancel={handleSubscriptionCancel}
          currentSubscription={currentEmailSubscription}
          isOpen={isSubscriptionModalOpen}
          save={handleSubscriptionSave}
        />
        <Snackbar text={snackbarCopy} visible={showSnackbar} />
        <h1>
          <span>Diagnostic Growth Report</span>
          <a href="https://support.quill.org/en/articles/9084379-how-do-i-navigate-the-diagnostic-growth-report-in-the-premium-hub" rel="noopener noreferrer" target="_blank">
            <img alt={documentFileIcon.alt} src={documentFileIcon.src} />
            <span>Guide</span>
          </a>
        </h1>
        <div className="header-buttons">
          <button
            className="quill-button-archived manage-subscription-button contained primary medium focus-on-light"
            onClick={handleClickSubscribe}
            type="button"
          >
            <img alt={whiteEmailIcon.alt} src={whiteEmailIcon.src} />
            <span>Subscribe</span>
          </button>
          <button className="quill-button-archived download-report-button contained primary medium focus-on-light" onClick={createCsvReportDownload} type="button">
            {downloadButtonBusy ? <LightButtonLoadingSpinner /> : <img alt={whiteArrowPointingDownIcon.alt} src={whiteArrowPointingDownIcon.src} />}
            <span>Download</span>
          </button>
        </div>
      </div>
      {renderContent()}
    </main>
  )
}

export default DiagnosticGrowthReportsContainer
