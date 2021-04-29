import * as React from 'react'
import ReactTable from 'react-table'
import { matchSorter } from 'match-sorter';
import 'react-table/react-table.css';
import request from 'request'
import _ from 'underscore'

import LoadingSpinner from '../shared/loading_indicator.jsx'
import { sort, sortByList } from '../../../../modules/sortingMethods.js'
import { selectColumnFilter } from '../../../../modules/filteringMethods.js'

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
        Header: 'Name',
        accessor: 'name',
        filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["name"] }),
        filterAll: true,
        resizeable: true,
        minWidth: 200,
        sortMethod: sort,
        Cell: cell => (<a href={cell.original.url}>{cell.original.name}</a>)
      },
      {
        Header: 'Activity Categories',
        accessor: 'activity_categories',
        filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["activity_categories"] }),
        filterAll: true,
        resizeable: false,
        sortMethod: sortByList,
        Cell: (row) => (
          <div>
            {
            row.original['activity_categories'].map((ap) => (
              <div>{ap}</div>
            ))
            }
          </div>
        )
      },
      {
        Header: 'Tool',
        accessor: 'tool',
        filterMethod: (filter, row) => {
          if (filter.value === "all") {
            return true;
          }
          else {
            return row[filter.id] === filter.value
          }
        },
        Filter: ({ filter, onChange }) =>
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: "100%" }}
            value={filter ? filter.value : "all"}
          >
            <option value="all">All</option>
            <option value="connect">Connect</option>
            <option value="grammar">Grammar</option>
          </select>,
        resizeable: false,
        sortMethod: sort,
        minWidth: 90,
        Cell: props => props.value
      },
      {
        Header: 'Recent Plays',
        accessor: 'recent_plays',
        filterMethod: (filter, row, third, fourth) => {
          console.log(filter.value)
          console.log(row)
          console.log(third)
          console.log(fourth)
          if (filter.box === "min") {
            return row[filter.id] >= filter.value
          } else {
            return row[filter.id] <= filter.value
          }
        },
        Filter: ({ filter, onChange }) =>
        <div
          style={{
            display: 'flex',
          }}
        >
          <input
            value={filter || ''}
            type="number"
            onChange={e =>
              onChange({value: parseInt(e.target.value), box: "min"})
            }
            placeholder={`Min (0)`}
            style={{
              width: '70px',
              marginRight: '0.5rem',
            }}
          />
          to
          <input
            value={filter || ''}
            type="number"
            onChange={e => {
              const val = e.target.value
              onChange((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
            }}
            placeholder={`Max (10000)`}
            style={{
              width: '70px',
              marginLeft: '0.5rem',
            }}
          />
        </div>
        ,
        resizeable: false,
        sortMethod: sort,
        Cell: props => props.value,
        maxWidth: 90
      },
      {
        Header: 'Diagnostics',
        accessor: 'diagnostics',
        filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["diagnostics"] }),
        filterAll: true,
        resizeable: false,
        sortMethod: sortByList,
        Cell: (row) => (
          <div>
            {
            row.original['diagnostics'].map((diagnostic) => (
              <div>{diagnostic}</div>
            ))
            }
          </div>
        ),
        maxWidth: 90
      },
      {
        Header: 'Activity Packs',
        accessor: 'activity_packs',
        filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["activity_packs.*.name"] }),
        filterAll: true,
        resizeable: false,
        sortMethod: sortByList,
        Cell: (row) => (
          <div>
            {
            row.original['activity_packs'].map((ap) => (
              <div><a href='quill.org/unit_templates/${ap.id}'>{ap.name}</a></div>
            ))
            }
          </div>
        ),
        maxWidth: 150
      },
      {
        Header: 'Average Time to Complete',
        accessor: 'avg_completion_time',
        resizeable: false,
        sortMethod: sort,
        Cell: props => props.value,
        maxWidth: 150
      },
      {
        Header: 'Average Difficulty',
        accessor: 'avg_difficulty',
        resizeable: false,
        sortMethod: sort,
        Cell: props => props.value,
        maxWidth: 150
      },
      {
        Header: 'Standard Deviation Difficulty',
        accessor: 'std_dev_difficulty',
        resizeable: false,
        sortMethod: sort,
        Cell: props => props.value,
        maxWidth: 150
      },
      {
        Header: 'Average Common Unmatched',
        accessor: 'avg_common_unmatched',
        resizeable: false,
        sortMethod: sort,
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
        console.log(data)
        newState = {
          loadingTableData: false,
          dataResults: data.activity_health,
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
        className='progress-report has-green-arrow'
        columns={this.columnDefinitions()}
        data={dataResults}
        defaultPageSize={Math.min(dataResults.length, 25)}
        defaultSorted={[{id: 'name', desc: false}]}
        filterable
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]) === filter.value}
        loading={false}
        pages={1}
        showPageSizeOptions={false}
        showPagination={false}
        showPaginationBottom={false}
        showPaginationTop={false}
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
