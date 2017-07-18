'use strict'
 import React from 'react'

 export default  React.createClass({

  getInitialState: function(){
    if ((this.props.pathname === '/teachers/classrooms/activity_planner' || this.props.pathname.includes('/lessons/'))) {
      return {allActivityPacks: 'active'}
    } else {
      return {lessons: 'active'}
    }
  },

	render: function () {
		return (
			<div className="unit-tabs tab-subnavigation-wrapper">
				<div className="container">
					<ul>
						<li><a href='/teachers/classrooms/activity_planner' className={this.state.allActivityPacks}>All Activity Packs</a></li>
            <li><a href='/teachers/classrooms/activity_planner/lessons' className={this.state.lessons}>Lessons</a></li>
					</ul>
				</div>
			</div>
		);
	}


});
