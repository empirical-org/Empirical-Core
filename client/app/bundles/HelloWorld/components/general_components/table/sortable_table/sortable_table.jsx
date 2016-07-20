import React from 'react'
import _ from 'underscore'
import SortableTh from './sortable_th.jsx'
import SortableTr from './sortable_tr.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'


export default React.createClass({
  propTypes: {
    currentSort: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired,
    rows: React.PropTypes.array.isRequired, // [{classification_name: 'foobar', ...}]
    sortHandler: React.PropTypes.func.isRequired, // Handle sorting of columns
    shouldTransition: React.PropTypes.bool,
    loading: React.PropTypes.bool
  },

  shouldTransition: function () {
    return !!this.props.shouldTransition
  },

  loading: function () {
    if (this.props.loading === true) {
      return true;
    } else {
      return false;
    }
  },

  // Return a handler function that includes the field name as the 1st arg.
  sortByColumn: function(fieldName) {
    return _.bind(function sortHandler(sortDirection) {
      return this.props.sortHandler(fieldName, sortDirection);
    }, this);
  },

  columns: function() {
    return _.map(this.props.columns, function (column, i) {
      var isCurrentSort = (column.sortByField === this.props.currentSort.field);
      return <SortableTh key={i}
                            sortHandler={this.sortByColumn(column.sortByField)}
                            displayName={column.name}
                            displayClass={column.className}
                            sortDirection={this.props.currentSort.direction || 'asc'}
                            isCurrentSort={isCurrentSort} />
    }, this);
  },

  rows: function() {
    return _.map(this.props.rows, function(row, i) {
      return <SortableTr key={row.id || i} row={row} columns={this.props.columns} />
    }, this);
  },

  loadingView: function () {
    return (
      <div className='sortable-table-spinner-container'>
        <i className='fa fa-refresh fa-spin sortable-table-spinner' />
      </div>
    );
  },

  render: function() {
    if (this.loading()) {
      return this.loadingView();
    } else {
      var tbody;
      if (this.shouldTransition()) {
        tbody = (
          <ReactCSSTransitionGroup component='tbody'
                                     transitionName={this.props.transitionName}
                                     transitionEnterTimeout={2000}
                                     transitionLeaveTimeout={2000}>
            {this.rows()}
          </ReactCSSTransitionGroup>
        );
      } else {
        tbody = <tbody>{this.rows()}</tbody>
      }

      return (
        <table className='table sortable-table'>
          <thead>
            <tr>
              {this.columns()}
            </tr>
          </thead>
         {tbody}
        </table>
      );
    }
  }
});
