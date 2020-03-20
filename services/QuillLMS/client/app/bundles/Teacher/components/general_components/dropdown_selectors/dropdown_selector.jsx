import PropTypes from 'prop-types';
import React from 'react'
import _ from 'underscore';

export default React.createClass({
  propTypes: {
    options: PropTypes.array.isRequired,
    select: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
  },

  select: function () {
    var id = $(this.refs.select).val();
    this.props.select(id);
  },

  generateOption: function (option) {
    var id = (option.id ? option.id : option)
    var name = (option.name ? option.name : option)
    return (
      <option key={id} value={id}>{name}</option>
    );
  },

  render: function () {
    // makes shallow copy of array
    var opt = this.props.options.slice(0);
    opt.unshift('Select');
    var options = _.map(opt, this.generateOption, this);
    return (
      <div className='dropdown-select-and-label'>
        <h3 className='dropdown-select-label'>{this.props.label}</h3>
        <select onChange={this.select} ref={'select'} value={this.props.defaultValue}>
          {options}
        </select>
      </div>
    );
  }

});
