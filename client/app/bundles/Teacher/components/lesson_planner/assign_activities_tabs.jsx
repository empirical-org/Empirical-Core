'use strict'
 import React from 'react'

 export default  React.createClass({

  getInitialState: function(){
    if (window.location.pathname.includes('diagnostic')) {
      return {diagnostics: 'active'}
    } else if (window.location.pathname.includes('featured')) {
      return {featured: 'active'}
    } else if (window.location.pathname.includes('create-unit')) {
      return {custom: 'active'}
    } else {
      return {}
    }
  },

	render: function () {
		return (
			<div className="unit-tabs tab-subnavigation-wrapper">
				<div className="container">
					<ul>
						<li><a href='/teachers/classrooms/assign_activities/assign-a-diagnostic' className={this.state.diagnostics}>Entry Diagnostics</a></li>
            <li><a href='/teachers/classrooms/assign_activities/featured-activity-packs' className={this.state.featured}>Featured Activity Packs</a></li>
            <li><a href='/teachers/classrooms/assign_activities/create-unit' className={this.state.custom}>Explore All Activities</a></li>
					</ul>
				</div>
			</div>
		);
	}


});
