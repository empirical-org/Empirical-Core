import React from 'react'

import { FULL, restrictedPage, mapItemsIfNotAll } from '../shared';
import SnapshotSection from '../components/usage_snapshots/snapshotSection'
import { snapshotSections, TAB_NAMES, ALL, SECTION_NAME_TO_ICON_URL, } from '../components/usage_snapshots/shared'
import { Spinner, DropdownInput, } from '../../Shared/index'
import useWindowSize from '../../Shared/hooks/useWindowSize';

const MAX_VIEW_WIDTH_FOR_MOBILE = 950

const filterIconSrc = `${process.env.CDN_URL}/images/icons/icons-filter.svg`

const Tab = ({ section, setSelectedTab, selectedTab }) => {
  function handleSetSelectedTab() { setSelectedTab(section) }

  let className = 'tab'
  if (section === selectedTab) {
    className += ' selected-tab'
  }

  return <button className={className} onClick={handleSetSelectedTab} type="button"><img alt="" src={SECTION_NAME_TO_ICON_URL[section]} /><span>{section}</span></button>
}

const UsageSnapshotsContainer = ({
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

  const [selectedTab, setSelectedTab] = React.useState(ALL)

  const size = useWindowSize()

  function handleSetSelectedTabFromDropdown(option) { setSelectedTab(option.value) }

  if (loadingFilters) {
    return <Spinner />
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
      selectedClassroomIds={mapItemsIfNotAll(selectedClassrooms, allClassrooms)}
      selectedGrades={mapItemsIfNotAll(selectedGrades, allGrades, 'value')}
      selectedSchoolIds={selectedSchools.map(s => s.id)}
      selectedTeacherIds={mapItemsIfNotAll(selectedTeachers, allTeachers)}
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
          <a href="https://support.quill.org/en/articles/1588988-how-do-i-navigate-the-premium-hub" rel="noopener noreferrer" target="_blank">
            <img alt="" src={`${process.env.CDN_URL}/images/icons/file-document.svg`} />
            <span>Guide</span>
          </a>
        </h1>
        <button className="quill-button contained primary medium focus-on-light" onClick={handleClickDownloadReport} type="button">Download Report</button>
      </div>
      <div aria-hidden={true} className="tabs">
        {size.width >= MAX_VIEW_WIDTH_FOR_MOBILE ? tabs : tabDropdown}
      </div>
      <div className="filter-button-container">
        <button className="interactive-wrapper focus-on-light" onClick={openMobileFilterMenu} type="button">
          <img alt="Filter icon" src={filterIconSrc} />
          Filters
        </button>
      </div>
      <div className="sections">
        {snapshotSectionComponents}
      </div>
      <div id="bottom-element" />
    </main>
  )
}

export default UsageSnapshotsContainer
