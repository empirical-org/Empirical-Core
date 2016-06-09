'use strict'

 import React from 'react'
 import ReactDOM from 'react-dom';
 import $ from 'jquery'

 export default  React.createClass({
	callToggleActivitySelection: function (e) {
		var true_or_false = ($(e.target).attr('checked') == 'checked');
		this.props.toggleActivitySelection(this.props.data, true_or_false);
	},
	tooltipTrigger: function (e) {
		e.stopPropagation();
		ReactDOM.findDOMNode(this).tooltip('show');
		// $(this.refs.activateTooltip).tooltip('show');
    // this.refs.activateTooltip.tooltip('show');
    // this.refs.activateTooltip.tooltip('show');

	},
	tooltipTriggerStop: function (e) {
		e.stopPropagation();
		// $(this.refs.activateTooltip.getDOMNode()).tooltip('hide');
    // $(this.refs.activateTooltip).tooltip('hide');
    this.refs.activateTooltip.tooltip('hide');
	},

	render: function () {
		return (
			<tr>
				<td>
					<input type='checkbox' checked={this.props.selected} onChange={this.callToggleActivitySelection} id={"activity_" + this.props.data.id} data-model-id={this.props.data.id} className='css-checkbox'/>
					<label htmlFor={'activity_' + this.props.data.id} id={'activity_' + this.props.data.id} className='css-label' />
				</td>

				<td>
					<div ref='activateTooltip' className={'activate-tooltip ' + this.props.data.classification.image_class } data-html='true' data-toggle='tooltip' data-placement='top'

						title={"<h1>" + this.props.data.name + "</h1><p>App: " + this.props.data.classification.alias + "</p><p>" + this.props.data.topic.name +  "</p><p>" + this.props.data.description + "</p>"}>

					</div>
				</td>


				<td onMouseEnter={this.tooltipTrigger} onMouseLeave={this.tooltipTriggerStop} className='tooltip-trigger activity_name'>
					<a className='activity_link' href={this.props.data.anonymous_path} target='_new'>
						{this.props.data.name}
					</a>
				</td>


				<td onMouseEnter={this.tooltipTrigger} onMouseLeave={this.tooltipTriggerStop} className='tooltip-trigger'>{this.props.data.topic.section.name}</td>

				<td onMouseEnter={this.tooltipTrigger} onMouseLeave={this.tooltipTriggerStop} className='tooltip-trigger'>{this.props.data.topic.topic_category.name}</td>
			</tr>
		);

	}


});
