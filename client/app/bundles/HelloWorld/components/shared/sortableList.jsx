import React from 'react';
import {sortable} from 'react-sortable';
import ListItem from './listItem.jsx'

const SortableListItem = sortable(ListItem);

export default class SortableList extends React.Component {

	constructor(props) {
    super(props)

    this.state = {
      draggingIndex: null,
      data: {
        items: this.props.data
      }
    }

    this.updateState = this.updateState.bind(this)
  }

	componentWillReceiveProps(nextProps) {
		if (nextProps.data !== this.state.data.items) {
			this.setState({data: {items: nextProps.data}})
		}
	}

	updateState(obj) {
		this.setState(obj, this.props.sortCallback(this.state));
	}

	render() {
		const childProps = {
			className: 'myClass1'
		};
		const listItems = this.state.data.items.map(function(item, i) {
			return (
				<SortableListItem
          key={i}
          updateState={this.updateState}
          items={this.state.data.items}
          draggingIndex={this.state.draggingIndex}
          sortId={i}
          outline="list"
          childProps={childProps}
          >
            {item}
        </SortableListItem>
			);
		}, this);

		return (
			<div className="list">{listItems}</div>
		);
	}
}
