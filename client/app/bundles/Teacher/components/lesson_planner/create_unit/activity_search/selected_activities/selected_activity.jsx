'use strict'

 import React from 'react'

 export default  React.createClass({
	deselectActivity: function () {
		this.props.toggleActivitySelection(this.props.data, false);
	},
	render: function () {
		return (
			<tr data-model-id={this.props.data.id}>
				<td className={this.props.data.activity_classification ? `icon-${this.props.data.activity_classification.id}-green-no-border` : ''}></td>
				<td>
					<a className='activity_link' href={this.props.data.anonymous_path} target='_new'>
						{this.props.data.name}
					</a>
				</td>
				<td onClick={this.deselectActivity} data-model-id={this.props.data.id} className='deselect-activity'><img src="/images/x.svg" /></td>
			</tr>
		);

	}


});
