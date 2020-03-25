import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NavBar from './nav_bar.jsx'
import $ from 'jquery'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import StudentReport from './student_report.jsx'
import ClassReport from './class_report.jsx'
import QuestionReport from './question_report.jsx'
import Recommendations from './recommendations.jsx'
import ActivityPacks from './activity_packs.jsx'
import DiagnosticActivityPacks from './diagnostic_activity_packs.jsx'
import NotCompleted from './not_completed.jsx'

class DiagnosticReports extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      classrooms: null,
      selectedStudent: null,
      selectedActivity: {}
    };
  }

    componentDidMount() {
		// /activity_packs, /not_completed, and /diagnostics are the only report that doesn't require the classroom, unit, etc...
		if (['/activity_packs', '/not_completed', '/diagnostics'].indexOf(this.props.location.pathname) === -1) {
			this.getStudentAndActivityData();
		}
		if (this.props.match.params.studentId) {
			this.setStudentId(this.props.match.params.studentId);
		}
	}

    UNSAFE_componentWillReceiveProps = (nextProps) => {
		if (nextProps.params && nextProps.params.studentId) {
			this.setStudentId(nextProps.params.studentId);
		}
		if (['/activity_packs', '/not_completed', '/diagnostics'].indexOf(this.props.location.pathname) === -1) {
			this.getStudentAndActivityData(nextProps.params);
		}
	};

    componentWillUnmount() {
		let ajax = this.ajax;
		for (var call in ajax) {
			if (ajax.hasOwnProperty(call)) {
				call.abort();
			}
		}
	}

    getActivityData = (params) => {
		let that = this;
		const p = params || this.props.match.params;
		this.ajax.getActivityData = $.get(`/api/v1/activities/${p.activityId}.json`, function(data) {
      if (data) {
        that.setState({
          selectedActivity: data['activity']
        });
      }
		});
	};

    getClassroomsWithStudents = (params) => {
		this.ajax = {};
		let ajax = this.ajax;
		let that = this;
		const p = params || this.props.match.params;
		ajax.getClassroomsWithStudents = $.get(`/teachers/progress_reports/classrooms_with_students/u/${p.unitId}/a/${p.activityId}/c/${p.classroomId}`, function(data) {
			that.setState({
				classrooms: data,
				loading: false
			});
		});
	};

    getStudentAndActivityData = (params) => {
		this.getClassroomsWithStudents(params);
		this.getActivityData(params);
	};

    setStudentId = (studentId) => {
		this.setState({selectedStudentId: Number(studentId)});
	};

    changeClassroom = (classroom) => {
			this.setState({
				selectedStudentId: null,
				students: classroom.students
			});
			const p = this.props.match.params;
			let report;
			if (this.props.location.pathname.includes('student_report')) {
				report = 'student_report';
			}
			else {
				let reportBeginningIndex = window.location.hash.lastIndexOf('/');
				// get report name without hash history junk
				report = window.location.hash.substring(reportBeginningIndex + 1).split('?').shift()
			}
			this.props.history.push(`u/${p.unitId}/a/${p.activityId}/c/${classroom.id}/${report}`)
	};

    changeReport = (reportName) => {
		const p = this.props.match.params;
		this.props.history.push(`u/${p.unitId}/a/${p.activityId}/c/${p.classroomId || 'classroom'}/${reportName}`)
	};

    changeStudent = (student) => {
		this.setState({selectedStudentId: student})
		const p = this.props.match.params;
		this.props.history.push(`u/${p.unitId}/a/${p.activityId}/c/${p.classroomId}/student_report/${student}`)
	};

    findClassroomById = (id) => {
		return this.props.classrooms
			? this.props.classrooms.find((c) => c.id === id)
			: null
	};

    showStudentDropdown = () => {
		const currPath = this.props.location.pathname;
		// we only want to show the student dropdown if the route includes student report
		return currPath.includes('student_report')
	};

    render() {
		// we don't want to render a navbar for the activity packs, not_completed, or diagnostics
		if (['/activity_packs', '/not_completed', '/diagnostics'].indexOf(this.props.location.pathname) !== -1) {
			return (
  <div>{this.props.children}</div>
			)
		} else if (this.state.loading) {
			return <LoadingSpinner />
		} else {
			return (
  <div className='individual-activity-reports'>
    <NavBar
      buttonGroupCallback={this.changeReport}
      classrooms={this.state.classrooms}
      dropdownCallback={this.changeClassroom}
      key={'key'}
      match={this.props.match}
      selectedActivity={this.state.selectedActivity}
      selectedStudentId={this.props.match.params.studentId}
      showStudentDropdown={this.showStudentDropdown()}
      studentDropdownCallback={this.changeStudent}
      students={this.state.students}
    />
    {this.props.children}
    <Switch>
      <Route component={StudentReport} path='/u/:unitId/a/:activityId/c/:classroomId/student_report(/:studentId)' />
      <Route component={Recommendations} path='/u/:unitId/a/:activityId/c/:classroomId/recommendations' />
      <Route component={QuestionReport} path='/u/:unitId/a/:activityId/c/:classroomId/questions' />
      <Route component={ClassReport} path='/u/:unitId/a/:activityId/c/:classroomId/students' />
      <Route component={ActivityPacks} path='/activity_packs' />
      <Route component={DiagnosticActivityPacks} path='/diagnostics' />
      <Route component={NotCompleted} path='/not_completed' />
    </Switch>
  </div>
			);
		}
	}
}

export default DiagnosticReports
