EC.SelectedActivities = React.createClass({


	render: function () {

		rows = _.map(this.props.selectedActivities, function (ele){
			return <EC.SelectedActivity toggleActivitySelection={this.props.toggleActivitySelection} data={ele} />
		}, this);
		return (
			<section className="teaching-cart">
				<h3 className="section-header unit_name">{this.props.unitName}</h3>
				<table className="table">
					<tbody>
						{rows}		
					</tbody>
				</table>
				<div className="fake-border"></div>
				<button className="button-green pull-right" id='continue'>Continue</button>
			</section>
		);
	}


});