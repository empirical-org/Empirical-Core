import React from 'react'
import {Router, Route, Link, hashHistory} from 'react-router'
import Index from '../components/progress_reports/diagnostic_reports/index.jsx'
import createHashHistory from 'history/lib/createHashHistory'
import StudentReport from '../components/progress_reports/diagnostic_reports/student_report.jsx'
import ClassReport from '../components/progress_reports/diagnostic_reports/class_report.jsx'
import QuestionReport from '../components/progress_reports/diagnostic_reports/question_report.jsx'
import Recommendations from '../components/progress_reports/diagnostic_reports/recommendations.jsx'
const hashhistory = createHashHistory({queryKey: false})

export default React.createClass({

	render: function() {
		return (
			<Router history={hashhistory}>
				<Route path="/" component={Index}>
					<Route path=':classroomId/student_report' component={StudentReport}/>
					<Route path=':classroomId/student_report/:studentId' component={StudentReport}/>
					<Route path=':classroomId/class_report' component={ClassReport}/>
					<Route path=':classroomId/question_report' component={QuestionReport}/>
					<Route path=':classroomId/recommendations' component={Recommendations}/>
				</Route>
			</Router>
		);
	}
});
