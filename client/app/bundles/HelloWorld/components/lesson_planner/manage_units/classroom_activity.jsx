'use strict'

import React from 'react'
import moment from 'moment';

const styles = {
	row: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
}

export default React.createClass({

	getInitialState: function() {
		return {
			startDate: this.dueDate(),
			formattedDate: this.formattedDate(this.dueDate())
		}
	},

	dueDate: function() {
		if (this.props.data.due_date) {
			return moment(this.props.data.due_date);
		}
	},

	deleteClassroomActivity: function() {
		var x = confirm('Are you sure you want do delete this assignment?');
		if (x) {
			this.props.deleteClassroomActivity(this.props.data.id, this.props.data.unit_id);
		}
	},

	formattedDate: function(date) {
		if (date) {
			return date.year() + '-' + (date.month() + 1) + '-' + (date.date() + 1);
		}
	},

	formattedForHumanDate: function(date) {
		if (date) {
			return (date.month() + 1) + '-' + (date.date() + 1) + '-' + date.year();
		}
	},

	handleChange: function(date) {
		this.setState({startDate: date});
		// months and days are an array that start at index 0;
		var formattedDate = this.formattedDate(date)
		this.props.updateDueDate(this.props.data.id, formattedDate);
	},

  urlForReport: function(){
    const d = this.props.data;
    return `/teachers/progress_reports/diagnostic_reports#/u/${d.unit_id}/a/${d.activity_id}/c/${d.classroom_id}/students`
  },

	finalCell: function() {
		if (this.props.report) {
			return [<a href={this.props.data.activity.anonymous_path} target="_blank">Preview Activity</a>, <a href={this.urlForReport()}>View Report</a>]
		} else {
      return this.formattedForHumanDate(this.state.startDate) || 'None'
		}
	},

  deleteRow:function(){
    if (!this.props.report) {
      return <div className="pull-right icon-x-gray" onClick={this.deleteClassroomActivity}><i className="fa fa-trash" aria-hidden="true"></i></div>
    }
  },

	render: function() {
		let url = this.urlForReport();
		return (
			<div className='row' style={styles.row}>
				<div className='cell col-md-1'>
					<div className={'pull-left icon-gray icon-wrapper ' + this.props.data.activity.classification.scorebook_icon_class}/>
				</div>
				<div className='cell col-md-8'>
					<a href={url} target='_new'>
						{this.props.data.activity.name}
					</a>
				</div>
				<div className='cell col-md-3'>
					<div style={styles.row}>
						{this.finalCell()}
						{this.deleteRow()}
					</div>
				</div>
			</div>

		);

	}
});
