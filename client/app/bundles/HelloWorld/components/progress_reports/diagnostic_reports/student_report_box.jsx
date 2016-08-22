import React from 'react'

export default React.createClass({
	propTypes: {
		// questionData: React.PropTypes.obj.isRequired,
		// boxNumber: React.PropTypes.num.isRequired
	},

	header: function() {
		if (this.props.boxNumber === 1) {
			return (
				<tr>
					<th>Question</th>
					<th className='placeholder-th'></th>
					<th>Score</th>
				</tr>
			)
		}
	},

	concepts: function() {
		return this.props.questionData.concepts.map((concept) => (
			<tr key={concept.id}>
				<td>Concept</td>
				<td>{concept.correct
						? 'check'
						: 'X'}
        </td>
        <td>{concept.description}</td>
			</tr>
		))
	},

	render: function() {
		const data = this.props.questionData;
		return (
			<div id="student-report-box">
				<table>
					{this.header()}
					<tr>
						<td>{this.props.boxNumber}</td>
						<td>
							<table>
								<tr className='directions'>
									<td>Directions</td>
									<td></td>
									<td>{data.directions}</td>
								</tr>
								<tr>
									<td>Prompt</td>
									<td></td>
									<td>{data.prompt}</td>
								</tr>
								<tr>
									<td>Response</td>
									<td>{data.score}</td>
									<td>{data.answer}</td>
								</tr>
								{this.concepts()}
							</table>
						</td>
					</tr>
				</table>
			</div>
		);
	}

})
