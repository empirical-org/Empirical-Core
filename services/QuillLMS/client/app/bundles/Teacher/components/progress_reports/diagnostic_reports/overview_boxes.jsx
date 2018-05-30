import React from 'react'
import ScoreColor from '../../modules/score_color.js'
import Pluralize from 'pluralize'

export default React.createClass({

	propTypes: {
		data: React.PropTypes.array.isRequired
	},

	componentDidMount: function() {
		this.countBoxType();
	},

	countBoxType: function() {
		let count = {};
		let scoreColor;
		this.props.data.forEach(student => {
			scoreColor = ScoreColor(student.score);
			count[scoreColor] = count[scoreColor] || 0;
			count[scoreColor] += 1;
		})
		return count;
	},

	boxCreator: function(group, count) {
		let range,
			proficiency
		if (group === 'red-score-color') {
			range = '0 - 59%';
			proficiency = 'Not Yet Proficient'
		} else if (group === 'yellow-score-color') {
			range = '60 - 79%';
			proficiency = 'Nearly Proficient'
		} else {
			range = '80 - 100%';
			proficiency = 'Proficient'
		}
		return (
			<div className={'student-groupings ' + group} key={group}>
				<h3>{(count || 0) + ' ' + Pluralize('Student', count)}</h3>
				<span>{range + '  |  ' + proficiency}</span>
			</div>
		)
	},

	groupingBoxes: function() {
		// need to list the keys in an array instead of just using a for in
		// loop as we want them in this particular order
		let groupCounts = this.countBoxType();
		let groups = ['red', 'yellow', 'green'];
		return groups.map(group => {
			group += '-score-color'
			return this.boxCreator(group, groupCounts[group])
		})
	},

	render: function() {
		return <div id='student-groupings-wrapper'>{this.groupingBoxes()}</div>
	}

});
