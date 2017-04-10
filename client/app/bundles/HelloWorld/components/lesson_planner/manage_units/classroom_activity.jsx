'use strict'

import React from 'react'
import moment from 'moment';
import DatePicker from 'react-datepicker'

const styles = {
	row: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	endRow: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		maxWidth: '220px'
	}
}

export default React.createClass({

	getInitialState: function() {
		return {
			startDate: this.props.data.due_date ? moment(this.props.data.due_date) : undefined,
		}
	},

	hideClassroomActivity: function() {
		var x = confirm('Are you sure you want to delete this assignment?');
		if (x) {
			this.props.hideClassroomActivity(this.props.data.id, this.props.data.unit_id);
		}
	},

	handleChange: function(date) {
		this.setState({startDate: date});
		this.props.updateDueDate(this.props.data.id, date.format());
	},

	goToRecommendations: function() {
		const activityId = this.props.data.activity_id
		const unitId = this.props.data.unit_id
		const classroomId = this.props.data.classroom_id
		const link = `/teachers/progress_reports/diagnostic_reports#/u/${unitId}/a/${activityId}/c/${classroomId}/recommendations`
		window.location = link
	},

	buttonForRecommendations: function() {
		if (this.props.data.activity_id === 413 && window.location.pathname.includes('diagnostic_reports')) {
			return (
				<div onClick={this.goToRecommendations} className="recommendations-button">
					Recommendations
				</div>
			)
		}
	},

  urlForReport: function(){
    const d = this.props.data;
    return `/teachers/progress_reports/diagnostic_reports#/u/${d.unit_id}/a/${d.activity_id}/c/${d.classroom_id}/students`
  },

	finalCell: function() {
		const startDate = this.state.startDate;
		if (this.props.report) {
			return [<a key='this.props.data.activity.anonymous_path' href={this.props.data.activity.anonymous_path} target="_blank">Preview Activity</a>, <a key={this.urlForReport()} href={this.urlForReport()}>View Report</a>]
		} else {
			return <DatePicker className="due-date-input" onChange={this.handleChange} selected={startDate} placeholderText={startDate ? startDate.format('l') : 'Optional'}/>
		}
	},

  deleteRow:function(){
    if (!this.props.report) {
      return <div className="pull-right"><img className='delete-classroom-activity h-pointer' onClick={this.hideClassroomActivity} src="/images/x.svg"/></div>
    }
  },

	render: function() {
		let url = this.props.report ? this.urlForReport() : this.props.data.activity.anonymous_path;
		return (
			<div className='row' style={styles.row}>
				<div className='starting-row'>
					<div className='cell col-md-1'>
						<div className={'pull-left icon-gray icon-wrapper ' + this.props.data.activity.classification.scorebook_icon_class}></div>
					</div>
					<div className='cell col-md-8' id='activity-analysis-activity-name'>
						<a href={url} target='_new'>
							{this.props.data.activity.name}
						</a>
						{this.buttonForRecommendations()}
					</div>
				</div>
				<div className='cell col-md-3' style={styles.endRow}>
						{this.finalCell()}
						{this.deleteRow()}
				</div>
			</div>
		);

	}
});
