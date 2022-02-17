import React from 'react'

export default class ListFilterOption extends React.Component {
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
    let name;
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
