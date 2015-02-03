EC.ActivitySearchResult = React.createClass({
	callToggleActivitySelection: function (e) {
		var true_or_false = ($(e.target).attr('checked') == 'checked');
		this.props.toggleActivitySelection(true_or_false, this.props.data);
	},	

	render: function () {
		return (
			<tr>
				<td>
					<input type='checkbox' checked={this.props.selected} onChange={this.callToggleActivitySelection} id={"activity_" + this.props.data.id} data-model-id={this.props.data.id} className='css-checkbox'/>
					<label htmlFor={'activity_' + this.props.data.id} id={'activity_' + this.props.data.id} className='css-label' />
				</td>
				
				<td>
					<div className={'activate-tooltip ' + this.props.data.classification.image_class } data-html='true' data-toggle='tooltip' data-placement='top' 
						title={"<h1>" + this.props.data.name + "</h1><p>App: " + this.props.data.classification.name + "</p><p>" + this.props.data.description + "</p>"}>
					</div>
				</td>
				
				<td className='tooltip-trigger activity_name'>{this.props.data.name}</td>
				
				<td className='tooltip-trigger'>{this.props.data.topic.section.name}</td>
				
				<td className='tooltip-trigger'>{this.props.data.topic.name}</td>
			</tr>
		);

	}


});