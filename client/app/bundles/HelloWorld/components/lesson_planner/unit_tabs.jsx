'use strict'
 import React from 'react'
 import {Link} from 'react-router'

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
						<li><Link to='tab/manage-units' className={classes.manageUnits || classes['manage-units']}>My Activity Packs</Link></li>
            <li><Link to='tab/assign-new-activity' className={classes.assignANewActivity || classes['assign-new-activity']}>Assign a New Activity</Link></li>
					</ul>
				</div>
			</div>
		);
	}


});
