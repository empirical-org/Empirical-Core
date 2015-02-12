EC.SelectedActivities = React.createClass({


	render: function () {
		var rows, buttonClassName;
		
		rows = _.map(this.props.selectedActivities, function (ele){
			return <EC.SelectedActivity toggleActivitySelection={this.props.toggleActivitySelection} data={ele} />
		}, this);

		if ((this.props.selectedActivities.length > 0) && (this.props.unitName != null) && (this.props.unitName != '')) {
			buttonClassName = "button-green pull-right";
		} else {
			buttonClassName = "hidden";
		}
		

		return (
			<section className="teaching-cart">
				<h3 className="section-header unit_name">{this.props.unitName}</h3>
				<table className="table">
					<tbody>
						{rows}		
					</tbody>
				</table>
				<div className="fake-border"></div>
				<button onClick={this.props.clickContinue} className={buttonClassName} id='continue'>Continue</button>
			</section>
		);
	}


});