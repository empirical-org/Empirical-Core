import * as React from 'react'
import ReactTable from 'react-table'
import { matchSorter } from 'match-sorter';
import 'react-table/react-table.css';
import request from 'request'
import _ from 'underscore'

import LoadingSpinner from '../shared/loading_indicator.jsx'
import { sort, sortByList } from '../../../../modules/sortingMethods.js'
import { FlagDropdown } from '../../../Shared/index'
import { selectColumnFilter } from '../../../../modules/filteringMethods.js'

const recentPlaysText = "Number of plays in the last 3 months if the activity's first play was more than 3 months ago"


class ActivityHealth extends React.Component<ComponentProps, any> {

  state = {
    loadingTableData: true,
    activityId: '',
    dataResults: [],
    activityHealthFlags: "All Flags"
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
    let activityPackUrl = `${process.env.DEFAULT_URL}/cms/unit_templates/`
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
        Header: "Recent Plays",
        accessor: 'recent_plays',
        filterMethod: (filter, row) => {
          let value = filter.value
          if (value.includes("-")) {
            let splitStr = filter.value.split("-")
            if (!isNaN(parseFloat(splitStr[0])) && !isNaN(parseFloat(splitStr[1]))) {
              return row[filter.id] >= splitStr[0] && row[filter.id] <= splitStr[1];
            } else {
              return true;
            }
          } else if (value.includes(">")) {
            let splitStr = filter.value.split(">")
            if (!isNaN(parseFloat(splitStr[1]))) {
              return row[filter.id] > splitStr[1]
            } else {
              return true;
            }
          } else if (value.includes("<")) {
            let splitStr = filter.value.split("<")
            if (!isNaN(parseFloat(splitStr[1]))) {
              return row[filter.id] < splitStr[1]
            } else {
              return true;
            }
          } else {
            return true;
          }
        },
        Filter: ({ filter, onChange }) =>
        <div
          style={{
            display: 'flex',
          }}
        >
          <input
            value={filter ? filter.value : ''}
            type="text"
            onChange={e =>
              onChange(e.target.value)
            }
            placeholder={`0-5, >1, <1`}
            style={{
              width: '100px',
              marginRight: '0.5rem',
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
              <div><a href={activityPackUrl + ap.id}>{ap.name}</a></div>
            ))
            }
          </div>
        ),
        maxWidth: 150
      },
      {
        Header: 'Average Time Spent',
        accessor: 'avg_completion_time',
        filterMethod: (filter, row) => {
          let splitStr = filter.value.split("-")
          if (!isNaN(parseFloat(splitStr[0])) && !isNaN(parseFloat(splitStr[1]))) {
            return row[filter.id] >= splitStr[0] && row[filter.id] <= splitStr[1];
          } else {
            return true;
          }
        },
        Filter: ({ filter, onChange }) =>
        <div
          style={{
            display: 'flex',
          }}
        >
          <input
            value={filter ? filter.value : ''}
            type="text"
            onChange={e =>
              onChange(e.target.value)
            }
            placeholder={`e.g. 0-30`}
            style={{
              width: '100px',
              marginRight: '0.5rem',
            }}
          />
        </div>
        ,
        resizeable: false,
        sortMethod: sort,
        Cell: props => props.value,
        maxWidth: 150
      },
      {
        Header: 'Average Difficulty',
        accessor: 'avg_difficulty',
        filterMethod: (filter, row) => {
          let splitStr = filter.value.split("-")
          if (!isNaN(parseFloat(splitStr[0])) && !isNaN(parseFloat(splitStr[1]))) {
            return row[filter.id] >= splitStr[0] && row[filter.id] <= splitStr[1];
          } else {
            return true;
          }
        },
        Filter: ({ filter, onChange }) =>
        <div
          style={{
            display: 'flex',
          }}
        >
          <input
            value={filter ? filter.value : ''}
            type="text"
            onChange={e =>
              onChange(e.target.value)
            }
            placeholder={`e.g. 0-5`}
            style={{
              width: '100px',
              marginRight: '0.5rem',
            }}
          />
        </div>
        ,
        resizeable: false,
        sortMethod: sort,
        Cell: props => props.value,
        maxWidth: 150
      },
      {
        Header: 'Standard Deviation Difficulty',
        accessor: 'std_dev_difficulty',
        filterMethod: (filter, row) => {
          let splitStr = filter.value.split("-")
          if (!isNaN(parseFloat(splitStr[0])) && !isNaN(parseFloat(splitStr[1]))) {
            return row[filter.id] >= splitStr[0] && row[filter.id] <= splitStr[1];
          } else {
            return true;
          }
        },
        Filter: ({ filter, onChange }) =>
        <div
          style={{
            display: 'flex',
          }}
        >
          <input
            value={filter ? filter.value : ''}
            type="text"
            onChange={e =>
              onChange(e.target.value)
            }
            placeholder={`e.g. 0-5`}
            style={{
              width: '100px',
              marginRight: '0.5rem',
            }}
          />
        </div>
        ,
        resizeable: false,
        sortMethod: sort,
        Cell: props => props.value,
        maxWidth: 150
      },
      {
        Header: 'Average Common Unmatched',
        accessor: 'avg_common_unmatched',
        filterMethod: (filter, row) => {
          let splitStr = filter.value.split("-")
          if (!isNaN(parseFloat(splitStr[0])) && !isNaN(parseFloat(splitStr[1]))) {
            return row[filter.id] >= splitStr[0] && row[filter.id] <= splitStr[1];
          } else {
            return true;
          }
        },
        Filter: ({ filter, onChange }) =>
        <div
          style={{
            display: 'flex',
          }}
        >
          <input
            value={filter ? filter.value : ''}
            type="text"
            onChange={e =>
              onChange(e.target.value)
            }
            placeholder={`e.g. 0-100`}
            style={{
              width: '100px',
              marginRight: '0.5rem',
            }}
          />
        </div>
        ,
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
      let filteredData = dataResults;
      if (this.state.activityHealthFlags !== 'All Flags') {
        filteredData = filteredData.filter(data => data.flag === this.state.activityHealthFlags)
      }
      tableOrEmptyMessage = (<ReactTable
        className='records-table'
        columns={this.columnDefinitions()}
        data={filteredData}
        defaultPageSize={dataResults.length}
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
      tableOrEmptyMessage = "Activity Health data could not be found. Refresh to try again, or contact the engineering team."
    }
      return (
        <div>
          {tableOrEmptyMessage}
        </div>
      )
  }

  handleSelect = (e) => {
    this.setState({ activityHealthFlags: e.target.value, });
  }

  render() {
    return (
      <section className="section">
        <div style={{display: 'inline-block'}}>
          <FlagDropdown flag={this.state.activityHealthFlags} handleFlagChange={this.handleSelect} isLessons={true} />
        </div>
        <div className="large-admin-container">
          <p className="menu-label">Activity Health</p>
          <div className="standard-columns">
          {this.renderTable()}
          </div>
        </div>
      </section>
    )
  }
}

export default ActivityHealth
