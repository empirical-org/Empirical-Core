'use strict'

 import React from 'react'

 export default  React.createClass({
	deSelectActivity: function () {
		this.props.toggleActivitySelection(this.props.data, false);
	},
	render: function () {

		return (
			<tr data-model-id={this.props.data.id}>
				<td className={this.props.data.classification.image_class}></td>
				<td>
					<a className='activity_link' href={this.props.data.anonymous_path} target='_new'>
						{this.props.data.name}
					</a>
				</td>
				<td onClick={this.deSelectActivity} data-model-id={this.props.data.id} className='icon-x-gray'></td>
			</tr>
		);

	}


});
