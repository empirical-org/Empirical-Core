import React from 'react'

export default React.createClass({
	displayName: 'SortableListItem',
	render: function() {
		return (
			<div {...this.props} className="list-item">{this.props.children}</div>
		)
	}
})
