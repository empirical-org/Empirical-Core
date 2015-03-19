"use strict";
EC.IconRow = React.createClass({
	render: function () {
		var row = _.map(this.props.data, function (ele) {
			return (
				<EC.ActivityIconWithTooltip key={ele.id} data={ele} />
			);
		});
		return (
			<div className='icon-row'>
				{row}
			</div>

		);
	}
})