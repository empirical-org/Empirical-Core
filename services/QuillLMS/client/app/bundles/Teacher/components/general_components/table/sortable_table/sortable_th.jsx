import _ from 'underscore';
import React from 'react'

export default class SortableTh extends React.Component {
  arrowClass = () => {
    return this.props.sortDirection === 'desc' ? 'fas fa-caret-down table-header-arrow' : 'fas fa-caret-up table-header-arrow';
  };

  clickSort = () => {
    if (_.isEmpty(this.props.displayName)) {
      return;
    }
    let newDirection;
    if (this.props.isCurrentSort) {
    // Toggle the sort direction if it has already been selected.
      newDirection = (this.props.sortDirection === 'asc') ? 'desc' : 'asc';
    }else {
    // Sort should be ascending by default.
      newDirection = 'asc';
    }

    this.props.sortHandler(newDirection);
  };

  render() {
    let arrow,
      className = 'sorter';
    if (this.props.isCurrentSort && !_.isEmpty(this.props.displayName)) {
      arrow = <i className={this.arrowClass()} />;
    }
    if (this.props.displayClass) {
      className += ' ' + this.props.displayClass;
    }
    if (this.props.isCurrentSort) {
      className += ' current';
    }
    return (
      <th className={className} onClick={this.clickSort}>
        <span className="table-header-text">{this.props.displayName}</span>
        {arrow}
      </th>
    );
  }
}
