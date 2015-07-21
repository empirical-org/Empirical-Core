EC.PageNumber = React.createClass({
	clickNumber: function () {
		if (!this.props.isCurrentPage) {
			this.props.selectPageNumber(this.props.number);
		}
	},
	render: function () {
		if (this.props.number == this.props.currentPage) {
			className = 'page_number active'
			this.props.isCurrentPage = true;
		} else {
			className = 'page_number'
			this.props.isCurrentPage = false;
		}

		return (
			<li onClick={this.clickNumber} className={className}>
				<span>{this.props.number}</span>
			</li>
		);
	}
});