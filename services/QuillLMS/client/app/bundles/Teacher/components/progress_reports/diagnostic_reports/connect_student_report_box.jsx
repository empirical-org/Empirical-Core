import React from 'react'
const Diff = require('diff');

import { formatString, formatStringAndAddSpacesAfterPeriods, } from './formatString'
import ConceptResultTableRow from './concept_result_table_row.tsx'

import ScoreColor from '../../modules/score_color.js'
import NumberSuffix from '../../modules/numberSuffixBuilder.js'

const ConnectStudentReportBox = ({ questionData, boxNumber, showScore, showDiff, }) => {
  function groupByAttempt() {
    return _.groupBy(questionData.concepts,
      (conc)=>conc.attempt
    );
  }

  function feedbackOrDirections(directionsOrFeedback, classNameAndText) {
    if (directionsOrFeedback) {
      return (
        <tr className={classNameAndText}>
          <td>{classNameAndText}</td>
          <td />
          <td>{formatString(directionsOrFeedback)}</td>
        </tr>
      )
    }
  }

  function conceptsByAttempt() {
    const maxAttemptsIncorrectFeedback = 'Nice effort! You worked hard to make your sentence stronger.'
    const conceptsByAttempt = groupByAttempt();
    let attemptNum = 1;
    let results = [];
    while (conceptsByAttempt[attemptNum]) {
      let currAttempt = conceptsByAttempt[attemptNum]
      let feedback = false
      let nextAttempt = conceptsByAttempt[attemptNum + 1]
      if (nextAttempt) {
        let index = 0;
        // iterate until we find a next attempt with directions
        while (!feedback && nextAttempt[index]) {
          // in some legacy data, we were not storing feedback in lastFeedback, but in directions.
          // so the second clause accounts for legacy data without lastFeedback fields.
          feedback = nextAttempt[index].lastFeedback || nextAttempt[index].directions
          index += 1;
        }
      } else if (currAttempt[0].feedback) {
        // this is the last attempt, so if it was incorrect then we return the default max attempts feedback
        // that the student saw
        feedback = currAttempt[0].correct ? currAttempt[0].feedback : maxAttemptsIncorrectFeedback
      }
      // sometimes feedback is coming through as a react variable, I've been unable to find the source of it
      if (feedback && typeof feedback === 'string') {
        feedback = feedbackOrDirections(feedback, 'Feedback')
      }
      let score = 0;
      let concepts = currAttempt.map((concept)=>{
        concept.correct ? score += 1 : null;
        return [<ConceptResultTableRow concept={concept} key={concept.id + attemptNum} />]
      });
      let averageScore = (score/currAttempt.length * 100) || 0;
      const previousAttempt = attemptNum > 1 && conceptsByAttempt[attemptNum - 1][0].answer
      const answerRow = scoreRow(conceptsByAttempt[attemptNum][0].answer, attemptNum, averageScore, previousAttempt)
      feedback ? results.push(answerRow, feedback, concepts) : results.push(answerRow, concepts)
      if (conceptsByAttempt[attemptNum + 1]) {
        results.push(emptyRow(attemptNum + averageScore))
      }
      attemptNum += 1;
    }

    return results;
  }

  function emptyRow(key) {
    return (
      <tr key={'empty-row'+key}>
        <td />
        <td />
        <td />
      </tr>
    )
  }

  function scoreRow(answer, attemptNum, averageScore, previousAnswer) {
    let answerString = answer
    if (previousAnswer && showDiff) {
      const diff = Diff.diffWords(previousAnswer, answer)
      answerString = diff.map(word => {
        if (word.removed) { return '' }
        return word.added ? <b>{word.value}</b> : word.value
      })
    }
    return (
      <tr className={ScoreColor(averageScore)} key={attemptNum + answer}>
        <td>{`${NumberSuffix(attemptNum)} Submission`}</td>
        <td />
        <td><span style={{ whiteSpace: 'pre-wrap' }}>{answerString}</span></td>
      </tr>
    )
  }

  function questionScore() {
    // occassionally there is no questionScore
    // don't just do ...questionData && ...questionData.questionScore because
    // if it questionScore is zero it will evaluate to false
    if (typeof questionData.questionScore !== undefined) {
      if (!showScore) return;
      let score
      if (questionData.questionScore) {
        score = questionData.questionScore * 100
      } else if (questionData.score) {
        score = questionData.score
      } else {
        score = 0
      }
      return (
        <tr>
          <td>Score</td>
          <td />
          <td>{score}%</td>
        </tr>
      );
    }
  }

  return (
    <div className='individual-activity-report'>
      <div className="student-report-box">
        <div className='student-report-table-and-index'>
          <div className='question-index'>{boxNumber}</div>
          <table>
            <tbody>
              {feedbackOrDirections(questionData.directions, 'Directions')}
              <tr>
                <td>Prompt</td>
                <td />
                <td>{formatStringAndAddSpacesAfterPeriods(questionData.prompt)}</td>
              </tr>
              {questionScore()}
              {emptyRow()}
              {conceptsByAttempt()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )


}

export default ConnectStudentReportBox
