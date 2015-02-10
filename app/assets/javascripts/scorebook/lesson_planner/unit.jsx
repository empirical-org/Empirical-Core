EC.Unit = React.createClass({

	deleteUnit: function () {
		console.log('delete unit clicked')
		var x = confirm("Are you sure you want to delete this Unit? It will delete all assignments given to students associated with this unit, even if those assignments have already been completed.");
		if (x) {
			this.props.deleteUnit(this.props.data.unit.id)
		}
	},

	render: function () {
		console.log(this.props.data)
		return (
			<section className="row vertical-align">
				<h1 className="col-md-10 vcenter">{this.props.data.unit.name}</h1>
				<div className="col-md-2 vcenter pull-right delete-unit" onClick={this.deleteUnit}>Delete Unit</div>
			</section>
		);
	}

});