import React from 'react'
import AssignActivitiesTabs from '../components/assignment_flow/assign_activities_tabs'

export default React.createClass({

  render: function() {
    return (
      <div>
        <AssignActivitiesTabs />
        {this.props.children}
      </div>)
   }
 });
