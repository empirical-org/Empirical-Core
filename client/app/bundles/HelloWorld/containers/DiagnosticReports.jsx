import React from 'react'
import {Router, Route, Link, hashHistory} from 'react-router'
import App from '../components/progress_reports/diagnostic_reports/index.jsx'
import Reports from '../components/progress_reports/diagnostic_reports/reports.jsx'
import createHashHistory from 'history/lib/createHashHistory'
const hashhistory = createHashHistory({queryKey: false})

export default React.createClass({

	render: function() {
		return (
			<Router history={hashHistory}>
				<Route path="/" component={App}>
					<Route path=':classromId/:report' component={Reports}/>
					<Route path='**' component={Reports}/>
				</Route>
			</Router>
		);
	}
});
