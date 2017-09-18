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
    $(this.refs.activateTooltip).tooltip('show');
	},

	tooltipTriggerStop: function (e) {
		e.stopPropagation();
    $(this.refs.activateTooltip).tooltip('hide');
	},

	render: function () {
    const selectedClass = this.props.selected ? 'selected' : ''
    const toolTip = this.props.data.classification
    ? <div ref='activateTooltip'
      className={this.props.data.classification.gray_image_class}
      data-html='true'
      data-toggle='tooltip'
      data-placement='top'
    	title={"<h1>" + this.props.data.name + "</h1><p>App: " + this.props.data.classification.alias + "</p><p>" + this.props.data.topic.name +  "</p><p>" + this.props.data.description + "</p>"} />
    : <span/>
		return (
			<tr onMouseEnter={this.tooltipTrigger} onMouseLeave={this.tooltipTriggerStop} className={`tooltip-trigger ${selectedClass}`}>
      <td>
					<input type='checkbox' checked={this.props.selected} onChange={this.callToggleActivitySelection} id={"activity_" + this.props.data.id} data-model-id={this.props.data.id} className='css-checkbox'/>
					<label htmlFor={'activity_' + this.props.data.id} id={'activity_' + this.props.data.id} className='css-label' />
				</td>

        <td>
          {toolTip}
				</td>


				<td className='activity_name'>
					<a className='activity_link' href={this.props.data.anonymous_path} target='_new'>
						{this.props.data.name}
					</a>
				</td>


				<td>{this.props.data.topic.section.name}</td>

				<td>{this.props.data.topic.topic_category.name}</td>
			</tr>
		);

	}


});
