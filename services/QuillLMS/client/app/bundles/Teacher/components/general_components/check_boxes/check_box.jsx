import React from 'react';

export default class CheckBox extends React.Component {
  handleChange = () => {
    this.props.toggleItem(this.props.item)
  };

  determineCheckedText = () => {
    return (this.props.checked ? 'checked' : '');
  };

  render() {
    return (
      <div className='checkbox-and-label'>
        <input
          checked={this.determineCheckedText()}
          className="checkbox"
          onChange={this.handleChange}
          type="checkbox"
        />
        <label>{this.props.item}</label>
      </div>
    );
  }
}
