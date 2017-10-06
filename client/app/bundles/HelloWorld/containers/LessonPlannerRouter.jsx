import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router'
import LessonPlanner from './LessonPlanner.jsx'
import LessonPlannerContainer from './LessonPlannerContainer.jsx'
import ClassroomsWithStudentsContainer from './ClassroomsWithStudentsContainer.jsx'
import EditUnitActivitiesContainer from './EditUnitActivitiesContainer.jsx'
import EmptyAssignedUnits from '../components/lesson_planner/manage_units/EmptyAssignedUnits.jsx'
import UnitTemplateAssigned from '../components/lesson_planner/unit_template_assigned'
import UnitTemplatesManager from '../components/lesson_planner/unit_templates_manager/unit_templates_manager'
import UnitTemplateProfile from '../components/lesson_planner/unit_templates_manager/unit_template_profile/unit_template_profile'
import ClassroomLessonsPlanner from '../components/lesson_planner/classroom_lessons'
import ChooseClassroomLesson from '../components/lesson_planner/choose_classroom_lesson'

export default class LessonPlannerRouter extends React.Component{
	constructor(props) {
		super(props)

		this.redirectToAssignActivities()
	}

	redirectToAssignActivities() {
		const locationArray = window.location.href.split('/activity_planner/')
		const pathEnd = locationArray[1] === 'assign-new-activity' ? '' : locationArray[1]
		if (
			!(pathEnd === undefined ||
			pathEnd === 'no_units' ||
			pathEnd.slice(0, 7) === 'lessons' ||
			pathEnd.slice(0, 5) === 'units' ||
			pathEnd.slice(0, 8) === 'new_unit')
		) {
			window.location = locationArray[0] + '/assign_activities/' + pathEnd
		}
	}

	render() {
		return (
			<Router Router history={browserHistory}>
        <Route path="/teachers/classrooms/activity_planner" component={LessonPlannerContainer}>
					<IndexRoute component={LessonPlanner}/>
					<Route path="lessons" component={ClassroomLessonsPlanner}/>
					<Route path="lessons/:classroomId" component={ClassroomLessonsPlanner}/>
					<Route path="/teachers/classrooms/activity_planner/lessons_for_activity/:activityId" component={ChooseClassroomLesson}/>
					<Route path="new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray" component={ClassroomsWithStudentsContainer}/>
					<Route path="units/:unitId/students/edit" component={ClassroomsWithStudentsContainer}/>
					<Route path="units/:unitId/activities/edit(/:unitName)" component={EditUnitActivitiesContainer}/>
					<Route path="no_units" component={EmptyAssignedUnits}/>
        </Route>
			</Router>
		);
	}
};
