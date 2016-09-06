import React from 'react'
import {Router, Route, Link, hashHistory} from 'react-router'
import Index from '../components/progress_reports/diagnostic_reports/index.jsx'
import createHashHistory from 'history/lib/createHashHistory'
import StudentReport from '../components/progress_reports/diagnostic_reports/student_report.jsx'
import ClassReport from '../components/progress_reports/diagnostic_reports/class_report.jsx'
import QuestionReport from '../components/progress_reports/diagnostic_reports/question_report.jsx'
import Recommendations from '../components/progress_reports/diagnostic_reports/recommendations.jsx'
import ActivityPacks from '../components/progress_reports/diagnostic_reports/activity_packs.jsx'
const hashhistory = createHashHistory({queryKey: false})

export default React.createClass({

	render: function() {
		return (
			<Router history={hashhistory}>
				<Route path="/" component={Index}>
					<Route path='activity_packs' component={ActivityPacks}/>
					<Route path='u/:unitId/a/:activityId/c/:classroomId/student_report' component={StudentReport}/>
					<Route path='u/:unitId/a/:activityId/c/:classroomId/student_report/:studentId' component={StudentReport}/>
					<Route path='u/:unitId/a/:activityId/c/:classroomId/students' component={ClassReport}/>
					<Route path='u/:unitId/a/:activityId/c/:classroomId/recommendations' component={Recommendations}/>
					<Route path='u/:unitId/a/:activityId/c/:classroomId/questions' component={QuestionReport}/>
				</Route>
			</Router>
		);
	}
});
