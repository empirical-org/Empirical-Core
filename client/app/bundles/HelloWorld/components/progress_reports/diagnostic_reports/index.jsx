'use strict'

import React from 'react'
import {Router, Route, Link, hashHistory, withRouter} from 'react-router'
import NavBar from './nav_bar.jsx'
import $ from 'jquery'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
require('../../../../../assets/styles/app-variables.scss')

const DiagnosticReports = React.createClass({

	getInitialState: function() {
		return ({
			loading: true,
			classrooms: null,
			selectedStudent: null,
			selectedActivity: {}});
	},

	componentDidMount: function() {
		// /activity_packs, /not_completed, and /diagnostics are the only report that doesn't require the classroom, unit, etc...
		if (['/activity_packs', '/not_completed', '/diagnostics'].indexOf(this.props.location.pathname) === -1) {
			this.getStudentAndActivityData();
		}
		if (this.props.params.studentId) {
			this.setStudentId(this.props.params.studentId);
		}
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.params && nextProps.params.studentId) {
			this.setStudentId(nextProps.params.studentId);
		}
		if (['/activity_packs', '/not_completed', '/diagnostics'].indexOf(this.props.location.pathname) === -1) {
			this.getStudentAndActivityData(nextProps.params);
		}
	},

	componentWillUnmount: function() {
		let ajax = this.ajax;
		for (var call in ajax) {
			if (ajax.hasOwnProperty(call)) {
				call.abort();
			}
		}
	},

	setStudentId: function(studentId){
		this.setState({selectedStudentId: Number(studentId)});
	},

	getStudentAndActivityData: function(params) {
		this.getClassroomsWithStudents(params);
		this.getActivityData(params);
	},


	getClassroomsWithStudents: function(params) {
		this.ajax = {};
		let ajax = this.ajax;
		let that = this;
		const p = params || this.props.params;
		ajax.getClassroomsWithStudents = $.get(`/teachers/progress_reports/classrooms_with_students/u/${p.unitId}/a/${p.activityId}/c/${p.classroomId}`, function(data) {
			that.setState({
				classrooms: data,
				loading: false
			});
		});
	},

	getActivityData: function (params) {
		let that = this;
		const p = params || this.props.params;
		this.ajax.getActivityData = $.get(`/api/v1/activities/${p.activityId}.json`, function(data) {
			that.setState({
				selectedActivity: data['activity']
			});
		});
	},

	changeStudent: function(student) {
		this.setState({selectedStudentId: student})
		const p = this.props.params;
		this.props.router.push(`u/${p.unitId}/a/${p.activityId}/c/${p.classroomId}/student_report/${student}`)
	},

	findClassroomById: function(id) {
		return this.props.classrooms
			? this.props.classrooms.find((c) => c.id === id)
			: null
	},



	changeClassroom: function(classroom) {
			this.setState({
				selectedStudentId: null,
				students: classroom.students
			});
			const p = this.props.params;
			let report;
			if (this.props.location.pathname.includes('student_report')) {
				report = 'student_report';
			}
			else {
				let reportBeginningIndex = window.location.hash.lastIndexOf('/');
				// get report name without hash history junk
				report = window.location.hash.substring(reportBeginningIndex + 1).split('?').shift()
			}
			this.props.router.push(`u/${p.unitId}/a/${p.activityId}/c/${classroom.id}/${report}`)
	},

	changeReport: function(reportName) {
		const p = this.props.params;
		this.props.router.push(`u/${p.unitId}/a/${p.activityId}/c/${p.classroomId || 'classroom'}/${reportName}`)
	},

	showStudentDropdown: function(){
		const currPath = this.props.location.pathname;
		// we only want to show the student dropdown if the route includes student report
		return currPath.includes('student_report')
	},

	render: function() {
		// we don't want to render a navbar for the activity packs, not_completed, or diagnostics
		if (['/activity_packs', '/not_completed', '/diagnostics'].indexOf(this.props.location.pathname) !== -1) {
			return (
				<div>{this.props.children}</div>
			)
		} else if (this.state.loading) {
			return <LoadingSpinner/>
		} else {
			return (
				<div className='individual-activity-reports'>
					<NavBar
						key={'key'}
						classrooms={this.state.classrooms}
						selectedStudentId={this.props.params.studentId}
						studentDropdownCallback={this.changeStudent}
						dropdownCallback={this.changeClassroom}
						buttonGroupCallback={this.changeReport}
						selectedActivity={this.state.selectedActivity}
						showStudentDropdown={this.showStudentDropdown()}
						students={this.state.students}
						params={this.props.params}
					/>
					{this.props.children}
				</div>
			);
		}
	}

});

export default withRouter(DiagnosticReports)
