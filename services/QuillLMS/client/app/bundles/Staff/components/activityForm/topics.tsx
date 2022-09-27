import * as React from 'react'

import TopicGroup from './topicGroup'

const Topics = ({ activity, createNewTopic, topicOptions, handleTopicsChange, }) => {
  const [topicsEnabled, setTopicsEnabled] = React.useState(!!activity.topic_ids.length)

  React.useEffect(() => {
    if (!topicsEnabled) {
      handleTopicsChange([])
    }
  }, [topicsEnabled])

  function getTopicFromId(id: number) {
    return topicOptions.find(to => to.id === id)
  }

  function findParentTopic(topic) {
    return topicOptions.find(t => t.id === topic.parent_id)
  }

  function handleLevelOneChange(oldId, newId) {
    let newTopicIds = activity.topic_ids.filter(t => t !== oldId)
    newTopicIds.push(newId)
    handleTopicsChange(newTopicIds)
  }

  function toggleTopicsEnabled(e) {
    setTopicsEnabled(!topicsEnabled)
  }

  const firstTopic = getTopicFromId(activity.topic_ids[0]) || {}
  const secondTopic = getTopicFromId(activity.topic_ids[1]) || {}
  const thirdTopic = getTopicFromId(activity.topic_ids[2]) || {}

  return (
    <section className="topics-container enabled-attribute-container">
      <section className="enable-topics-container checkbox-container">
        <input checked={topicsEnabled} onChange={toggleTopicsEnabled} type="checkbox" />
        <label>Topics enabled</label>
      </section>
      <div className="topic-groups-container">
        <TopicGroup createNewTopic={createNewTopic} findParentTopic={findParentTopic} topic={firstTopic} topicOptions={topicOptions} handleLevelOneChange={handleLevelOneChange} />
        <TopicGroup createNewTopic={createNewTopic} findParentTopic={findParentTopic} topic={secondTopic} topicOptions={topicOptions} handleLevelOneChange={handleLevelOneChange} />
        <TopicGroup createNewTopic={createNewTopic} findParentTopic={findParentTopic} topic={thirdTopic} topicOptions={topicOptions} handleLevelOneChange={handleLevelOneChange} />
      </div>
    </section>
  )
}

export default Topics
