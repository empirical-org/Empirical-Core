import React from 'react'

export default class StudentReportHeader extends React.Component {

	render() {
			return (
				<tr className="student-report-headers">
					<td>
						<div>
							<span>Question</span>
						</div>
					</td>
					<td>
						<div>
							<span>Score</span>
						</div>
					</td>
					<td></td>
				</tr>
			);
	}

}
