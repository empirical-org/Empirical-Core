import React from 'react'
import createReactClass from 'create-react-class';

import { formatString, formatStringAndAddSpacesAfterPeriods, } from './formatString'

import ScoreColor from '../../modules/score_color.js'
import ConceptResultTableRow from './concept_result_table_row.tsx'
import NumberSuffix from '../../modules/numberSuffixBuilder.js'

export default createReactClass({
    displayName: 'connect_student_report_box',

    groupByAttempt: function(){
		return _.groupBy(this.props.questionData.concepts,
			(conc)=>conc.attempt
		);
	},

    feedbackOrDirections: (directionsOrFeedback, classNameAndText ) => {
		if (directionsOrFeedback) {
			return (
  <tr className={classNameAndText}>
    <td>{classNameAndText}</td>
    <td />
    <td>{formatString(directionsOrFeedback)}</td>
  </tr>)
		}
	},

    conceptsByAttempt: function() {
		const conceptsByAttempt = this.groupByAttempt();
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
					feedback = nextAttempt[index].directions
					index += 1;
				}
				// sometimes feedback is coming through as a react variable, I've been unable to find the source of it
				if (typeof feedback === 'string') {
					feedback = this.feedbackOrDirections(feedback, 'Feedback')
				}
			}
			let score = 0;
			let concepts = currAttempt.map((concept)=>{
				concept.correct ? score += 1 : null;
				return [<ConceptResultTableRow concept={concept} key={concept.id + attemptNum} />]
			});
			let averageScore = (score/currAttempt.length * 100) || 0;
			let scoreRow = this.scoreRow(conceptsByAttempt[attemptNum][0].answer, attemptNum, averageScore)
			feedback ? results.push(scoreRow, feedback, concepts) : results.push(scoreRow, concepts)
			if (conceptsByAttempt[attemptNum + 1]) {
				results.push(this.emptyRow(attemptNum + averageScore))
			}
			attemptNum += 1;
		}

		return results;
	},

    emptyRow: function(key){
		return (<tr key={'empty-row'+key}>
  <td />
  <td />
  <td />
						</tr>)
	},

    scoreRow: function(answer, attemptNum, averageScore) {
		return (
  <tr className={ScoreColor(averageScore)} key={attemptNum + answer}>
    <td>{`${NumberSuffix(attemptNum)} Submission`}</td>
    <td />
    <td><span style={{ whiteSpace: 'pre-wrap' }}>{answer}</span></td>
  </tr>
		)
	},

    questionScore: function() {
		// occassionally there is no questionScore
		// don't just do ...questionData && ...questionData.questionScore because
		// if it questionScore is zero it will evaluate to false
		if (typeof this.props.questionData.questionScore !== undefined) {
      let score
      if (this.props.questionData.questionScore) {
        score = this.props.questionData.questionScore * 100
      } else if (this.props.questionData.score) {
        score = this.props.questionData.score
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
	},

    render: function() {
		const data = this.props.questionData;
		return (
  <div className='individual-activity-report'>
    <div className="student-report-box">
      <div className='student-report-table-and-index'>
        <div className='question-index'>{this.props.boxNumber}</div>
        <table>
          <tbody>
            {this.feedbackOrDirections(data.directions, 'Directions')}
            <tr>
              <td>Prompt</td>
              <td />
              <td>{formatStringAndAddSpacesAfterPeriods(data.prompt)}</td>
            </tr>
            {this.questionScore()}
            {this.emptyRow()}
            {this.conceptsByAttempt()}
          </tbody>
        </table>
      </div>
    </div>
  </div>
		);
	},
});
