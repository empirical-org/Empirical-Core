'use strict'

import React from 'react'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
require('../../../../../assets/styles/app-variables.scss')


export default React.createClass({
	propTypes: {
		clickCallback: React.PropTypes.func.isRequired
	},

	buttonBuilder: function (name) {
		return () => {
			this.props.clickCallback(name.toLowerCase())
		}
	},



	buttons: function() {
		const contents = [
			{name: 'Students', words: ['student_report', 'students']},
			{name: 'Questions', words:['questions']},
			{name: 'Recommendations', words: ['recommendations']}
		];
		let hash = window.location.hash
		let that = this;
		return contents.map((navButton)=>	{
			let activeState;
			let words = navButton.words;
			let name = navButton.name
			// if the url has button in it, we mark it as active
			for (var i = 0; i < words.length; i++) {
				if (hash.includes(words[i])) {
					activeState = 'active-true'
					break;
				}
			}
			let isNotDiagnostic = function(){
				return [413, 447].indexOf(Number(that.props.params.activityId)) === -1;
			}
			if (name === 'Recommendations' && isNotDiagnostic()) {
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
