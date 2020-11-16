import * as React from 'react'

import TopicLevelTable from './topicLevelTable'
import TopicBox from './topicBox'
import ArchivedTopicBox from './archivedTopicBox'

const TopicColumns = ({ topics, searchValue, saveTopicChanges, visible, }) => {
  const [selectedTopicId, setSelectedTopicId] = React.useState(null)

  function closeTopicBox() { setSelectedTopicId(null) }

  function selectTopic(topic) { setSelectedTopicId(topic.id)}

  const filteredTopics = topics.filter(t => t.visible === visible && t.name.toLowerCase().includes(searchValue.toLowerCase()))

  let topicBox
  if (selectedTopicId) {
    const topicBoxProps = {
      closeTopicBox,
      levelThreeTopics: topics.filter(t => t.level === 3 && t.visible),
      originalTopic: topics.find(t => t.id === selectedTopicId),
      saveTopicChanges
    }
    topicBox = visible ? <TopicBox {...topicBoxProps} /> : <ArchivedTopicBox {...topicBoxProps} />
  }

  const sharedProps = {
    topics: filteredTopics,
    selectTopic,
    visible
  }

  return <div className="topic-columns">
    <TopicLevelTable {...sharedProps} levelNumber={3} />
    <TopicLevelTable {...sharedProps} levelNumber={2} />
    <TopicLevelTable {...sharedProps} levelNumber={1} />
    <TopicLevelTable {...sharedProps} levelNumber={0} />
    {topicBox}
  </div>
}

export default TopicColumns
