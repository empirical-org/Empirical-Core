import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import LessonPlanner from './LessonPlanner.jsx'
import ClassroomsWithStudentsContainer from './ClassroomsWithStudentsContainer.jsx'
import EditUnitActivitiesContainer from './EditUnitActivitiesContainer.jsx'
import ClassroomLessonsPlanner from '../components/assignment_flow/classroom_lessons'
import ChooseClassroomLesson from '../components/assignment_flow/choose_classroom_lesson'
import MyActivitiesTabs from '../components/assignment_flow/my_activities_tabs.jsx'
import UnitTemplatesManager from '../components/assignment_flow/unit_templates_manager/unit_templates_manager'
import UnitTemplateProfile from '../components/assignment_flow/unit_templates_manager/unit_template_profile/unit_template_profile.tsx'

export default class LessonPlannerContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { user, location, children, } = this.props
    const tabs = location.pathname.includes('teachers') ? <MyActivitiesTabs pathname={location.pathname} /> : <span />
    return (
      <div>
        {tabs}
        {children}
        <Switch>
          <Route component={ClassroomLessonsPlanner} path="/teachers/classrooms/activity_planner/lessons" />
          <Route component={ClassroomLessonsPlanner} path="/teachers/classrooms/activity_planner/lessons/:classroomId" />
          <Route component={ChooseClassroomLesson} path="/teachers/classrooms/activity_planner/lessons_for_activity/:activityId" />
          <Route path="/teachers/classrooms/activity_planner/units/:unitId/students/edit" render={routerProps => <ClassroomsWithStudentsContainer user={user} {...routerProps} />} />
          <Route component={EditUnitActivitiesContainer} path="/teachers/classrooms/activity_planner/units/:unitId/activities/edit" />
          <Route component={LessonPlanner} exact path="/teachers/classrooms/activity_planner" />
          <Route component={UnitTemplateProfile} path="/activities/packs/:activityPackId" />
          <Route component={UnitTemplatesManager} path="/activities/packs" />
          <Route component={UnitTemplatesManager} path="/activities/packs/category/:category" />
          <Route component={UnitTemplatesManager} path="/activities/packs/grade/:grade" />
        </Switch>
      </div>
    )
  }
}
