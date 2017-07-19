'use strict'

import React from 'react'
import moment from 'moment';
import DatePicker from 'react-datepicker'
import request from 'request'
import $ from 'jquery'

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
	},
	lessonEndRow: {
		display: 'flex',
		justifyContent: 'flex-end',
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
		const diagnosticIds = [413, 447]
		if (diagnosticIds.includes(this.props.data.activity_id) && window.location.pathname.includes('diagnostic_reports')) {
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
			return [<a key='this.props.data.activity.anonymous_path' href={this.props.data.activity.anonymous_path} target="_blank">Preview</a>, <a key={this.urlForReport()} href={this.urlForReport()}>View Report</a>]
		} else if (this.props.lesson) {
			return this.lessonCompletedOrLaunch()
		} else {
			return <DatePicker className="due-date-input" onChange={this.handleChange} selected={startDate} placeholderText={startDate ? startDate.format('l') : 'Optional'}/>
		}
	},

	lessonCompletedOrLaunch: function() {
		if (this.props.data.completed) {
			return <p className="lesson-completed">Lesson Completed</p>
		} else {
			return <div onClick={this.launchLesson} className="launch-lesson">Launch Lesson</div>
		}
	},

	launchLesson: function() {
		const classroomActivityId = this.props.data.id
		const lessonId = this.props.data.activity.uid
		request.put({
			url: `${process.env.DEFAULT_URL}/teachers/classroom_activities/${classroomActivityId}/unlock_lesson`,
			json: {authenticity_token: $('meta[name=csrf-token]').attr('content')}
		}, (error, httpStatus, body) => {
			if (body.unlocked) {
				window.location = `http://connect.quill.org/#/teach/class-lessons/${lessonId}?&classroom_activity_id=${classroomActivityId}`
			}
		})
	},

  deleteRow: function() {
    if (!this.props.report && !this.props.lesson) {
      return <div className="pull-right"><img className='delete-classroom-activity h-pointer' onClick={this.hideClassroomActivity} src="/images/x.svg"/></div>
    }
  },

	render: function() {
		let url
		if (this.props.report) {
			url =  this.urlForReport()
		} else if (this.props.lesson) {
			url = `http://connect.quill.org/#/teach/class-lessons/${this.props.data.activity.uid}?&classroom_activity_id=${this.props.data.id}`
		} else {
			url = this.props.data.activity.anonymous_path;
		}
		return (
			<div className='row' style={styles.row}>
				<div className='starting-row'>
					<div className='cell col-md-1'>
						<div className={'pull-left icon-wrapper ' + this.props.data.activity.classification.image_class}></div>
					</div>
					<div className='cell col-md-8' id='activity-analysis-activity-name'>
						<a href={url} target='_new'>
							{this.props.data.activity.name}
						</a>
						{this.buttonForRecommendations()}
					</div>
				</div>
				<div className='cell col-md-3' style={this.props.lesson ? styles.lessonEndRow : styles.endRow}>
						{this.finalCell()}
						{this.deleteRow()}
				</div>
			</div>
		);

	}
});
