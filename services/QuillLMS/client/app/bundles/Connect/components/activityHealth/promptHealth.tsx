import * as React from 'react'
import ReactTable from 'react-table-6'
;
import stripHtml from "string-strip-html";
import _ from 'underscore'

interface PromptHealthProps {
  dataResults: Array<Object>;
}

interface PromptHealthState {
}

const NO_DATA_FOUND_MESSAGE = "Prompt data for this question could not be found. Refresh to try again."

class PromptHealth extends React.Component<PromptHealthProps, PromptHealthState> {

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
        Cell: cell => (<a href={cell.original.url} rel="noopener noreferrer" style={{color: 'mediumSeaGreen'}} target="_blank">{stripHtml(cell.original.text)}</a>),
        style: { 'whiteSpace': 'unset' }
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
        Header: 'Percent Reached Optimal',
        accessor: 'percent_reached_optimal',
        resizeable: true,
        Cell: props => props.value
      }
    ];
  }

  tableOrEmptyMessage() {
    const { dataResults } = this.props
    let tableOrEmptyMessage

    if (dataResults.length) {
      tableOrEmptyMessage = (<ReactTable
        className='prompt-health-table'
        collapseOnDataChange={false}
        columns={this.columnDefinitions()}
        data={dataResults}
        defaultPageSize={dataResults.length}
        loading={false}
        pages={1}
        showPageSizeOptions={false}
        showPagination={false}
      />)
    } else {
      tableOrEmptyMessage = NO_DATA_FOUND_MESSAGE
    }
    return (
      <div>
        {tableOrEmptyMessage}
      </div>
    )
  }

  render() {
    return (
      <div className="standard-columns">
        {this.renderTable()}
      </div>
    )
  }
}

export default PromptHealth
