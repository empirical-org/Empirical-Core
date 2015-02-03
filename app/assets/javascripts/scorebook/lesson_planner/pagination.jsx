EC.pagination = React.createClass({


	render: function () {

		var pages = [];
		_.times(this.props.numberOfPages, function (pageNumber) {
			pageNumber = pageNumber + 1;
			pages.push(<EC.PageNumber number=pageNumber />);
		})

		return (
			<ul className='pagination'>
				<li className='left_arrow'></li>
				{pages}
				<li className='right_arrow'></li>
			</ul>
		);

	}


});