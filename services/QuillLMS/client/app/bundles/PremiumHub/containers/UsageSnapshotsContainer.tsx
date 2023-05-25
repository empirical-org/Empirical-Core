import React from 'react'

import SnapshotSection from '../components/usage_snapshots/snapshotSection'
import { snapshotSections, TAB_NAMES, ALL, } from '../components/usage_snapshots/shared'

const Tab = ({ section, setSelectedTab, selectedTab }) => {
  function handleSetSelectedTab() { setSelectedTab(section) }

  let className = 'tab'
  if (section === selectedTab) {
    className += ' selected-tab'
  }

  return <button className={className} onClick={handleSetSelectedTab} type="button">{section}</button>
}

const UsageSnapshotsContainer = ({}) => {
  const [selectedTab, setSelectedTab] = React.useState(ALL)

  function handleClickDownloadReport() { window.print() }

  const tabs = TAB_NAMES.map(s => (
    <Tab
      key={s}
      section={s}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    />
  ))

  const sectionsToShow = selectedTab === ALL ? snapshotSections : snapshotSections.filter(s => s.name === selectedTab)
  const snapshotSectionComponents = sectionsToShow.map(section => (
    <SnapshotSection
      className={section.className}
      itemGroupings={section.itemGroupings}
      key={section.name}
      name={section.name}
    />
  ))

  return (
    <div className="usage-snapshots-container white-background-accommodate-footer">
      <section className="filters">
      </section>
      <main>
        <div className="header">
          <h1>Usage Snapshot Report</h1>
          <button className="quill-button contained primary medium focus-on-light" onClick={handleClickDownloadReport} type="button">Download Report</button>
        </div>
        <div aria-hidden={true} className="tabs">
          {tabs}
        </div>
        <div className="sections">
          {snapshotSectionComponents}
        </div>
      </main>
    </div>
  )
}

export default UsageSnapshotsContainer
