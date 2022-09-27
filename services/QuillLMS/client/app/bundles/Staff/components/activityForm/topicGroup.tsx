import * as React from 'react'

import TopicColumn from './topicColumn'

const TopicGroup = ({ createNewTopic, findParentTopic, topic, topicOptions, handleLevelOneChange }) => {

  const [levelOneTopic, setLevelOneTopic] = React.useState(topic)
  const [levelTwoTopic, setLevelTwoTopic] = levelOneTopic.id ? React.useState(findParentTopic(topic)) : React.useState({})
  const [levelThreeTopic, setLevelThreeTopic] = levelOneTopic.id ? React.useState(findParentTopic(levelTwoTopic)) : React.useState({})

  React.useEffect(() => {
    if (levelOneTopic.parent_id != levelTwoTopic.id) {
      setLevelOneTopic({})
    }
  }, [levelTwoTopic]);

  React.useEffect(() => {
    if (levelTwoTopic.parent_id != levelThreeTopic.id) {
      setLevelTwoTopic({})
    }
  }, [levelThreeTopic]);

  function selectTopicNew(topicId, level) {
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

  function getFilteredOptionsForLevelNew(level: number, selectedId: number) {
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

  function createNewTopicNew(topic: object) {
    topic.parent_id = levelTwoTopic.id
    createNewTopic(topic)
  }

  console.log(topic)
  console.log(levelOneTopic)

  return (
    <div className="topic-group">
      <TopicColumn createNewTopicNew={createNewTopicNew} getFilteredOptionsForLevelNew={getFilteredOptionsForLevelNew} levelNumber={3} selectTopicNew={selectTopicNew} topic={levelThreeTopic} removeTopic={removeTopic} />
      <TopicColumn createNewTopicNew={createNewTopicNew} getFilteredOptionsForLevelNew={getFilteredOptionsForLevelNew} levelNumber={2} selectTopicNew={selectTopicNew} topic={levelTwoTopic} removeTopic={removeTopic} />
      <TopicColumn createNewTopicNew={createNewTopicNew} getFilteredOptionsForLevelNew={getFilteredOptionsForLevelNew} levelNumber={1} selectTopicNew={selectTopicNew} topic={levelOneTopic} removeTopic={removeTopic} />
    </div>
  );
}

export default TopicGroup
