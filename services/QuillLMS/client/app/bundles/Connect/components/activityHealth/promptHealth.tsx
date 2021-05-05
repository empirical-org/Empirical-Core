import * as React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css';
import request from 'request'
import stripHtml from "string-strip-html";
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
        minWidth: 400,
        Cell: cell => (<a href={cell.original.url} style={{color: 'mediumSeaGreen'}} target="_blank">{stripHtml(cell.original.text)}</a>)
      },
      {
        Header: 'Flag',
        accessor: 'flag',
        resizeable: true,
        Cell: props => props.value
      },
      {
        Header: 'Incorrect Sequences',
        accessor: 'incorrect_sequences',
        resizeable: true,
        Cell: props => props.value
      },
      {
        Header: 'Focus Points',
        accessor: 'focus_points',
        resizeable: true,
        Cell: props => props.value
      },
      {
        Header: 'Percent Common Unmatched',
        accessor: 'percent_common_unmatched',
        resizeable: true,
        Cell: props => props.value
      },
      {
        Header: 'Percent Specified Algorithms',
        accessor: 'percent_specified_algorithms',
        resizeable: true,
        Cell: props => props.value
      },
      {
        Header: 'Difficulty',
        accessor: 'difficulty',
        resizeable: true,
        Cell: props => props.value
      },
      {
        Header: 'Percent Optimal',
        accessor: 'percent_reached_optimal',
        resizeable: true,
        Cell: props => props.value
      }
    ];
  }

  tableOrEmptyMessage() {
    const { dataResults } = this.props
    let tableOrEmptyMessage
    const styles = {
      margin: '15px',
      padding: '15px',
      backgroundColor: 'lightgray',
      borderRadius: '5px'
    }

    if (dataResults.length) {
      tableOrEmptyMessage = (<ReactTable
        className='prompt-health-report'
        columns={this.columnDefinitions()}
        collapseOnDataChange={false}
        data={dataResults}
        defaultPageSize={dataResults.length}
        loading={false}
        pages={1}
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
    console.log("re rendering")
    return (
      <div className="standard-columns">
        {this.renderTable()}
      </div>
    )
  }
}

export default PromptHealth
