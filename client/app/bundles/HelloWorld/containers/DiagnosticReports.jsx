import React from 'react'
import {Router, Route, Link, hashHistory } from 'react-router'
import Index from '../components/progress_reports/diagnostic_reports/index.jsx'
import StudentReport from '../components/progress_reports/diagnostic_reports/student_report.jsx'
import ClassReport from '../components/progress_reports/diagnostic_reports/class_report.jsx'
import QuestionReport from '../components/progress_reports/diagnostic_reports/question_report.jsx'
import Recommendations from '../components/progress_reports/diagnostic_reports/recommendations.jsx'
import ActivityPacks from '../components/progress_reports/diagnostic_reports/activity_packs.jsx'
import DiagnosticActivityPacks from '../components/progress_reports/diagnostic_reports/diagnostic_activity_packs.jsx'
import NotCompleted from '../components/progress_reports/diagnostic_reports/not_completed.jsx'

export default React.createClass({

	render: function() {
		return (
			<Router history={hashHistory}>
				<Route path="/" component={Index}>
					<Route path='u/:unitId/a/:activityId/c/:classroomId/student_report(/:studentId)' component={StudentReport}/>
					<Route path='u/:unitId/a/:activityId/c/:classroomId/recommendations' component={Recommendations}/>
					<Route path='u/:unitId/a/:activityId/c/:classroomId/questions' component={QuestionReport}/>
					<Route path='u/:unitId/a/:activityId/c/:classroomId/students' component={ClassReport}/>
					<Route path='activity_packs' component={ActivityPacks}/>
					<Route path='diagnostics' component={DiagnosticActivityPacks}/>
					<Route path='not_completed' component={NotCompleted}/>
				</Route>
			</Router>
		);
	}
});
