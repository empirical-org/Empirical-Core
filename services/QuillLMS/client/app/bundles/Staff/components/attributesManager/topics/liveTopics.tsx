import * as React from 'react'

import TopicLevelTable from './topicLevelTable'
import TopicBox from './topicBox'

const LiveTopics = ({ liveTopics, searchValue, saveTopicChanges, }) => {
  const [selectedTopicId, setSelectedTopicId] = React.useState(null)

  function closeTopicBox() { setSelectedTopicId(null) }

  function selectTopic(topic) { setSelectedTopicId(topic.id)}

  const filteredLiveTopics = liveTopics.filter(t => t.name.toLowerCase().includes(searchValue.toLowerCase()))

  let topicBox
  if (selectedTopicId) {
    topicBox = (<TopicBox
      closeTopicBox={closeTopicBox}
      levelThreeTopics={liveTopics.filter(t => t.level === 3)}
      originalTopic={liveTopics.find(t => t.id === selectedTopicId)}
      saveTopicChanges={saveTopicChanges}
    />)
  }

  return <div className="live-topics-manager">
    <TopicLevelTable levelNumber={3} topics={filteredLiveTopics} selectTopic={selectTopic} />
    <TopicLevelTable levelNumber={2} topics={filteredLiveTopics} selectTopic={selectTopic} />
    <TopicLevelTable levelNumber={1} topics={filteredLiveTopics} selectTopic={selectTopic} />
    <TopicLevelTable levelNumber={0} topics={filteredLiveTopics} selectTopic={selectTopic} />
    {topicBox}
  </div>
}

export default LiveTopics
