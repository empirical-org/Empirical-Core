import React from 'react'
import UnitTabs from '../components/lesson_planner/unit_tabs.jsx'

export default React.createClass({

  render: function() {
    return (
      <div>
        <UnitTabs pathname={this.props.location.pathname}/>
        {this.props.children}
      </div>)
   }
 });
