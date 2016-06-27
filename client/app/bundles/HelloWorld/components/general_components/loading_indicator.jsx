"use strict";
EC.LoadingIndicator = React.createClass({
	render: function () {
		return (
			<div className="spinner-container">
				<i className="fa fa-refresh fa-spin"></i>
			</div>
		);
	}
});