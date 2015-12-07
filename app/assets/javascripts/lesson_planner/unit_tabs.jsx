'use strict';

EC.UnitTabs = React.createClass({
	propTypes: {
		tab: React.PropTypes.string.isRequired
	},

	select: function (tab) {
		var that = this;
		return function () {
			that.props.toggleTab(tab)
		}
	},

	render: function () {
		var classes = {createUnit: '', exploreActivityPacks: '', manageUnits: ''}
		classes[this.props.tab] = 'active';

		return (
			<div className="unit-tabs tab-subnavigation-wrapper">
				<div className="container">
					<ul>
						<li onClick={this.select('manageUnits')}><a className={classes.manageUnits}>My Units</a></li>
						<li onClick={this.select('exploreActivityPacks')}><a className={classes.exploreActivityPacks}>Explore Activity Packs</a></li>
						<li onClick={this.select('createUnit')}><a className={classes.createUnit}>Create a Unit</a></li>
					</ul>
				</div>
			</div>
		);
	}


});


