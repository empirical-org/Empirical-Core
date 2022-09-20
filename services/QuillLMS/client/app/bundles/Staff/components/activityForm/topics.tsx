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
    let newTopicIds = activity.topic_ids
    const newTopic = topicOptions.find(t => t.id === topicId)
    const previousTopic = getSelectedOptionForLevel(newTopic.level)

    if (previousTopic && previousTopic.id === newTopic.id) {
      newTopicIds = removeExistingTopicAndParents(newTopicIds, previousTopic)
    } else {
      newTopicIds = removeExistingTopicAndParents(newTopicIds, previousTopic)
      newTopicIds = addNewTopicAndParents(newTopicIds, newTopic)
    }
    console.log(newTopicIds)

    handleTopicsChange(newTopicIds)
  }

  function removeExistingTopicAndParents(listToFilter, existingTopic) {
    if (existingTopic) {
      const existingParentTopic = findParentTopic(topicOptions, existingTopic)
      listToFilter = listToFilter.filter(id => id !== existingTopic.id)
      if (existingParentTopic) {
        listToFilter = listToFilter.filter(id => id !== existingParentTopic.id)
        const existingGrandparentTopic = findParentTopic(topicOptions, existingParentTopic)
        if (existingGrandparentTopic) {
          listToFilter = listToFilter.filter(id => id !== existingGrandparentTopic.id)
        }
      }
    }
    return listToFilter
  }

  function addNewTopicAndParents(listToModify, newTopic) {
    listToModify.push(newTopic.id)
    if (newTopic.parent_id) {
      const newParentTopic = findParentTopic(topicOptions, newTopic)
      listToModify.push(newParentTopic.id)
      if (newParentTopic.parent_id) {
        const newGrandparentTopic = findParentTopic(topicOptions, newParentTopic)
        listToModify.push(newGrandparentTopic.id)
      }
    }
    return listToModify
  }

  function findParentTopic(topicList, topic) {
    return topicList.find(t => t.id === topic.parent_id)
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
