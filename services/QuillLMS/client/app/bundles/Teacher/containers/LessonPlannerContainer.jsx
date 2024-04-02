import React from 'react';
import { Route, Switch } from 'react-router-dom';

import UpdateAssignedStudents from './UpdateAssignedStudents';
import EditUnitActivitiesContainer from './EditUnitActivitiesContainer.jsx';

import ChooseClassroomLesson from '../components/assignment_flow/choose_classroom_lesson';
import ClassroomLessonsPlanner from '../components/assignment_flow/classroom_lessons';
import ManageUnits from '../components/assignment_flow/manage_units/manage_units';
import MyActivitiesTabs from '../components/assignment_flow/my_activities_tabs.jsx';
import UnitTemplateProfile from '../components/assignment_flow/unit_templates_manager/unit_template_profile/unit_template_profile.tsx';
import UnitTemplatesManager from '../components/assignment_flow/unit_templates_manager/unit_templates_manager';

export default class LessonPlannerContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { user, location, children, unassignWarningHidden, } = this.props
    const tabs = location.pathname.includes('teachers') ? <MyActivitiesTabs pathname={location.pathname} /> : <span />
    return (
      <div>
        {tabs}
        {children}
        <Switch>
          <Route component={ClassroomLessonsPlanner} path="/teachers/classrooms/activity_planner/lessons" />
          <Route component={ClassroomLessonsPlanner} path="/teachers/classrooms/activity_planner/lessons/:classroomId" />
          <Route component={ChooseClassroomLesson} path="/teachers/classrooms/activity_planner/lessons_for_activity/:activityId" />
          <Route path="/teachers/classrooms/activity_planner/units/:unitId/students/edit" render={routerProps => <UpdateAssignedStudents unassignWarningHidden={unassignWarningHidden} user={user} {...routerProps} />} />
          <Route component={EditUnitActivitiesContainer} path="/teachers/classrooms/activity_planner/units/:unitId/activities/edit" />
          <Route path="/teachers/classrooms/activity_planner/closed" render={routerProps => <ManageUnits open={false} {...routerProps} />} />
          <Route exact path="/teachers/classrooms/activity_planner" render={(routerProps) => <ManageUnits open={true} {...routerProps} />} />
          <Route component={UnitTemplateProfile} path="/activities/packs/:activityPackId" />
          <Route component={UnitTemplatesManager} path="/activities/packs" />
          <Route component={UnitTemplatesManager} path="/activities/packs/category/:category" />
          <Route component={UnitTemplatesManager} path="/activities/packs/grade/:grade" />
        </Switch>
      </div>
    )
  }
}
