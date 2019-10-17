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
    loading: React.PropTypes.bool,
    colorByScoreKeys: React.PropTypes.array,
    onNonPremiumStudentPage: React.PropTypes.string
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
      return <SortableTh
        displayClass={column.className}
        displayName={column.name}
        isCurrentSort={isCurrentSort}
        key={i}
        sortDirection={this.props.currentSort.direction || 'asc'}
        sortHandler={this.sortByColumn(column.sortByField)}
      />
    }, this);
  },

  rows: function() {
    return _.map(this.props.rows, function(row, i) {
      return <SortableTr colorByScoreKeys={this.props.colorByScoreKeys} columns={this.props.columns} key={row.id || i} row={row} />
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
          <ReactCSSTransitionGroup
            component='tbody'
            transitionEnterTimeout={2000}
            transitionLeaveTimeout={2000}
            transitionName={this.props.transitionName}
          >
            {this.rows()}
          </ReactCSSTransitionGroup>
        );
      } else {
        tbody = <tbody>{this.rows()}</tbody>
      }

      return (
        <table className={'table sortable-table ' + this.props.onNonPremiumStudentPage}>
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
