import React from 'react'
import ScoreColor from '../../modules/score_color.js'

export default React.createClass({
	propTypes: {
		// questionData: React.PropTypes.obj.isRequired,
		// boxNumber: React.PropTypes.num.isRequired
	},

	header: function() {
		if (this.props.boxNumber === 1) {
			return (
				<tr className="student-report-headers">
					<td><div><span>Question</span></div></td>
					<td><div><span>Score</span></div></td>
					<td></td>
    		</tr>
			)
		}
	},

	concepts: function() {

		return this.props.questionData.concepts.map((concept) => (
			<tr key={concept.id}>
				<td>Concept</td>
				<td>{<img src={'/images/' + (concept.correct ? 'check' : 'x') + '.svg'}/>}
        </td>
        <td>{concept.name}</td>
			</tr>
		))
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
										{this.header()}
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
