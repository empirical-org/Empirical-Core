import * as React from 'react'

import TopicLevelTable from './topicLevelTable'

const LiveTopics = ({ liveTopics, }) => {
  return <div className="live-topics-manager">
    <TopicLevelTable levelNumber={3} topics={liveTopics} />
    <TopicLevelTable levelNumber={2} topics={liveTopics} />
    <TopicLevelTable levelNumber={1} topics={liveTopics} />
    <TopicLevelTable levelNumber={0} topics={liveTopics} />
  </div>
}

export default LiveTopics
