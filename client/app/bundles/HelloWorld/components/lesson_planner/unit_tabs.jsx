'use strict'
 import React from 'react'

 export default  React.createClass({

  getInitialState: function(){
    if ((this.props.pathname === '/teachers/classrooms/activity_planner' || this.props.pathname.includes('/units/'))) {
      return {myActivityPacks: 'active'}
    } else {
      return {assignANewActivity: 'active'}
    }
  },

	render: function () {
		return (
			<div className="unit-tabs tab-subnavigation-wrapper">
				<div className="container">
					<ul>
						<li><a href='/teachers/classrooms/activity_planner' className={this.state.myActivityPacks}>My Activity Packs</a></li>
            <li><a href='/teachers/classrooms/activity_planner/assign-new-activity' className={this.state.assignANewActivity}>Assign a New Activity</a></li>
					</ul>
				</div>
			</div>
		);
	}


});
