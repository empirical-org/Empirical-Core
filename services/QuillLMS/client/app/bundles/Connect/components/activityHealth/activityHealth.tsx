import * as React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css';
import request from 'request'
import _ from 'underscore'

import LoadingSpinner from '../shared/loading_indicator.jsx'

class ActivityHealth extends React.Component<ComponentProps, any> {

  state = {
    loadingTableData: true,
    activityId: '',
    dataResults: []
  };

  componentDidMount() {
    this.fetchQuestionData();
  }

  renderTable() {
    const { loadingTableData } = this.state
    if(loadingTableData) {
      return <LoadingSpinner />
    }
    return (this.tableOrEmptyMessage())
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
        accessor: 'number_of_incorrect_sequences',
        resizeable: false,
        Cell: props => props.value
      },
      {
        Header: 'Focus Points',
        accessor: 'number_of_focus_points',
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

  fetchQuestionData() {
    const { activityId } = this.state
    this.setState({ loadingNewTableData: true });
    request.get({
      // url: `${process.env.DEFAULT_URL}/api/v1/activities/${activityId}/question_health`
      url: 'https://cissy-test-endpoint.free.beeceptor.com/',
    }, (e, r, body) => {
      let newState = {}
      if (e || r.statusCode != 200) {
        newState = {
          loadingTableData: false,
          dataResults: [],
        }
      } else {
        const data = JSON.parse(body);
        newState = {
          loadingTableData: false,
          dataResults: data.question_health,
        };
      }

      this.setState(newState);
    });
  }

  tableOrEmptyMessage() {
    const { dataResults } = this.state
    let tableOrEmptyMessage

    if (dataResults.length) {
      tableOrEmptyMessage = (<ReactTable
        className='progress-report'
        columns={this.columnDefinitions()}
        data={dataResults}
        defaultPageSize={Math.min(dataResults.length, 25)}
        loading={false}
        manual={true}
        pages={1}
        resizable={false}
        showPageSizeOptions={false}
        showPagination={false}
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
    return (
      <section className="section">
        <div className="admin-container">
          <p className="menu-label">Activity Health</p>
          {this.renderTable()}
        </div>
      </section>
    )
  }
}

export default ActivityHealth
