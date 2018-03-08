import React from 'react'
import createReactClass from 'create-react-class'
import MyActivitiesTabs from '../components/lesson_planner/my_activities_tabs.jsx'

export default createReactClass({

  render: function() {
    const tabs = this.props.location.pathname.includes('teachers') ? <MyActivitiesTabs pathname={this.props.location.pathname}/> : <span/>
    return (
      <div>
        {tabs}
        {this.props.children}
      </div>)
   }
 });
