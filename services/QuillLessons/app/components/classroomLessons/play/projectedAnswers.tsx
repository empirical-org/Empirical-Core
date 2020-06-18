import * as React from 'react'

const ProjectedAnswers = ({ selectedSubmissions, selectedSubmissionOrder, projector, response, sampleCorrectAnswer, submissions, }) => {
  const renderYourAnswer = () => {
    if (projector || !response) { return }

    return (<div className="your-answer-container">
      <p className="answer-header">Your response</p>
      <p className="your-answer" dangerouslySetInnerHTML={{ __html: response}} />
    </div>)
  }

  const renderClassAnswersList = () => {
    const selected = selectedSubmissionOrder ? selectedSubmissionOrder.map((key, index) => {
      let text
      if (submissions && submissions[key] && submissions[key].data) {
        text = submissions[key].data
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

  let classAnswers
  if (selectedSubmissions && selectedSubmissionOrder) {
    classAnswers = (<div>
      <p className="answer-header">Class responses</p>
      {renderClassAnswersList()}
    </div>)
  }
  return (
    <div className="display-mode">
      {renderYourAnswer()}
      {classAnswers}
    </div>
  );

}

export default ProjectedAnswers
