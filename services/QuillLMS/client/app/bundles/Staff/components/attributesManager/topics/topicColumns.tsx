import * as React from 'react'

import TopicLevelTable from './topicLevelTable'
import TopicBox from './topicBox'
import ArchivedTopicBox from './archivedTopicBox'
import NewTopicBox from './newTopicBox'

const TopicColumns = ({ topics, searchValue, saveTopicChanges, createNewTopic, visible, }) => {
  const [selectedTopicId, setSelectedTopicId] = React.useState(null)

  function closeTopicBox() { setSelectedTopicId(null) }

  function selectTopic(topic) { setSelectedTopicId(topic.id)}

  const filteredTopics = topics.filter(t => t.visible === visible && t.name.toLowerCase().includes(searchValue.toLowerCase()))

  let topicBox
  let newTopicBoxes

  const sharedTopicBoxProps = {
    closeTopicBox,
    levelThreeTopics: topics.filter(t => t.level === 3 && t.visible),
  }

  if (selectedTopicId) {
    const topicBoxProps = {
      ...sharedTopicBoxProps,
      originalTopic: topics.find(t => t.id === selectedTopicId),
      saveTopicChanges
    }
    topicBox = visible ? <TopicBox {...topicBoxProps} /> : <ArchivedTopicBox {...topicBoxProps} />
  }

  if (createNewTopic) {
    const createNewTopicBoxProps = {
      ...sharedTopicBoxProps,
      createNewTopic
    }
    newTopicBoxes = (<React.Fragment>
      <NewTopicBox {...createNewTopicBoxProps} levelNumber={3} />
      <NewTopicBox {...createNewTopicBoxProps} levelNumber={2} />
      <NewTopicBox {...createNewTopicBoxProps} levelNumber={1} />
      <NewTopicBox {...createNewTopicBoxProps} levelNumber={0} />
    </React.Fragment>)
  }

  const sharedProps = {
    topics: filteredTopics,
    showExtraColumns: visible && !createNewTopic,
    selectTopic,
    visible,
  }

  return (
    <div className="topic-columns">
      <TopicLevelTable {...sharedProps} levelNumber={3} />
      <TopicLevelTable {...sharedProps} levelNumber={2} />
      <TopicLevelTable {...sharedProps} levelNumber={1} />
      <TopicLevelTable {...sharedProps} levelNumber={0} />
      <div className="record-box-container">
        {topicBox}
        {newTopicBoxes}
      </div>
    </div>
)
}

export default TopicColumns
