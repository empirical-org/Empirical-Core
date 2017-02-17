'use strict'
 import React from 'react'

 export default  React.createClass({
	propTypes: {
		tab: React.PropTypes.string.isRequired
	},

	render: function () {
		var classes = {createUnit: '', exploreActivityPacks: '', manageUnits: '', 'assign-new-activity': '', 'manage-units':'', 'featured-activity-packs':''}
		// classes[this.props.tab] = 'active';

    switch (this.props.tab) {
      case 'manageUnits':
      case 'manage-units':
        classes[this.props.tab] = 'active'
        break
      default:
        classes['assign-new-activity'] = 'active'
        classes.assignANewActivity = 'active'
  }
		// put the below into the list to activate activity packs
		// <li onClick={this.select('exploreActivityPacks')}><a className={classes.exploreActivityPacks}>Explore Activity Packs</a></li>
		return (
			<div className="unit-tabs tab-subnavigation-wrapper">
				<div className="container">
					<ul>
						<li><a href='/teachers/classrooms/activity_planner' className={classes.manageUnits || classes['manage-units']}>My Activity Packs</a></li>
            <li><a href='/teachers/classrooms/activity_planner/assign-new-activity' className={classes.assignANewActivity || classes['assign-new-activity']}>Assign a New Activity</a></li>
					</ul>
				</div>
			</div>
		);
	}


});
