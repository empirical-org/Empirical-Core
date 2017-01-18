import React from 'react'
import ScoreColor from '../../modules/score_color.js'
import ConceptResultTableRow from './concept_result_table_row.jsx'
import StudentReportHeader from './student_report_header.jsx'
	import NumberSuffix from '../../modules/numberSuffixBuilder.js'

export default React.createClass({

	groupByAttempt: function(){
		return _.groupBy(this.props.questionData.concepts,
			(conc)=>conc.attempt
		);
	},

	conceptsByAttempt: function() {
		const conceptsByAttempt = this.groupByAttempt();
		let attemptNum = 1;
		let results = [];
		while (conceptsByAttempt[attemptNum]) {
			let currAttempt = conceptsByAttempt[attemptNum]
			let score = 0;
			let concepts = currAttempt.map((concept)=>{
				concept.correct ? score++ : null;
				return [<ConceptResultTableRow key={concept.id} concept={concept}/>]
			});
			let averageScore = (score/currAttempt.length * 100) || 0;
			let scoreRow = this.scoreRow(currAttempt[0].answer, attemptNum, averageScore)
			results.push(scoreRow, concepts)
			if (conceptsByAttempt[attemptNum + 1]) {
				results.push(<tr/>)
			}
			attemptNum ++;
		}
		return results;
	},

	scoreRow: function(answer, attemptNum, averageScore) {
		return (
			<tr className={ScoreColor(averageScore)}>
				<td>{`${NumberSuffix(attemptNum)} Response`}</td>
				<td></td>
				<td>{answer}</td>
			</tr>
		)
	},

	render: function() {
		const data = this.props.questionData;
		const header = this.props.boxNumber === 1 ? <StudentReportHeader boxNumber={this.props.boxNumber}/> : null;
		return (
			<div className='individual-activity-report'>
				<div className="student-report-box">
					<div className='student-report-table-and-index'>
							<div className='question-index'>{this.props.boxNumber}</div>
								<table>
									<tbody>
										{header}
										<tr className='directions'>
											<td>Directions</td>
											<td></td>
											<td><span>{data.directions}</span></td>
										</tr>
										<tr>
											<td>Prompt</td>
											<td></td>
											<td>{data.prompt}</td>
										</tr>
										<tr/>
										{this.conceptsByAttempt()}
	        				</tbody>
								</table>
				</div>
				</div>
			</div>
		);
	}

})
