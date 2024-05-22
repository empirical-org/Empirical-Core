import React from 'react';

import { DropdownInput } from '../../../../Shared/index';

export default class ItemDropdown extends React.Component {
  constructor(props) {
    super(props)

    const { items, selectedItem } = props;
    const formattedItem = selectedItem ? this.formatItem(selectedItem) : this.formatItem((items[0]));

    this.state = { selectedItem: formattedItem }
  }

  formatItem = (item) => {
    if(typeof item === 'string') {
      return { label: item, value: { name: item }}
    } else if(typeof item === 'object') {
      return { id: item.id ? item.id : null, label: item.name, value: item }
    }
  }

  items = () => {
    const { items } = this.props;
    return items.map(item => {
      return this.formatItem(item);
    });
  };

  findItemByIdOrName = (itemObject) => {
    const { items } = this.props;
    const { value } = itemObject;
    const { id, name } = value;
    return items.find((c) => {
      if (!c.id) {
        // then we're matching on name
        return c === name || c.name === name;
      }
      return c.id === id;
    });
  };

  onHandleSelect = (itemObject) => {
    const { callback } = this.props;
    const item = this.findItemByIdOrName(itemObject);
    this.setState({ selectedItem: this.formatItem(item)});
    if (callback) {
      callback(item);
    }
  };

  render() {
    const { selectedItem, } = this.state
    const { className, isSearchable } = this.props;
    return (
      <DropdownInput
        className={className ? className : "select-item-dropdown"}
        handleChange={this.onHandleSelect}
        isSearchable={isSearchable}
        options={this.items()}
        value={selectedItem}
      />
    );
  }
}
