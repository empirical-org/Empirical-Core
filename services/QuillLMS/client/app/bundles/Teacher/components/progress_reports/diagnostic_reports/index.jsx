import $ from 'jquery'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import ClassReport from './class_report.jsx'
import NavBar from './nav_bar.jsx'
import QuestionReport from './question_report.jsx'
import StudentReport from './student_report.tsx'

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
    const params = this.parseParams(this.props.location.pathname);
    // /activity_packs, /not_completed, and /diagnostics are the only report that doesn't require the classroom, unit, etc...
    if (!this.onPageThatHandlesItsOwnRendering()) {
      this.getStudentAndActivityData();
    }
    if (params.studentId) {
      this.setStudentId(params.studentId);
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    const nextParams = this.parseParams(nextProps.location.pathname)
    if (nextParams && nextParams.studentId) {
      this.setStudentId(nextParams.studentId);
    }
    if (!this.onPageThatHandlesItsOwnRendering()) {
      this.getStudentAndActivityData(nextParams);
    }
  };

  onPageThatHandlesItsOwnRendering = () => {
    const { location, } = this.props
    return ['/activity_packs', '/not_completed', '/diagnostics'].indexOf(location.pathname) !== -1 || location.pathname.includes('/diagnostics')
  }

  parseParams = (pathname) => {
    const activityIdChunk = (pathname.match(/\/a\/[^\/]*/) || [])[0]
    const activityId = activityIdChunk ? activityIdChunk.replace('/a/', '') : null
    const unitIdChunk = (pathname.match(/\/u\/[^\/]*/) || [])[0]
    const unitId = unitIdChunk ? unitIdChunk.replace('/u/', '') : null
    const classroomIdChunk = (pathname.match(/\/c\/[^\/]*/) || [])[0]
    const classroomId = classroomIdChunk ? classroomIdChunk.replace('/c/', '') : null
    const studentIdChunk = (pathname.match(/\/student_report\/[^\/]*/) || [])[0]
    const studentId = studentIdChunk ? studentIdChunk.replace('/student_report/', '') : null
    return { activityId, unitId, classroomId, studentId, }
  }

  getActivityData = (params) => {
    const p = params || this.parseParams(this.props.location.pathname);
    const that = this
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
    const that = this
    const p = params || this.parseParams(this.props.location.pathname);
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
    const p = this.parseParams(this.props.location.pathname);
    let report;
    if (this.props.location.pathname.includes('student_report')) {
      report = 'student_report';
    }
    else {
      let reportBeginningIndex = window.location.hash.lastIndexOf('/');
      // get report name without hash history junk
      report = window.location.hash.substring(reportBeginningIndex + 1).split('?').shift()
    }
    this.props.history.push(`/u/${p.unitId}/a/${p.activityId}/c/${classroom.id}/${report}`)
  };

  changeReport = (reportName) => {
    const p = this.parseParams(this.props.location.pathname);
    this.props.history.push(`/u/${p.unitId}/a/${p.activityId}/c/${p.classroomId || 'classroom'}/${reportName}`)
  };

  changeStudent = (student) => {
    const { history } = this.props
    const { value } = student
    this.setState({selectedStudentId: value })
    const p = this.parseParams(this.props.location.pathname);
    const { activityId, classroomId, unitId } = p
    history.push(`/u/${unitId}/a/${activityId}/c/${classroomId}/student_report/${value}`)
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
    const params = this.parseParams(this.props.location.pathname);
    // we don't want to render a navbar for the activity packs, not_completed, or diagnostics
    if (this.onPageThatHandlesItsOwnRendering()) {
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
            key="key"
            params={params}
            selectedActivity={this.state.selectedActivity}
            selectedStudentId={params.studentId}
            students={this.state.students}
          />
          {this.props.children}
          <Switch>
            <Route component={routerProps => <StudentReport params={params} studentDropdownCallback={this.changeStudent} {...routerProps} />} path='/u/:unitId/a/:activityId/c/:classroomId/student_report/:studentId' />
            <Route component={routerProps => <QuestionReport params={params} {...routerProps} />} path='/u/:unitId/a/:activityId/c/:classroomId/questions' />
            <Route component={routerProps => <ClassReport params={params} {...routerProps} />} path='/u/:unitId/a/:activityId/c/:classroomId/students' />
          </Switch>
        </div>
      );
    }
  }
}

export default DiagnosticReports
