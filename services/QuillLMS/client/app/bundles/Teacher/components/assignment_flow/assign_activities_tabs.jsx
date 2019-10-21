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
        <li><a className={this.state.diagnostics} href='/teachers/classrooms/assign_activities/assign-a-diagnostic'>Entry Diagnostics</a></li>
        <li><a className={this.state.featured} href='/teachers/classrooms/assign_activities/featured-activity-packs'>Featured Activity Packs</a></li>
        <li><a className={this.state.custom} href='/teachers/classrooms/assign_activities/create-unit'>Explore All Activities</a></li>
      </ul>
    </div>
  </div>
		);
	}


});
