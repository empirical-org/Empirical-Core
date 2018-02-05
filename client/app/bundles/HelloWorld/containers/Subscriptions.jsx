import React from 'react';
import ReactTable from 'react-table';

export default class extends React.Component {

  render() {
    const columnDefinitions = [
      {
        Header: 'Purchase Date',
        width: 78,
        accessor: 'created_at',
        Cell: props => props.value,
      },
      {
        Header: 'Subscription',
        accessor: 'account_type',
        Cell: props => props.value,
      },
      {
        Header: 'Start / End Date',
        accessor: 'start_date',
        Cell: row => (
          <span>
            {`${row.original.start_date}-${row.original.expiration}`}
          </span>),
      }
    ];
    return (
      <div>
        <ReactTable
          data={this.props.subscriptions} columns={columnDefinitions} showPagination={false} showPaginationTop={false} showPaginationBottom={false} showPageSizeOptions={false} className="progress-report has-green-arrow"
        />
      </div>);
  }
}
