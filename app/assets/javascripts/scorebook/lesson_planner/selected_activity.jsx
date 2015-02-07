EC.SelectedActivity = React.createClass({
	deSelectActivity: function () {
		this.props.toggleActivitySelection(false, this.props.data);
	},
	render: function () {

		return (
			<tr data-model-id={this.props.data.id}>
				<td className={this.props.data.classification.image_class}></td>
				<td>{this.props.data.name}</td>
				<td onClick={this.deSelectActivity} data-model-id={this.props.data.id} className='icon-x-gray'></td>
			</tr>
		);

	}


});