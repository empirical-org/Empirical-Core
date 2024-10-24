import * as React from 'react'
import { useEffect, useState } from 'react'

import { FULL, restrictedPage, mapItemsIfNotAll } from '../shared';
import { Snackbar, defaultSnackbarTimeout } from '../../Shared/index'
import useSnackbarMonitor from '../../Shared/hooks/useSnackbarMonitor'
import SnapshotSection from '../components/usage_snapshots/snapshotSection'
import { snapshotSections, TAB_NAMES, ALL, SECTION_NAME_TO_ICON_URL, } from '../components/usage_snapshots/shared'
import { Spinner, DropdownInput, filterIcon, whiteArrowPointingDownIcon, documentFileIcon, whiteEmailIcon } from '../../Shared/index'
import useWindowSize from '../../Shared/hooks/useWindowSize';
import { requestDelete, requestGet, requestPost, } from '../../../modules/request';
import ReportSubscriptionModal from '../components/usage_snapshots/reportSubscriptionModal';

const MAX_VIEW_WIDTH_FOR_MOBILE = 950
const PDF_REPORT = 'usage_snapshot_report_pdf'

const Tab = ({ section, setSelectedTab, selectedTab }) => {
  function handleSetSelectedTab() { setSelectedTab(section) }

  let className = 'tab'
  if (section === selectedTab) {
    className += ' selected-tab'
  }

  return <button className={className} onClick={handleSetSelectedTab} type="button"><img alt="" src={SECTION_NAME_TO_ICON_URL[section]} /><span>{section}</span></button>
}

export const UsageSnapshotsContainer = ({
  accessType,
  loadingFilters,
  customStartDate,
  customEndDate,
  pusherChannel,
  searchCount,
  selectedClassrooms,
  availableClassrooms,
  selectedGrades,
  availableGrades,
  selectedSchools,
  selectedTeachers,
  availableTeachers,
  selectedTimeframe,
  saveFilterSelections,
  openMobileFilterMenu
}) => {

  const [selectedTab, setSelectedTab] = useState(ALL)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [currentPdfSubscription, setCurrentPdfSubscription] = useState(null)
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false)
  const [snackbarCopy, setSnackbarCopy] = useState('')

  useSnackbarMonitor(isSnackbarVisible, setIsSnackbarVisible, defaultSnackbarTimeout)

  useEffect(() => {
    requestGet(`/pdf_subscriptions/current?report=${PDF_REPORT}`, (body) => {
      setCurrentPdfSubscription(body)
    })
  }, [])

  const size = useWindowSize()

  const showSnackbar = (snackbarCopy: string) => {
    setSnackbarCopy(snackbarCopy)
    setIsSnackbarVisible(true)
  }

  function handleClickDownloadReport() { window.print() }

  function handleSetSelectedTabFromDropdown(option) { setSelectedTab(option.value) }

  function handleClickSubscribe() {
    setIsSubscriptionModalOpen(!isSubscriptionModalOpen);
  }

  function handleSubscriptionCancel() {
    setIsSubscriptionModalOpen(false);
  }

  function handleSubscriptionSave(isSubscribed, frequency) {
    setIsSubscriptionModalOpen(false);
    if (isSubscribed) {
      saveFilterSelections(PDF_REPORT, (adminReportFilterSelection) => {
        createOrUpdatePdfSubscription(adminReportFilterSelection, frequency)
      })
    } else if (currentPdfSubscription) {
      deletePdfSubscription(currentPdfSubscription.id)
    }
    showSnackbar('Subscription settings saved')
  }

  function createOrUpdatePdfSubscription(adminReportFilterSelection, frequency) {
    if (!adminReportFilterSelection?.id) { return }

    const pdfSubscriptionParams = {
      pdf_subscription: {
        admin_report_filter_selection_id: adminReportFilterSelection.id,
        frequency
      }
    }

    requestPost('/pdf_subscriptions/create_or_update', pdfSubscriptionParams, (pdfSubscription) => {
      setCurrentPdfSubscription(pdfSubscription)
    })
  }

  function deletePdfSubscription(pdfSubscriptionId) {
    requestDelete(`/pdf_subscriptions/${pdfSubscriptionId}`, {}, () => setCurrentPdfSubscription(null), error => { throw (error) })
  }

  if (loadingFilters) {
    return <Spinner />
  }

  const renderSnackbar = () => {
    return <Snackbar text={snackbarCopy} visible={isSnackbarVisible} />
  }

  const tabs = TAB_NAMES.map(s => (
    <Tab
      key={s}
      section={s}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    />
  ))

  const tabDropdownOptions = TAB_NAMES.map(tab => ({ value: tab, label: tab, }))

  const tabDropdown = (
    <DropdownInput
      handleChange={handleSetSelectedTabFromDropdown}
      id="tab-dropdown"
      isSearchable={false}
      label=""
      options={tabDropdownOptions}
      value={tabDropdownOptions.find(opt => opt.value === selectedTab)}
    />
  )

  const sectionsToShow = selectedTab === ALL ? snapshotSections : snapshotSections.filter(s => s.name === selectedTab)
  const snapshotSectionComponents = sectionsToShow.map(section => (
    <SnapshotSection
      active={section.name === selectedTab}
      className={section.className}
      customTimeframeEnd={customEndDate?.toDate()}
      customTimeframeStart={customStartDate?.toDate()}
      itemGroupings={section.itemGroupings}
      key={section.name}
      name={section.name}
      pusherChannel={pusherChannel}
      searchCount={searchCount}
      selectedClassroomIds={mapItemsIfNotAll(selectedClassrooms, availableClassrooms)}
      selectedGrades={mapItemsIfNotAll(selectedGrades, availableGrades, 'value')}
      selectedSchoolIds={selectedSchools.map(s => s.id)}
      selectedTeacherIds={mapItemsIfNotAll(selectedTeachers, availableTeachers)}
      selectedTimeframe={selectedTimeframe.value}
    />
  ))

  if (accessType !== FULL) {
    return restrictedPage
  }

  return (
    <main>
      <div className="header">
        <h1>
          <span>Usage Snapshot Report</span>
          <a
            href="https://support.quill.org/en/articles/8358350-how-do-i-use-the-usage-snapshot-report"
            rel="noopener noreferrer"
            target="_blank"
          >
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
          <button
            className="quill-button-archived download-report-button contained primary medium focus-on-light"
            onClick={handleClickDownloadReport}
            type="button"
          >
            <img alt={whiteArrowPointingDownIcon.alt} src={whiteArrowPointingDownIcon.src} />
            <span>Download</span>
          </button>
        </div>
      </div>
      <div aria-hidden={true} className="tabs">
        {size.width >= MAX_VIEW_WIDTH_FOR_MOBILE ? tabs : tabDropdown}
      </div>
      <div className="filter-button-container">
        <button
          className="interactive-wrapper focus-on-light"
          onClick={openMobileFilterMenu}
          type="button"
        >
          <img alt={filterIcon.alt} src={filterIcon.src} />
          Filters
        </button>
      </div>
      <div className="sections">
        {snapshotSectionComponents}
      </div>
      <ReportSubscriptionModal
        cancel={handleSubscriptionCancel}
        currentPdfSubscription={currentPdfSubscription}
        isOpen={isSubscriptionModalOpen}
        save={handleSubscriptionSave}
      />
      {renderSnackbar()}
      <div id="bottom-element" />

    </main >
  )
}

export default UsageSnapshotsContainer;
