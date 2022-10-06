import * as React from 'react';

import { Activity, Topic } from './interfaces'
import { TOPIC_FILTERS, AVERAGE_FONT_WIDTH, activityClassificationGroupings, } from './shared'

import { Tooltip } from '../../../../../Shared/index'
import { requestGet } from '../../../../../../modules/request/index'

const dropdownIconSrc = `${process.env.CDN_URL}/images/icons/dropdown.svg`
const indeterminateSrc = `${process.env.CDN_URL}/images/icons/indeterminate.svg`
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`
const LEVEL_THREE = 3
const LEVEL_TWO = 2

interface Grouping {
  levelTwoIds: string[],
  levelOneIds: string[]
  group: string
}

interface IndividualTopicFilterRowProps {
  topicFilters: number[],
  topicKey: number,
  handleTopicFilterChange: (topicFilters: number[]) => void,
  uniqueLevelTwoTopics: Topic[],
  uniqueLevelOneTopics: Topic[],
  filteredActivities: Activity[],
}

interface TopicToggleProps {
  filteredActivities: Activity[],
  grouping: Grouping,
  uniqueLevelTwoTopics: Topic[],
  uniqueLevelOneTopics: Topic[],
  topicFilters: number[],
  handleTopicFilterChange: (topicFilters: number[]) => void,
  level: number,
  topics: Topic[]
}

interface TopicFiltersProps {
  activities: Activity[],
  filterActivities: (ignoredKey?: string) => Activity[]
  topicFilters: number[],
  handleTopicFilterChange: (topicFilters: number[]) => void,
  topics: Topic[],
}

const IndividualTopicFilterRow = ({ topicFilters, topicKey, handleTopicFilterChange, uniqueLevelOneTopics, filteredActivities, }: IndividualTopicFilterRowProps) => {
  function checkIndividualFilter() {
    const newTopicFilters = Array.from(new Set(topicFilters.concat([topicKey])))
    handleTopicFilterChange(newTopicFilters)
  }

  function uncheckIndividualFilter() {
    const newTopicFilters = topicFilters.filter(k => k !== topicKey)
    handleTopicFilterChange(newTopicFilters)
  }

  const topic = uniqueLevelOneTopics.find(t => t.id === topicKey)
  const activityCount = filteredActivities.filter(act => act.topics && act.topics.find(t => t.id === topicKey)).length
  let checkbox = <button aria-label={`Check ${topic.name}`} className="focus-on-light quill-checkbox unselected" onClick={checkIndividualFilter} type="button" />

  if (topicFilters.includes(topicKey)) {
    checkbox = (<button aria-label={`Uncheck ${topic.name}`} className="focus-on-light quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  } else if (activityCount === 0) {
    checkbox = <div aria-label={`Check ${topic.name}`} className="focus-on-light quill-checkbox disabled" />
  }

  const topicNameElement = topic.name.length * AVERAGE_FONT_WIDTH >= 182 ? <Tooltip tooltipText={topic.name} tooltipTriggerText={topic.name} tooltipTriggerTextClass="tooltip-trigger-text" /> : <span>{topic.name}</span>

  return (
    <div className="level-one-row filter-row topic-row" key={topicKey}>
      <div>
        {checkbox}
        {topicNameElement}
      </div>
      <span>({activityCount})</span>
    </div>
  )
}

const TopicToggle = ({filteredActivities, grouping, uniqueLevelTwoTopics, uniqueLevelOneTopics, topicFilters, handleTopicFilterChange, level, topics, }: TopicToggleProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  function toggleIsOpen() { setIsOpen(!isOpen) }

  function uncheckAllFilters() {
    const newTopicFilters = topicFilters.filter(levelOneId => !grouping.levelOneIds.includes(levelOneId))
    handleTopicFilterChange(newTopicFilters)
  }

  function checkAllFilters() {
    const newTopicFilters = Array.from(new Set(topicFilters.concat(grouping.levelOneIds)))
    handleTopicFilterChange(newTopicFilters)
  }

  const toggleArrow = <button aria-label="Toggle menu" className="interactive-wrapper focus-on-light filter-toggle-button" onClick={toggleIsOpen} type="button"><img alt="" className={isOpen ? 'is-open' : 'is-closed'} src={dropdownIconSrc} /></button>
  let topLevelCheckbox = <button aria-label="Check all nested filters" className="focus-on-light quill-checkbox unselected" onClick={checkAllFilters} type="button" />
  const topLevelActivityCount = filteredActivities.filter(act => act.topics && act.topics.some(t => grouping.levelOneIds.includes(t.id))).length

  if (grouping.levelOneIds.every(levelOneId => topicFilters.includes(levelOneId))) {
    topLevelCheckbox = (<button aria-label="Uncheck all nested filters" className="focus-on-light quill-checkbox selected" onClick={uncheckAllFilters} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  } else if (grouping.levelOneIds.some(levelTwoId => topicFilters.includes(levelTwoId))) {
    topLevelCheckbox = (<button aria-label="Uncheck all nested filters" className="focus-on-light quill-checkbox selected" onClick={uncheckAllFilters} type="button">
      <img alt="Indeterminate checkbox" src={indeterminateSrc} />
    </button>)
  } else if (topLevelActivityCount === 0) {
    topLevelCheckbox = <div className="focus-on-light quill-checkbox disabled" />
  }

  let individualFilters = <span />

  if (isOpen) {
    if (level === LEVEL_THREE) {
      individualFilters = grouping.levelTwoIds.map((levelTwoId: string) =>
      {
        const levelTwoTopic = topics.find(t => t.id === levelTwoId);
        const filteredLevelOneTopics = uniqueLevelOneTopics.filter(t => t.parent_id === levelTwoTopic.id)
        const filteredGrouping = {group: levelTwoTopic.name, levelTwoIds: grouping.levelTwoIds, levelOneIds: filteredLevelOneTopics.map(t => t.id)}
        return (
          <TopicToggle
            filteredActivities={filteredActivities}
            grouping={filteredGrouping}
            handleTopicFilterChange={handleTopicFilterChange}
            key={levelTwoTopic.name}
            level={LEVEL_TWO}
            topicFilters={topicFilters}
            uniqueLevelOneTopics={uniqueLevelOneTopics}
            uniqueLevelTwoTopics={uniqueLevelTwoTopics}
          />
        )
      }
      )
    } else {
      individualFilters = grouping.levelOneIds.map((levelOneId: string) =>
        (<IndividualTopicFilterRow
          filteredActivities={filteredActivities}
          handleTopicFilterChange={handleTopicFilterChange}
          key={levelOneId}
          topicFilters={topicFilters}
          topicKey={levelOneId}
          uniqueLevelOneTopics={uniqueLevelOneTopics}
          uniqueLevelTwoTopics={uniqueLevelTwoTopics}
        />)
      )
    }
  }

  const className = level === LEVEL_THREE ? "top-level" : "individual-row"

  return (
    <section className="toggle-section activity-classification-toggle">
      <div className={className+" filter-row"}>
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

const TopicFilters = ({ activities, filterActivities, topicFilters, handleTopicFilterChange, topics, }: TopicFiltersProps) => {
  let levelOneTopicsInUse = []
  let uniqueLevelOneTopics = []
  let uniqueLevelTwoTopics = []
  let filteredActivities = []
  let topicGroupings = []

  function clearAllTopicFilters() { handleTopicFilterChange([]) }

  function getUniqueTopics(topics) { return Array.from(new Set(topics.map(a => a.id))).map(id => topics.find(t => t.id === id)) }

  if (topics.length) {
    activities.forEach(a => { levelOneTopicsInUse = levelOneTopicsInUse.concat(a.topics) })
    uniqueLevelOneTopics = getUniqueTopics(levelOneTopicsInUse)

    const levelTwoTopicsInUse = uniqueLevelOneTopics.map(levelOneTopic => topics.find(topic => topic.id === levelOneTopic.parent_id))
    uniqueLevelTwoTopics = getUniqueTopics(levelTwoTopicsInUse)

    const levelThreeTopicsInUse = uniqueLevelTwoTopics.map(levelTwoTopic => topics.find(topic => topic.id === levelTwoTopic.parent_id))
    const uniqueLevelThreeTopics = getUniqueTopics(levelThreeTopicsInUse)

    filteredActivities = filterActivities(TOPIC_FILTERS)

    topicGroupings = uniqueLevelThreeTopics.sort((a, b) => a.name.localeCompare(b.name)).map(levelThree => {
      const levelTwoIds =  uniqueLevelTwoTopics.filter(levelTwo => levelTwo.parent_id === levelThree.id).sort((a, b) => a.name.localeCompare(b.name)).map(levelTwo => levelTwo.id)
      return {
        group: levelThree.name,
        levelTwoIds: levelTwoIds,
        levelOneIds: uniqueLevelOneTopics.filter(levelOne => levelTwoIds.includes(levelOne.parent_id)).sort((a, b) => a.name.localeCompare(b.name)).map(levelOne => levelOne.id)
      }
    })
  }

  const topicToggles = topicGroupings.map(grouping =>
    (<TopicToggle
      filteredActivities={filteredActivities}
      grouping={grouping}
      handleTopicFilterChange={handleTopicFilterChange}
      key={grouping.group}
      level={LEVEL_THREE}
      topicFilters={topicFilters}
      topics={topics}
      uniqueLevelOneTopics={uniqueLevelOneTopics}
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
