'use strict'

import React from 'react'
import {Router, Route, Link, hashHistory} from 'react-router'
import NavBar from './nav_bar.jsx'
import $ from 'jquery'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
require('../../../../../assets/styles/app-variables.scss')

export default React.createClass({

	getInitialState: function() {
		return ({loading: true, classrooms: null, selectedClassroom: null, selectedStudent: null})
	},

	componentDidMount: function() {
		// /activity_packs is the only report that doesn't require the classroom, unit, etc...
		if (this.props.location.pathname != '/activity_packs') {
			this.getClassroomsWithStudents();
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

	getClassroomsWithStudents: function() {
		this.ajax = {};
		let ajax = this.ajax;
		let that = this;
		const p = this.props.params;
		ajax.classrooms = $.get(`/teachers/progress_reports/classrooms_with_students/u/${p.unitId}/a/${p.activityId}/c/${p.classroomId}`, function(data) {
			that.setState({
				classrooms: data,
				loading: false
			});
		});
	},


	changeStudent: function(student) {
		this.setState({selectedStudentId: student})
		const p = this.props.params;
		this.props.history.push(`u/${p.unitId}/a/${p.activityId}/c/${p.classroomId}/student_report/${student}`)
	},

	findClassroomById: function(id) {
		return this.props.classrooms
			? this.props.classrooms.find((c) => c.id === id)
			: null
	},

	changeClassroom: function(classroom) {
		if (classroom != this.state.selectedClassroom) {
			// we changed classrooms, so we want to invalidate the current selected student
			this.setState({
				selectedClassroom: classroom,
				selectedStudentId: null
			})
			const p = this.props.params;
			this.props.history.push(`u/${p.unitId}/a/${p.activityId}/c/${classroom.id}/report`)
		}
	},

	changeReport: function(reportName) {
		const p = this.props.params;
		this.props.history.push(`u/${p.unitId}/a/${p.activityId}/c/${p.classroomId || 'classroom'}/${reportName}`)
	},

	showStudentDropdown: function(){
		const currPath = this.props.location.pathname;
		// we only want to show the student dropdown if the route includes student report but
		// doesn't end with it. This would be better off as a proper regex, but out of time...
		return currPath.includes('student_report') && !currPath.endsWith('student_report')
	},

	render: function() {
		// we don't want to render a navbar for the activity packs report
		if (this.props.location.pathname === '/activity_packs') {
			return (
				<div>{this.props.children}</div>
			)
		} else if (this.state.loading) {
			return <LoadingSpinner/>
		} else {
			return (
				<div className='individual-activity-reports'>
					<NavBar key={'key'} classrooms={this.state.classrooms} selectedStudentId={this.state.selectedStudentId} studentDropdownCallback={this.changeStudent} dropdownCallback={this.changeClassroom} buttonGroupCallback={this.changeReport} selectedClassroom={this.state.selectedClassroom} showStudentDropdown={this.showStudentDropdown()}/>
					{this.props.children}
				</div>
			);
		}
	}

});
