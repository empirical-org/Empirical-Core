// Ported from EC.ActivitySearchSort
import _ from 'underscore'
import React from 'react'

export default React.createClass({
  propTypes: {
    isCurrentSort: React.PropTypes.bool.isRequired,
    displayName: React.PropTypes.string.isRequired,
    displayClass: React.PropTypes.string,
    sortDirection: React.PropTypes.string.isRequired,
    sortHandler: React.PropTypes.func.isRequired // Handle sorting of columns
  },

  arrowClass: function() {
    return this.props.sortDirection === 'desc' ? 'fa fa-caret-down table-header-arrow' : 'fa fa-caret-up table-header-arrow';
  },

  clickSort: function() {
    if (_.isEmpty(this.props.displayName)) {
      return;
    }
    var newDirection;
    if (this.props.isCurrentSort) {
    // Toggle the sort direction if it has already been selected.
      newDirection = (this.props.sortDirection === 'asc') ? 'desc' : 'asc';
    }else {
    // Sort should be ascending by default.
      newDirection = 'asc';
    }

    this.props.sortHandler(newDirection);
  },

  render: function() {
    var arrow,
        className = 'sorter';
    if (this.props.isCurrentSort && !_.isEmpty(this.props.displayName)) {
      arrow = <i className={this.arrowClass()}></i>;
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
});
