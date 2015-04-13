EC.SelectedActivities = React.createClass({


	render: function () {
		var rows, buttonClassName, messageClassName;
		
		rows = _.map(this.props.selectedActivities, function (ele){
			return <EC.SelectedActivity toggleActivitySelection={this.props.toggleActivitySelection} data={ele} />
		}, this);

		if ((this.props.selectedActivities.length > 0) && (this.props.unitName != null) && (this.props.unitName != '')) {
			buttonClassName = "button-green pull-right";
			messageClassName = "hidden";
		} else {
			buttonClassName = "hidden";
			messageClassName = "alert-message"
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
				<div className={messageClassName}>You must provide a unit name and choose at least one activity to continue.</div>
				<button onClick={this.props.clickContinue} className={buttonClassName} id='continue'>Continue</button>
			</section>
		);
	}


});