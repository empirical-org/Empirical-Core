import * as React from 'react'
import { matchSorter } from 'match-sorter';
import _ from 'underscore'
import stripHtml from "string-strip-html"
import { CSVLink } from 'react-csv'
import { connect } from 'react-redux';

import PromptHealth from './promptHealth'
import { NumberFilterInput } from './numberFilterInput'

import LoadingSpinner from '../shared/loading_indicator.jsx'
import { tableSort, sortTableByList } from '../../../../modules/sortingMethods.js'
import { FlagDropdown, ReactTable, expanderColumn, TextFilter, } from '../../../Shared/index'
import { filterNumbers } from '../../../../modules/filteringMethods.js'
import actions from '../../actions/activityHealth'
import { requestGet, } from '../../../../modules/request/index'

const CONNECT_TOOL = "connect"
const ACTIVITY_HEALTHS_URL = `${process.env.DEFAULT_URL}/api/v1/activities/activities_health.json`
const ALL_FLAGS = "All Flags"
const NO_DATA_FOUND_MESSAGE = "Activity Health data could not be found. Refresh to try again, or contact the engineering team."

interface ActivityHealthProps {
  dispatch: Function;
  activityHealth: {
    flag: string;
  }
}

interface ActivityHealthState {
  loadingTableData: boolean;
  flag: string;
  fetchedData: Array<Object>;
  promptSearchInput: string;
  dataToDownload: Array<Object>;
}

function addCommasToThousands(num)
{
  if (!num) return ""
  let num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

class ActivityHealth extends React.Component<ActivityHealthProps, ActivityHealthState> {

  state = {
    loadingTableData: true,
    flag: '',
    fetchedData: [],
    promptSearchInput: "",
    dataToDownload: []
  };

  componentDidMount() {
    this.fetchActivityHealthData();
  }

  shouldComponentUpdate(nextProps, nextState){
    return !(this.state === nextState)
  }

  columnDefinitions() {
    return [
      expanderColumn,
      {
        Header: 'Name',
        accessor: 'name',
        filter: (rows, idArray, filterValue) => {
          return matchSorter(rows, filterValue, { keys: ['original.name']})
        },
        Filter: TextFilter,
        filterAll: true,
        resizeable: true,
        minWidth: 200,
        sortType: tableSort,
        Cell: ({row}) => (<a href={row.original.url} rel="noopener noreferrer" target="_blank">{row.original.name}</a>)
      },
      {
        Header: 'Activity Categories',
        accessor: 'activity_categories',
        filter: (rows, idArray, filterValue) => {
          return matchSorter(rows, filterValue, { keys: ['original.activity_categories']})
        },
        filterAll: true,
        Filter: TextFilter,
        resizeable: true,
        sortType: sortTableByList,
        Cell: ({row}) => (
          <div>
            {
              row.original['activity_categories'] ?
                row.original['activity_categories'].map((ap) => (
                  <div key={ap}>{ap}</div>
                )) : ''
            }
          </div>
        )
      },
      {
        Header: 'Tool',
        accessor: 'tool',
        filter: (rows, idArray, filterValue) => {
          return rows.filter(row => {
            if (filterValue === "all") { return true }
            return row.original.tool === filterValue
          })
        },
        Filter: ({ column, setFilter, }) => (
          <select
            onChange={event => setFilter(column.id, event.target.value)}
            style={{ width: "100%" }}
            value={column.filterValue ? column.filterValue : "all"}
          >
            <option value="all">All</option>
            <option value="connect">Connect</option>
            <option value="grammar">Grammar</option>
          </select>
        ),
        resizeable: true,
        sortType: tableSort,
        minWidth: 90,
        Cell: props => this.getToolBadge(props.value)
      },
      {
        Header: 'Diagnostics',
        accessor: 'diagnostics',
        filter: (rows, idArray, filterValue) => {
          return matchSorter(rows, filterValue, { keys: ['original.diagnostics']})
        },
        filterAll: true,
        Filter: TextFilter,
        resizeable: true,
        sortType: sortTableByList,
        Cell: ({row}) => (
          <div>
            {
              row.original['diagnostics'] ?
                row.original['diagnostics'].map((diagnostic, index) => {
                  if (!diagnostic) return "";
                  else if (index != row.original['diagnostics'].length - 1) return <div key={diagnostic}>{diagnostic},</div>
                  else return <div key={diagnostic}>{diagnostic}</div>
                }) : ''
            }
          </div>
        ),
        minWidth: 180
      },
      {
        Header: "Plays in Last 3 Months",
        accessor: 'recent_plays',
        filter: filterNumbers,
        Filter: ({ column, setFilter }) =>
          (
            <NumberFilterInput
              column={column}
              handleChange={setFilter}
              label="Filter for recent plays"
            />
          ),
        resizeable: true,
        sortType: tableSort,
        Cell: props => addCommasToThousands(props.value),
        maxWidth: 90
      },
      {
        Header: 'Activity Packs',
        accessor: 'activity_packs',
        filter: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["activity_packs.*.name"] }),
        filterAll: true,
        Filter: TextFilter,
        resizeable: true,
        sortType: sortTableByList,
        Cell: ({row}) => (
          <div>
            {
              row.original['activity_packs'] ?
                row.original['activity_packs'].map((ap, index) => {
                  if (!ap.name) return "";
                  else if (index != row.original['activity_packs'].length - 1) return <div key={ap.id}>{ap.name},</div>
                  return <div key={ap.id}>{ap.name}</div>
                }) : ''
            }
          </div>
        ),
        minWidth: 180
      },
      {
        Header: 'Average Difficulty',
        accessor: 'avg_difficulty',
        filter: filterNumbers,
        Filter: ({ column, setFilter }) =>
          (
            <NumberFilterInput
              column={column}
              handleChange={setFilter}
              label="Filter for average difficulty"
            />
          ),
        resizeable: true,
        sortType: tableSort,
        Cell: props => props.value,
        maxWidth: 150
      },
      {
        Header: 'Standard Deviation Difficulty',
        accessor: 'standard_dev_difficulty',
        filter: filterNumbers,
        Filter: ({ column, setFilter }) =>
          (
            <NumberFilterInput
              column={column}
              handleChange={setFilter}
              label="Filter for recent plays"
            />
          ),
        resizeable: true,
        sortType: tableSort,
        Cell: props => props.value,
        maxWidth: 150
      },
      {
        Header: 'Average Common Unmatched',
        accessor: 'avg_common_unmatched',
        filter: filterNumbers,
        Filter: ({ column, setFilter }) =>
          (
            <NumberFilterInput
              column={column}
              handleChange={setFilter}
              label="Filter for avg common unmatched"
            />
          ),
        resizeable: true,
        sortType: tableSort,
        Cell: props => props.value,
        maxWidth: 150
      }
    ];
  }

  getToolBadge = (tool) => {
    if (tool === CONNECT_TOOL) {
      return (<div className="badge connect-badge">c</div>)
    }
    return (<div className="badge grammar-badge">g</div>)
  }

  formatTableForCSV = (e) => {
    const currentRecords = this.reactTable.getResolvedState().sortedData
    const columns = this.columnDefinitions()
    let dataToDownload = []
    for (let index = 0; index < currentRecords.length; index++) {
      let recordToDownload = {}
      for(let colIndex = 0; colIndex < columns.length ; colIndex ++) {
        recordToDownload[columns[colIndex].Header] = currentRecords[index][columns[colIndex].accessor]
      }
      dataToDownload.push(recordToDownload)
    }

    // Map Activity Packs to strings because JSON objects dont display in CSVs
    let clonedDataToDownload = JSON.parse(JSON.stringify(dataToDownload));
    clonedDataToDownload.forEach(item=> {
      item["Activity Packs"] = item["Activity Packs"] ? item["Activity Packs"].map(v => v.name) : ''
    });

    this.setState({ dataToDownload: clonedDataToDownload }, () => {
      this.csvLink.link.click();
    })
  }

  handleFlagChange = (e) => {
    const { dispatch } = this.props
    dispatch(actions.setFlag(e.target.value))

    // this is a dummy action, we dont use the state value but we need to trigger a re-render
    this.setState({flag: e.target.value})
  }

  handleSearchByPrompt = (e) => {
    this.setState({ promptSearchInput: e.target.value })
  }

  fetchActivityHealthData() {
    this.setState({ loadingTableData: true })
    requestGet(
      ACTIVITY_HEALTHS_URL,
      (body) => {
        const data = JSON.parse(body);
        this.setState({
          loadingTableData: false,
          fetchedData: data.activities_health
        })
      },
      (body) => {
        this.setState({
          loadingTableData: false,
          dataResults: [],
        })
      }
    );
  }

  getFilteredData() {
    const { activityHealth } = this.props
    const { fetchedData, promptSearchInput } = this.state

    let filteredData = activityHealth.flag === ALL_FLAGS ? fetchedData : fetchedData.filter(data => data.flag === activityHealth.flag)
    filteredData = filteredData.filter(value => {
      return (
        value.prompt_healths && value.prompt_healths.map(x => x.text || '').some(y => stripHtml(y).toLowerCase().includes(promptSearchInput.toLowerCase()))
      );
    })
    return filteredData
  }

  tableOrEmptyMessage() {
    const { fetchedData } = this.state

    let tableOrEmptyMessage

    if (fetchedData) {
      let dataToUse = this.getFilteredData()
      tableOrEmptyMessage = (<ReactTable
        className='records-table'
        columns={this.columnDefinitions()}
        data={dataToUse}
        defaultSorted={[{id: 'name', desc: false}]}
        filterable
        SubComponent={(row) => {
          return (
            <PromptHealth
              dataResults={row.original && row.original.prompt_healths || []}
            />
          );
        }}
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

  renderTable() {
    const { loadingTableData } = this.state
    if(loadingTableData) {
      return <LoadingSpinner />
    }
    return (this.tableOrEmptyMessage())
  }

  render() {
    const { activityHealth } = this.props
    const { promptSearchInput, dataToDownload } = this.state
    return (
      <section className="section">
        <div className="activity-health-filters">
          <div style={{display: 'inline-block', marginLeft: '10px', float: 'left'}}>
            <FlagDropdown flag={activityHealth.flag} handleFlagChange={this.handleFlagChange} isLessons={true} />
            <input
              aria-label="Search by prompt"
              className="search-box"
              name="searchInput"
              onChange={this.handleSearchByPrompt}
              placeholder="Search by prompt"
              value={promptSearchInput || ""}
            />
          </div>
          <div>
            <div className="csv-download-button">
              <button onClick={this.formatTableForCSV} style={{cursor: 'pointer'}} type="button">
                  Download CSV
              </button>
            </div>
            <div>
              <CSVLink
                data={dataToDownload}
                filename="activity_health_report"
                ref={(r) => this.csvLink = r}
                rel="noopener noreferrer"
                target="_blank"
              />
            </div>
          </div>
        </div>

        <div className="activity-health-table">
          <div className="standard-columns">
            {this.renderTable()}
          </div>
        </div>
      </section>
    )
  }
}

function select(state) {
  return {
    activityHealth: state.activityHealth
  };
}

export default connect(select)(ActivityHealth)
