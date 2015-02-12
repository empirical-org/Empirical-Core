EC.UnitTabs = React.createClass({

	selectCreateUnit: function () {
		this.props.toggleTab('createUnit');
	},
	selectManageUnits: function () {
		this.props.toggleTab('manageUnits');
	},

	render: function () {
		var createUnitClass, manageUnitsClass;
		if (this.props.tab == 'createUnit') {
			createUnitClass = 'active';
			manageUnitsClass = '';
		} else {
			createUnitClass = '';
			manageUnitsClass = 'active';
		}

		return (
			<div className="unit-tabs tab-subnavigation-wrapper">
				<div className="container">
					<ul>
						<li onClick={this.selectManageUnits}><a className={manageUnitsClass}>My Units</a></li>
						<li onClick={this.selectCreateUnit}><a className={createUnitClass}>Create a Unit</a></li>

					</ul>
				</div>
			</div>
		);
	}


});


