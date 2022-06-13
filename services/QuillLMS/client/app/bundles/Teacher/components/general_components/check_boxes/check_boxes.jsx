import React from 'react'
import CheckBox from './check_box.jsx'
import _ from 'underscore'

export default class CheckBoxes extends React.Component {
  determineIfChecked = (item) => {
    let val = _.contains(this.props.selectedItems, item);
    return val;
  };

  generateCheckBox = (item) => {
    return (<CheckBox checked={this.determineIfChecked(item)} item={item} key={item} toggleItem={this.props.toggleItem} />);
  };

  render() {
    let checkBoxes = _.map(this.props.items, this.generateCheckBox, this);
    return (
      <div className='vertical-checkboxes'>
        <h3>{this.props.label}</h3>
        <div>{checkBoxes}</div>
      </div>
    );
  }
}
