EC.PageNumber = React.createClass({

	render: function () {
		return (
			<li onClick=clickNumber className='page_number'>
				<span>{this.props.number}</span>
			</li>
		);
	}
});