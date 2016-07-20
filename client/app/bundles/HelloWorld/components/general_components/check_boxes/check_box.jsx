'use strict';
EC.CheckBox = React.createClass({
  propTypes: {
    checked: React.PropTypes.bool.isRequired,
    toggleItem: React.PropTypes.func.isRequired,
    item: React.PropTypes.string.isRequired
  },

  handleChange: function () {
    this.props.toggleItem(this.props.item)
  },

  determineCheckedText: function () {
    return (this.props.checked ? 'checked' : '');
  },

  render: function () {
    return (
      <div className='checkbox-and-label'>
        <input type="checkbox"
         checked={this.determineCheckedText()}
         className="checkbox"
         onChange={this.handleChange} />
        <label>{this.props.item}</label>
      </div>
    );
  }
});
