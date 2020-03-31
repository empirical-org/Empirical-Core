import PropTypes from 'prop-types';

import React from 'react'

export default class extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
  };

  getName = () => {
    return this.props.data.name;
  };

  getId = () => {
    return this.props.data.id;
  };

  select = () => {
    this.props.select(this.getId());
  };

  getClassName = () => {
    var name;
    if (this.props.isSelected) {
      name = 'list-filter-option selected'
    } else {
      name = 'list-filter-option'
    }
    return name;
  };

  render() {
    return (
      <a className={this.getClassName()} onClick={this.select}>{this.getName()}</a>
    )
  }
}
