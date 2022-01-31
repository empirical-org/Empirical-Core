import * as React from 'react'

const renderYourAnswer = (projector, response) => {
  if (projector || !response) { return }

  const responseArray = response instanceof Object ? Object.values(response) : [response]

  const responses = responseArray.map(r => <p className="your-answer" dangerouslySetInnerHTML={{ __html: r}} key={r} />)

  return (
    <div className="your-answer-container">
      <p className="answer-header">Your response</p>
      {responses}
    </div>
  )
}

const renderClassAnswersList = (selectedSubmissionOrder, submissions, sampleCorrectAnswer) => {
  const selected = selectedSubmissionOrder ? selectedSubmissionOrder.map((key, index) => {
    let text
    const splitKey = key.split('#')
    const studentKey = splitKey[0]
    const subIndex = splitKey[1]
    if (submissions && submissions[studentKey] && submissions[studentKey].data) {
      text = submissions[studentKey].data instanceof Object ? submissions[studentKey].data[subIndex] : submissions[studentKey].data
    } else if (key === 'correct' && sampleCorrectAnswer){
      text = sampleCorrectAnswer
    } else {
      text = ''
    }
    return <li dangerouslySetInnerHTML={{ __html: text}} key={index} />
  }) : null;
  return (
    <ol className="class-answer-list">
      {selected}
    </ol>
  )
}

const ProjectedAnswers = ({ selectedSubmissions, selectedSubmissionOrder, projector, response, sampleCorrectAnswer, submissions, }) => {
  let classAnswers
  if (selectedSubmissions && selectedSubmissionOrder) {
    classAnswers = (<div>
      <p className="answer-header">Class responses</p>
      {renderClassAnswersList(selectedSubmissionOrder, submissions, sampleCorrectAnswer)}
    </div>)
  }
  return (
    <div className="display-mode">
      {renderYourAnswer(projector, response)}
      {classAnswers}
    </div>
  );

}

export default ProjectedAnswers
