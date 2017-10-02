import React from 'react'
import MyActivitiesTabs from '../components/lesson_planner/my_activities_tabs.jsx'

export default React.createClass({

  render: function() {
    const tabs = this.props.location.pathname.includes('teachers') ? <MyActivitiesTabs pathname={this.props.location.pathname}/> : <span/>
    return (
      <div>
        {tabs}
        {this.props.children}
      </div>)
   }
 });
