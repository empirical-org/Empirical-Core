'use strict'

import React from 'react'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
require('../../../../../assets/styles/app-variables.scss')


export default React.createClass({

	getInitialState: function() {
		return { diagnosticActivityIds: [] };
	},

	propTypes: {
		clickCallback: React.PropTypes.func.isRequired
	},

	buttonBuilder: function (name) {
		return () => {
			this.props.clickCallback(name.toLowerCase())
		}
	},

	componentDidMount: function() {
    $.ajax({
      url: '/teachers/progress_reports/diagnostic_activity_ids',
     	success: (data) => {
     		this.setState({ diagnosticActivityIds: data.diagnosticActivityIds })
     	},
    });
	},

	isNotDiagnostic: function() {
		return this.state.diagnosticActivityIds
			.indexOf(Number(this.props.params.activityId)) === -1;
	},

	buttons: function() {
		const contents = [
			{name: 'Students', words: ['student_report', 'students'], exceptions: []},
			{name: 'Questions', words:['questions']},
			{name: 'Recommendations', words: ['recommendations']}
		];
		let hash = window.location.hash
		let that = this;
		return contents.map((navButton)=>	{
			let activeState;
			// If there is a <student_></student_>id, then the student button will visible/highlighted
			// If there is not a student_id, then we can determine our view from the block below
			if (!that.props.params.studentId) {
				let words = navButton.words;
				// if the url has button in it, we mark it as active
				for (var i = 0; i < words.length; i++) {
					if (hash.includes(words[i])) {
						activeState = 'active-true'
						break;
					}
				}
			}
			let name = navButton.name
			if (name === 'Recommendations' && this.isNotDiagnostic()) {
				// don't show recommendations unless it is a diagnostic
				return
			} else {
				return <button key={name} type="button" onClick={this.buttonBuilder(name)} className={`btn btn-secondary ${activeState}`}>{name}</button>
			}
		})
	},

	render: function() {
		return (
			<div id='report-button-group' className="btn-group" role="group" aria-label="Basic example">
				{this.buttons()}
			</div>
		);
	}
});
