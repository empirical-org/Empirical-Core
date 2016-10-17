import React from 'react'
import ScoreColor from '../../modules/score_color.js'
import ConceptResultTableRow from './concept_result_table_row.jsx'
import StudentReportHeader from './student_report_header.jsx'

export default React.createClass({

	header: function() {
		if (this.props.boxNumber === 1) {
			return (
				<tr className="student-report-headers">
					<td><div><span>Question</span></div></td>
					<td><div><span>Score</span></div></td>
					<td></td>
    		</tr>
			);
		}
	},

	concepts: function() {
		return this.props.questionData.concepts.map((concept) => (
			<ConceptResultTableRow concept={concept}/>
		));
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
										<tr className={ScoreColor(data.score)}>
											<td>Response</td>
											<td></td>
											<td>{data.answer}</td>
										</tr>
										{this.concepts()}
	        				</tbody>
								</table>
				</div>
				</div>
			</div>
		);
	}

})
