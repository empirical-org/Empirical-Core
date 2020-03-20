import PropTypes from 'prop-types';
import React from 'react'
import _ from 'underscore'
import SortableTh from './sortable_th.jsx'
import SortableTr from './sortable_tr.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'


export default class extends React.Component {
  static propTypes = {
    currentSort: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired, // [{classification_name: 'foobar', ...}]
    sortHandler: PropTypes.func.isRequired, // Handle sorting of columns
    shouldTransition: PropTypes.bool,
    loading: PropTypes.bool,
    colorByScoreKeys: PropTypes.array,
    onNonPremiumStudentPage: PropTypes.string
  };

  shouldTransition = () => {
    return !!this.props.shouldTransition
  };

  loading = () => {
    if (this.props.loading === true) {
      return true;
    } else {
      return false;
    }
  };

  // Return a handler function that includes the field name as the 1st arg.
  sortByColumn = (fieldName) => {
    return _.bind(function sortHandler(sortDirection) {
      return this.props.sortHandler(fieldName, sortDirection);
    }, this);
  };

  columns = () => {
    return _.map(this.props.columns, function (column, i) {
      var isCurrentSort = (column.sortByField === this.props.currentSort.field);
      return (<SortableTh
        displayClass={column.className}
        displayName={column.name}
        isCurrentSort={isCurrentSort}
        key={i}
        sortDirection={this.props.currentSort.direction || 'asc'}
        sortHandler={this.sortByColumn(column.sortByField)}
      />)
    }, this);
  };

  rows = () => {
    return _.map(this.props.rows, function(row, i) {
      return <SortableTr colorByScoreKeys={this.props.colorByScoreKeys} columns={this.props.columns} key={row.id || i} row={row} />
    }, this);
  };

  loadingView = () => {
    return (
      <div className='sortable-table-spinner-container'>
        <i className='fas fa-refresh fa-spin sortable-table-spinner' />
      </div>
    );
  };

  render() {
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
}
