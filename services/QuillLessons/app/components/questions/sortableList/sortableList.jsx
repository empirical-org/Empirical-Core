import React from 'react';
import {sortable} from 'react-sortable';
import ListItem from './listItem.jsx'



var SortableListItem = sortable(ListItem);

export default React.createClass({

	getInitialState: function() {
		return {
			draggingIndex: null,
			data: {
				items: this.props.data
			}
		};
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.data !== this.state.data.items) {
			this.setState({data: {items: nextProps.data}})
		}
	},

	updateState: function(obj) {
		this.setState(obj, this.props.sortCallback(this.state));
	},

	render: function() {
		var childProps = {
			className: 'myClass1'
		};
		var listItems = this.state.data.items.map(function(item, i) {
			return (
  <SortableListItem childProps={childProps} draggingIndex={this.state.draggingIndex} items={this.state.data.items} key={i} outline="list" sortId={i} updateState={this.updateState}>{item}</SortableListItem>
			);
		}, this);

		return (
  <div className="list">{listItems}</div>
		);
	}
});
