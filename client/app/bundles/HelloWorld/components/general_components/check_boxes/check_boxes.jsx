import React from 'react'
import CheckBox from './check_box.jsx'
import _ from 'underscore'

export default React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    items: React.PropTypes.array.isRequired,
    selectedItems: React.PropTypes.array.isRequired,
    toggleItem: React.PropTypes.func.isRequired
  },

  determineIfChecked: function (item) {
    var val = _.contains(this.props.selectedItems, item);
    return val;
  },

  generateCheckBox: function (item) {
    return (<CheckBox item={item} checked={this.determineIfChecked(item)} toggleItem={this.props.toggleItem} key={item} />);
  },

  render: function () {
    var checkBoxes = _.map(this.props.items, this.generateCheckBox, this);
    return <div className='vertical-checkboxes'>
              <h3>{this.props.label}</h3>
              <div>{checkBoxes}</div>
            </div>;
  }
});
