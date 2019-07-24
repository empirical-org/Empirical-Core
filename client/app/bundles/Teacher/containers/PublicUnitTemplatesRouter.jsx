import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import LessonPlannerContainer from './LessonPlannerContainer'
import UnitTemplatesManager from '../components/lesson_planner/unit_templates_manager/unit_templates_manager'
import UnitTemplateProfile from '../components/lesson_planner/unit_templates_manager/unit_template_profile/unit_template_profile'

export default React.createClass({
	render: function() {
		return (
			<Router Router history={browserHistory}>
        <Route path="/activities/packs" component={LessonPlannerContainer}>
					<IndexRoute component={UnitTemplatesManager}/>
					<Route path="category/:category" component={UnitTemplatesManager}/>
					<Route path="grade/:grade" component={UnitTemplatesManager}/>
					<Route path=":activityPackId" component={UnitTemplateProfile}/>
        </Route>
			</Router>
		);
	}
});
