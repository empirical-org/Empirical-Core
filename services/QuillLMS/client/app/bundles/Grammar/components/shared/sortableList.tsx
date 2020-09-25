import * as React from 'react';

import ListItem from './listItem'

const { sortable } = require('react-sortable');

const SortableListItem = sortable(ListItem);

// interface SortableListProps {
//   data: data;
// }
//
// interface data {
//   items: any
// }

class SortableList extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      draggingIndex: null,
			data: {
				items: this.props.data
			}
    }
  }


	UNSAFE_componentWillReceiveProps(nextProps: any) {
		if (nextProps.data !== this.state.data.items) {
			this.setState({data: {items: nextProps.data}})
		}
	}

	updateState = (obj: object) => {
		this.setState(obj, this.props.sortCallback(this.state));
	}

	render() {
		const childProps = {
			className: 'myClass1'
		};
		const listItems = this.state.data.items.map((item: any, i: number) => {
			return (
  <SortableListItem
    childProps={childProps}
    draggingIndex={this.state.draggingIndex}
    items={this.state.data.items}
    key={i}
    onSortItems={this.updateState}
    outline="list"
    sortId={i}
    updateState={this.updateState}
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

export default SortableList
