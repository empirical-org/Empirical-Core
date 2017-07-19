'use strict'
 import React from 'react'

 export default  React.createClass({

  getInitialState: function(){
    if ((window.location.pathname === '/teachers/classrooms/activity_planner')) {
      return {allActivityPacks: 'active'}
    } else if (window.location.pathname.includes('/lessons')) {
      return {lessons: 'active'}
    } else {
      return {}
    }
  },

	render: function() {
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
