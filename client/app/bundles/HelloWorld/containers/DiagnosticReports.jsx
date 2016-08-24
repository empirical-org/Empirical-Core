import React from 'react'
import {Router, Route, Link, hashHistory} from 'react-router'
import Index from '../components/progress_reports/diagnostic_reports/index.jsx'
import Reports from '../components/progress_reports/diagnostic_reports/reports.jsx'
import createHashHistory from 'history/lib/createHashHistory'
const hashhistory = createHashHistory({queryKey: false})

export default React.createClass({

	render: function() {
		return (
			<Router history={hashhistory}>
				<Route path="/" component={Index}>
					<Route path=':classroomId/:report' component={Reports}/>
					{/*TODO: build a default route -- the ** below breaks the params*/}
					{/*<Route path='**' component={Reports}/>*/}
				</Route>
			</Router>
		);
	}
});
