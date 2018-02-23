import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import CheckBox from './check_box.jsx'
import _ from 'underscore'

export default createReactClass({
  propTypes: {
    label: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    selectedItems: PropTypes.array.isRequired,
    toggleItem: PropTypes.func.isRequired
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
