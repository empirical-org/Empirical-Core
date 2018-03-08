import React from 'react'
import createReactClass from 'create-react-class'
import AssignActivitiesTabs from '../components/lesson_planner/assign_activities_tabs'

export default createReactClass({

  render: function() {
    return (
      <div>
        <AssignActivitiesTabs/>
        {this.props.children}
      </div>)
   }
 });
