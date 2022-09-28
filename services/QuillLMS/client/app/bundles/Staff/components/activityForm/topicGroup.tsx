import * as React from 'react'

import TopicColumn from './topicColumn'

const TopicGroup = ({ createNewTopic, findParentTopic, topic, topicOptions, handleLevelOneChange }) => {

  const [levelOneTopic, setLevelOneTopic] = React.useState(topic)
  const [levelTwoTopic, setLevelTwoTopic] = levelOneTopic.id ? React.useState(findParentTopic(topic)) : React.useState({})
  const [levelThreeTopic, setLevelThreeTopic] = levelOneTopic.id ? React.useState(findParentTopic(levelTwoTopic)) : React.useState({})

  React.useEffect(() => {
    if (levelOneTopic.parent_id !== levelTwoTopic.id) {
      handleLevelOneChange(levelOneTopic.id, null)
      setLevelOneTopic({})
    }
  }, [levelTwoTopic]);

  React.useEffect(() => {
    if (levelTwoTopic.parent_id !== levelThreeTopic.id) {
      setLevelTwoTopic({})
    }
  }, [levelThreeTopic]);

  function selectTopic(topicId, level) {
    const newTopic = topicOptions.find(t => t.id === topicId)
    if (level === 1) {
      handleLevelOneChange(levelOneTopic.id, newTopic.id)
      setLevelOneTopic(newTopic)
    } else if (level === 2) {
      setLevelTwoTopic(newTopic)
    } else if (level === 3) {
      setLevelThreeTopic(newTopic)
    }
  }

  function removeTopic(level: number) {
    if (level === 1) {
      setLevelOneTopic({})
    } else if (level === 2) {
      setLevelTwoTopic({})
    } else if (level === 3) {
      setLevelThreeTopic({})
    }
    handleLevelOneChange(levelOneTopic.id, null)
  }

  function getOptionsForLevel(level: number) {
    return topicOptions.filter(to => to.level === level)
  }

  function getFilteredOptionsForLevel(level: number, selectedId: number) {
    let allOptions = getOptionsForLevel(level)
    allOptions = allOptions.filter(o => o.id !== selectedId)

    if (level === 2 && levelThreeTopic) {
      return allOptions.filter(o => o.parent_id === levelThreeTopic.id)
    }

    if (level === 1 && levelTwoTopic) {
      return allOptions.filter(o => o.parent_id === levelTwoTopic.id)
    }

    return allOptions
  }

  function createNewLevelOneTopic(topic: object) {
    topic.parent_id = levelTwoTopic.id
    createNewTopic(topic)
  }

  return (
    <div className="topic-group">
      <TopicColumn createNewTopic={createNewLevelOneTopic} getFilteredOptionsForLevel={getFilteredOptionsForLevel} levelNumber={3} removeTopic={removeTopic} selectTopic={selectTopic} topic={levelThreeTopic} />
      <TopicColumn createNewTopic={createNewLevelOneTopic} getFilteredOptionsForLevel={getFilteredOptionsForLevel} levelNumber={2} removeTopic={removeTopic} selectTopic={selectTopic} topic={levelTwoTopic} />
      <TopicColumn createNewTopic={createNewLevelOneTopic} getFilteredOptionsForLevel={getFilteredOptionsForLevel} levelNumber={1} removeTopic={removeTopic} selectTopic={selectTopic} topic={levelOneTopic} />
    </div>
  );
}

export default TopicGroup
