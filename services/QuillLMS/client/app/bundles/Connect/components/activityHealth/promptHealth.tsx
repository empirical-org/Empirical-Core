import * as React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css';
import request from 'request'
import _ from 'underscore'

import LoadingSpinner from '../shared/loading_indicator.jsx'

class PromptHealth extends React.Component<ComponentProps, any> {

  state = {

  };

  renderTable() {
    return this.tableOrEmptyMessage()
  }

  columnDefinitions() {
    return [
      {
        Header: 'Text',
        accessor: 'text',
        resizeable: true,
        minWidth: 200,
        Cell: cell => (<a href={cell.original.url}>{cell.original.text}</a>)
      },
      {
        Header: 'Flag',
        accessor: 'flag',
        resizeable: false,
        Cell: props => props.value
      },
      {
        Header: 'Incorrect Sequences',
        accessor: 'incorrect_sequences',
        resizeable: false,
        Cell: props => props.value
      },
      {
        Header: 'Focus Points',
        accessor: 'focus_points',
        resizeable: false,
        Cell: props => props.value,
        maxWidth: 90
      },
      {
        Header: 'Percent Common Unmatched',
        accessor: 'percent_common_unmatched',
        resizeable: false,
        Cell: props => props.value,
        maxWidth: 90
      },
      {
        Header: 'Percent Specified Algorithms',
        accessor: 'percent_specified_algorithms',
        resizeable: false,
        Cell: props => props.value,
        maxWidth: 150
      },
      {
        Header: 'Difficulty',
        accessor: 'difficulty',
        resizeable: false,
        Cell: props => props.value,
        maxWidth: 150
      },
      {
        Header: 'Percent Optimal',
        accessor: 'percent_reached_optimal',
        resizeable: false,
        Cell: props => props.value,
        maxWidth: 150
      }
    ];
  }

  tableOrEmptyMessage() {
    const { dataResults } = this.props
    let tableOrEmptyMessage
    const styles = {
      margin: '15px',
      padding: '15px',
      backgroundColor: 'darkgray',
      color: 'white'
    }

    if (dataResults.length) {
      tableOrEmptyMessage = (<ReactTable
        className='prompt-health-report'
        columns={this.columnDefinitions()}
        data={dataResults}
        defaultPageSize={dataResults.length}
        loading={false}
        manual={true}
        pages={1}
        resizable={false}
        showPageSizeOptions={false}
        showPagination={false}
        style={styles}
      />)
    } else {
      tableOrEmptyMessage = "Prompt data for this question could not be found. Refresh to try again."
    }
      return (
        <div>
          {tableOrEmptyMessage}
        </div>
      )
  }

  render() {
    return this.renderTable()
  }
}

export default PromptHealth
