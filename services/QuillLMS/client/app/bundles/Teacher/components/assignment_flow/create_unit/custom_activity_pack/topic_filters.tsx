import * as React from 'react';

import { Activity, Topic } from './interfaces'
import { TOPIC_FILTERS, AVERAGE_FONT_WIDTH, } from './shared'

import { Tooltip } from '../../../../../Shared/index'

const dropdownIconSrc = `${process.env.CDN_URL}/images/icons/dropdown.svg`
const indeterminateSrc = `${process.env.CDN_URL}/images/icons/indeterminate.svg`
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface Grouping {
  levelTwoIds: string[],
  group: string
}

interface IndividualTopicFilterRowProps {
  topicFilters: number[],
  topicKey: number,
  handleTopicFilterChange: (topicFilters: number[]) => void,
  uniqueLevelTwoTopics: Topic[],
  filteredActivities: Activity[],
}

interface TopicToggleProps {
  filteredActivities: Activity[],
  grouping: Grouping,
  uniqueLevelTwoTopics: Topic[],
  topicFilters: number[],
  handleTopicFilterChange: (topicFilters: number[]) => void,
}

interface TopicFiltersProps {
  activities: Activity[],
  filterActivities: (ignoredKey?: string) => Activity[]
  topicFilters: number[],
  handleTopicFilterChange: (topicFilters: number[]) => void,
}

const IndividualTopicFilterRow = ({ topicFilters, topicKey, handleTopicFilterChange, uniqueLevelTwoTopics, filteredActivities, }: IndividualTopicFilterRowProps) => {
  function checkIndividualFilter() {
    const newTopicFilters = Array.from(new Set(topicFilters.concat([topicKey])))
    handleTopicFilterChange(newTopicFilters)
  }

  function uncheckIndividualFilter() {
    const newTopicFilters = topicFilters.filter(k => k !== topicKey)
    handleTopicFilterChange(newTopicFilters)
  }

  const topic = uniqueLevelTwoTopics.find(t => t.id === topicKey)
  const activityCount = filteredActivities.filter(act => act.topics && act.topics.find(t => t.id === topicKey)).length
  let checkbox = <button aria-label={`Check ${topic.name}`} className="focus-on-light quill-checkbox unselected" onClick={checkIndividualFilter} type="button" />

  if (activityCount === 0) {
    checkbox = <div aria-label={`Check ${topic.name}`} className="focus-on-light quill-checkbox disabled" />
  } else if (topicFilters.includes(topicKey)) {
    checkbox = (<button aria-label={`Uncheck ${topic.name}`} className="focus-on-light quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  const topicNameElement = topic.name.length * AVERAGE_FONT_WIDTH >= 182 ? <Tooltip tooltipText={topic.name} tooltipTriggerText={topic.name} tooltipTriggerTextClass="tooltip-trigger-text" /> : <span>{topic.name}</span>

  return (
    <div className="individual-row filter-row topic-row" key={topicKey}>
      <div>
        {checkbox}
        {topicNameElement}
      </div>
      <span>({activityCount})</span>
    </div>
  )
}

const TopicToggle = ({filteredActivities, grouping, uniqueLevelTwoTopics, topicFilters, handleTopicFilterChange, }: TopicToggleProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  function toggleIsOpen() { setIsOpen(!isOpen) }

  function uncheckAllFilters() {
    const newTopicFilters = topicFilters.filter(levelTwoId => !grouping.levelTwoIds.includes(levelTwoId))
    handleTopicFilterChange(newTopicFilters)
  }

  function checkAllFilters() {
    const newTopicFilters = Array.from(new Set(topicFilters.concat(grouping.levelTwoIds)))
    handleTopicFilterChange(newTopicFilters)
  }

  const toggleArrow = <button aria-label="Toggle menu" className="interactive-wrapper focus-on-light filter-toggle-button" onClick={toggleIsOpen} type="button"><img alt="" className={isOpen ? 'is-open' : 'is-closed'} src={dropdownIconSrc} /></button>
  let topLevelCheckbox = <button aria-label="Check all nested filters" className="focus-on-light quill-checkbox unselected" onClick={checkAllFilters} type="button" />

  const topLevelActivityCount = filteredActivities.filter(act => act.topics && act.topics.some(t => grouping.levelTwoIds.includes(t.id))).length

  if (topLevelActivityCount === 0) {
    topLevelCheckbox = <div className="focus-on-light quill-checkbox disabled" />
  } else if (grouping.levelTwoIds.every(levelTwoId => topicFilters.includes(levelTwoId))) {
    topLevelCheckbox = (<button aria-label="Uncheck all nested filters" className="focus-on-light quill-checkbox selected" onClick={uncheckAllFilters} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  } else if (grouping.levelTwoIds.some(levelTwoId => topicFilters.includes(levelTwoId))) {
    topLevelCheckbox = (<button aria-label="Uncheck all nested filters" className="focus-on-light quill-checkbox selected" onClick={uncheckAllFilters} type="button">
      <img alt="Indeterminate checkbox" src={indeterminateSrc} />
    </button>)
  }

  let individualFilters = <span />
  if (isOpen) {
    individualFilters = grouping.levelTwoIds.map((levelTwoId: string) =>
      (<IndividualTopicFilterRow
        filteredActivities={filteredActivities}
        handleTopicFilterChange={handleTopicFilterChange}
        key={levelTwoId}
        topicFilters={topicFilters}
        topicKey={levelTwoId}
        uniqueLevelTwoTopics={uniqueLevelTwoTopics}
      />)
    )
  }

  return (
    <section className="toggle-section activity-classification-toggle">
      <div className="top-level filter-row">
        <div>
          {toggleArrow}
          {topLevelCheckbox}
          <span>{grouping.group}</span>
        </div>
        <span>({topLevelActivityCount})</span>
      </div>
      {individualFilters}
    </section>
  )
}

const TopicFilters = ({ activities, filterActivities, topicFilters, handleTopicFilterChange, }: TopicFiltersProps) => {
  let levelTwoTopics = []
  let levelThreeTopics = []
  activities.forEach(a => {
    const levelTwoTopic = a.topics && a.topics.filter(t => Number(t.level) === 2)
    const levelThreeTopic = a.topics && a.topics.filter(t => Number(t.level) === 3)
    levelTwoTopics = levelTwoTopics.concat(levelTwoTopic)
    levelThreeTopics = levelThreeTopics.concat(levelThreeTopic)
  })

  const uniqueLevelTwoTopicIds = Array.from(new Set(levelTwoTopics.map(a => a.id)))
  const uniqueLevelTwoTopics = uniqueLevelTwoTopicIds.map(id => levelTwoTopics.find(t => t.id === id))
  const uniqueLevelThreeTopicIds = Array.from(new Set(levelThreeTopics.map(a => a.id)))
  const uniqueLevelThreeTopics = uniqueLevelThreeTopicIds.map(id => levelThreeTopics.find(t => t.id === id))

  function clearAllTopicFilters() { handleTopicFilterChange([]) }

  const filteredActivities = filterActivities(TOPIC_FILTERS)

  const topicGroupings = uniqueLevelThreeTopics.sort((a, b) => a.name.localeCompare(b.name)).map(levelThree => {
    return {
      group: levelThree.name,
      levelTwoIds: uniqueLevelTwoTopics.filter(levelTwo => levelTwo.parent_id === levelThree.id).sort((a, b) => a.name.localeCompare(b.name)).map(levelTwo => levelTwo.id)
    }
  })

  const topicToggles = topicGroupings.map(grouping =>
    (<TopicToggle
      filteredActivities={filteredActivities}
      grouping={grouping}
      handleTopicFilterChange={handleTopicFilterChange}
      key={grouping.group}
      topicFilters={topicFilters}
      uniqueLevelTwoTopics={uniqueLevelTwoTopics}
    />)
  )
  const clearButton = topicFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllTopicFilters} type="button">Clear</button> : <span />
  return (
    <section className="filter-section">
      <div className="name-and-clear-wrapper">
        <h2>Topics</h2>
        {clearButton}
      </div>
      {topicToggles}
    </section>
  )
}

export default TopicFilters
