EC.UnitTabs = React.createClass({

	selectCreateUnit: function () {
		this.props.toggleTab('createUnit');
	},
	selectManageUnits: function () {
		this.props.toggleTab('manageUnits');
	},

	render: function () {
		
		if (this.props.tab == 'createUnit') {
			createUnitClass = 'active'
			manageUnitsClass = ''
		} else {
			createUnitClass = ''
			manageUnitsClass = 'active'
		}

		return (
			<div className="tab-subnavigation-wrapper">
				<div className="container">
					<ul>
						<li onClick={this.selectCreateUnit}><a className={createUnitClass}>Create a Unit</a></li>
						<li onClick={this.selectManageUnits}><a className={manageUnitsClass}>Manage Units</a></li>
					</ul>
				</div>
			</div>
		);
	}


});


