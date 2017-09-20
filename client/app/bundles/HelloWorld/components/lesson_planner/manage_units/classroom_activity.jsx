'use strict'

import React from 'react'
import moment from 'moment';
import DatePicker from 'react-datepicker'
import request from 'request'
import $ from 'jquery'

import PreviewOrLaunchModal from '../../shared/preview_or_launch_modal'

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
	},
	reportEndRow: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '150px',
		marginRight: '15px'
	}
}

export default React.createClass({

	getInitialState: function() {
		return {
			startDate: this.props.data.due_date ? moment(this.props.data.due_date) : undefined,
			showModal: false
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

	supportingInfo: function() {
		if (this.props.data.activity.supporting_info && window.location.pathname.includes('lessons')) {
			return <a className="recommendations-button" target="_blank" href={`/activities/${this.props.data.activity_id}/supporting_info`}>Download Lesson Plan</a>
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
			const classroomActivityId = this.props.data.id
			const lessonId = this.props.data.activity.uid
			const text = this.props.data.started ? 'Resume Lesson' : 'Launch Lesson'
			return <a href={`${process.env.DEFAULT_URL}/teachers/classroom_activities/${classroomActivityId}/launch_lesson/${lessonId}`} className="q-button bg-quillgreen" id="launch-lesson">{text}</a>
		}
	},

  deleteRow: function() {
    if (!this.props.report && !this.props.lesson) {
      return <div className="pull-right"><img className='delete-classroom-activity h-pointer' onClick={this.hideClassroomActivity} src="/images/x.svg"/></div>
    }
  },

	openModal: function() {
		this.setState({showModal: true})
	},

	closeModal: function() {
		this.setState({showModal: false})
	},

	renderModal: function() {
		if (this.state.showModal) {
			return <PreviewOrLaunchModal
				lessonUID={this.props.data.activity.uid}
				classroomActivityID={this.props.data.id}
				closeModal={this.closeModal}
				completed={this.props.data.completed}
			/>
		}
	},

	render: function() {
		let link, endRow
		if (this.props.report) {
			link = <a href={this.urlForReport()} target='_new'>{this.props.data.activity.name}</a>
			endRow = styles.reportEndRow
		} else if (this.props.lesson) {
			link = <span onClick={this.openModal}>{this.props.data.activity.name}</span>
			endRow = styles.lessonEndRow
		} else {
			link = <a href={this.props.data.activity.anonymous_path} target='_new'>{this.props.data.activity.name}</a>
			endRow = styles.endRow

		}
		return (
			<div className='row' style={styles.row}>
				{this.renderModal()}
				<div className='starting-row'>
					<div className='cell'>
						<div className={'pull-left icon-wrapper ' + this.props.data.activity.classification.green_image_class}></div>
					</div>
					<div className='cell' id='activity-analysis-activity-name'>
						{link}
						{this.supportingInfo()}
						{this.buttonForRecommendations()}
					</div>
				</div>
				<div className='cell' style={endRow}>
						{this.finalCell()}
						{this.deleteRow()}
				</div>
			</div>
		);

	}
});
