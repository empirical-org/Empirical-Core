import * as React from 'react'

import TopicColumn from './topicColumn'

const Topics = ({ activity, createNewTopic, topicOptions, handleTopicsChange, }) => {
  const [topicsEnabled, setTopicsEnabled] = React.useState(!!activity.topic_ids.length)

  React.useEffect(() => {
    if (!topicsEnabled) {
      handleTopicsChange([])
    }
  }, [topicsEnabled])

  function getOptionsForLevel(level: number) {
    if (!topicsEnabled) { return [] }
    return topicOptions.filter(to => to.level === level)
  }

  function getFilteredOptionsForLevel(level: number) {
    const allOptions = getOptionsForLevel(level)
    const selectedLevelTwo = getSelectedOptionForLevel(2)
    const selectedLevelThree = getSelectedOptionForLevel(3)

    if (level === 3 && selectedLevelTwo) {
      return allOptions.filter(o => o.id === selectedLevelTwo.parent_id)
    }

    if (level === 2 && selectedLevelThree) {
      return allOptions.filter(o => o.parent_id === selectedLevelThree.id)
    }

    return allOptions
  }

  function getSelectedOptionForLevel(level: number) {
    const levelOptionsForLevel = getOptionsForLevel(level)
    const option = levelOptionsForLevel.find(t => activity.topic_ids.includes(t.id))
    return option
  }

  function onChangeTopics(topicId) {
    let newTopicIds = [...activity.topic_ids]
    const topic = topicOptions.find(t => t.id === topicId)
    const existingOption = getSelectedOptionForLevel(topic.level)

    if (existingOption) {
      newTopicIds = newTopicIds.filter(id => id !== existingOption.id)
      const existingParent = topicOptions.find(t => t.id === existingOption.parent_id)
      if (existingParent) {
        newTopicIds = newTopicIds.filter(id => id !== existingParent.id)
        const existingGrandparent = topicOptions.find(t => t.id === existingParent.parent_id)
        if (existingGrandparent) {
          newTopicIds = newTopicIds.filter(id => id !== existingGrandparent.id)
        }
      }
    }

    if (!existingOption || existingOption.id !== topic.id) {
      newTopicIds.push(topic.id)
      if (topic.parent_id) {
        const parentTopic = topicOptions.find(t => t.id === topic.parent_id)
        newTopicIds.push(parentTopic.id)
        if (parentTopic.parent_id) {
          const grandparentTopic = topicOptions.find(t => t.id === parentTopic.parent_id)
          newTopicIds.push(grandparentTopic.id)
        }
      }
    }

    handleTopicsChange(newTopicIds)
  }

  function toggleTopicsEnabled(e) {
    setTopicsEnabled(!topicsEnabled)
  }

  const sharedTopicColumnProps = {
    getFilteredOptionsForLevel,
    selectTopic: onChangeTopics,
    getSelectedOptionForLevel,
    createNewTopic
  }

  return (
    <section className="topics-container enabled-attribute-container">
      <section className="enable-topics-container checkbox-container">
        <input checked={topicsEnabled} onChange={toggleTopicsEnabled} type="checkbox" />
        <label>Topics enabled</label>
      </section>
      <TopicColumn {...sharedTopicColumnProps} levelNumber={3} />
      <TopicColumn {...sharedTopicColumnProps} levelNumber={2} />
      <TopicColumn {...sharedTopicColumnProps} levelNumber={1} />
      <TopicColumn {...sharedTopicColumnProps} levelNumber={0} />
    </section>
  )
}

export default Topics
