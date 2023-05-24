import React from 'react'

import SnapshotCount from './snapshotCount'
import { SMALL, MEDIUM, POSITIVE, NEGATIVE, } from './shared'

const SentencesWritten = ({}) => {
  const [count, setCount] = React.useState(null)
  const [change, setChange] = React.useState(0)
  const [changeDirection, setChangeDirection] = React.useState(null)

  return (
    <SnapshotCount
      change={change}
      changeDirection={changeDirection}
      count={count}
      label="Sentences written"
      size={MEDIUM}
    />
  )
}

const StudentLearningHours = ({}) => {
  const [count, setCount] = React.useState(null)
  const [change, setChange] = React.useState(0)
  const [changeDirection, setChangeDirection] = React.useState(null)

  return (
    <SnapshotCount
      change={change}
      changeDirection={changeDirection}
      count={count}
      label="Student learning hours"
      size={MEDIUM}
    />
  )
}

const Highlights = ({}) => {
  return (
    <section className="snapshot-section highlights">
      <h2>Highlights</h2>
      <div className="snapshot-section-content">
        <SentencesWritten />
        <StudentLearningHours />
      </div>
    </section>
  )
}

export default Highlights
