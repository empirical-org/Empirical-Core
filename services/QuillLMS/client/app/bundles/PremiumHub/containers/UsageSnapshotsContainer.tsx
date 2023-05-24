import React from 'react'

import Highlights from '../components/usage_snapshots/highlights'

const ALL = 'All'
const HIGHLIGHTS = 'Highlights'
const USERS = 'Users'
const PRACTICE = 'Practice'
const CLASSROOMS = 'Classrooms'
const SCHOOLS = 'Schools'

const TAB_NAMES = [ALL, HIGHLIGHTS, USERS, PRACTICE, CLASSROOMS, SCHOOLS]

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

  const tabNameToComponent = {
    [HIGHLIGHTS]: <Highlights />
  }

  const visibleSections = selectedTab === ALL ? Object.values(tabNameToComponent) : [tabNameToComponent[selectedTab]]

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
          {visibleSections}
        </div>
      </main>
    </div>
  )
}

export default UsageSnapshotsContainer
