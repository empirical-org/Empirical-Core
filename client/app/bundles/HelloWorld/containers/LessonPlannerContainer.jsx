import React from 'react'
import UnitTabs from '../components/lesson_planner/unit_tabs.jsx'

export default React.createClass({

  render: function() {
    const unitTabs = this.props.location.pathname.includes('teachers') ? <UnitTabs pathname={this.props.location.pathname}/> : null
    return (
      <div>
        {unitTabs}
        {this.props.children}
      </div>)
   }
 });
