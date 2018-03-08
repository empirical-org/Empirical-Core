import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

export default createReactClass({

  propTypes: {
    items: PropTypes.array.isRequired,
    callback: PropTypes.func,
    selectedItem: PropTypes.string.isRequired
  },

  items: function() {
    return this.props.items.map((item) => {
      if (!item.id) {
        return (<MenuItem key={item} eventKey={item}>{item.name || item}</MenuItem>)
      }
      return <MenuItem key={item.id} eventKey={item.id}>{item.name}</MenuItem>
    })
  },

  findItemByIdOrName: function(idOrName) {
    return this.props.items.find((c) => {
      if (!c.id) {
        return c === idOrName
      }
      return c.id === idOrName}
    )
  },

  handleSelect: function(itemId) {
    let item = this.findItemByIdOrName(itemId)
    this.props.callback(item)
  },

  render: function() {

    return (
      <DropdownButton disabled={!this.props.items.length} id={this.props.dropdownId} bsStyle='default' title={this.props.selectedItem} className='select-item-dropdown' onSelect={this.handleSelect}>
        {this.items()}
      </DropdownButton>
    );
  }
});
