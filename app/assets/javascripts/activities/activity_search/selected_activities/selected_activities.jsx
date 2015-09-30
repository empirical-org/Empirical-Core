"use strict";
EC.SelectedActivities = React.createClass({

	getInitialState: function () {
		return {
			prematureContinueAttempted: false
		}
	},

	clickContinue: function () {
		if (this.props.isEnoughInputProvided) {
			this.props.clickContinue();
		} else {
			this.setState({prematureContinueAttempted: true});
		}
	},

	determineErrorMessageClass: function () {
		if (this.state.prematureContinueAttempted) {
			return "error-message visible-error-message";
		} else {
			return "error-message hidden-error-message";
		}
	},

	determineContinueButtonClass: function () {
		console.log('calling determine continue button class', this.props.isEnoughInputProvided)
		if (this.props.isEnoughInputProvided) {
			return 'button-green pull-right';
		} else {
			return 'button-grey pull-right';
		}
	},

	render: function () {
		var rows, buttonClassName;

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
				<div className='error-message-and-button'>
					<div className={this.determineErrorMessageClass()}>{this.props.errorMessage}</div>
					<button onClick={this.clickContinue} className={this.determineContinueButtonClass()} id='continue'>Continue</button>
				</div>
			</section>
		);
	}
});