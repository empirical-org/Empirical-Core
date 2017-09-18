'use strict'

 import React from 'react'

 export default  React.createClass({
	deselectActivity: function () {
		this.props.toggleActivitySelection(this.props.data, false);
	},
	render: function () {

		return (
			<tr data-model-id={this.props.data.id}>
				<td className={this.props.data.classification ? this.props.data.classification.gray_image_class : ''}></td>
				<td>
					<a className='activity_link' href={this.props.data.anonymous_path} target='_new'>
						{this.props.data.name}
					</a>
				</td>
				<td onClick={this.deselectActivity} data-model-id={this.props.data.id} className='deselect-activity icon-x-gray'></td>
			</tr>
		);

	}


});
