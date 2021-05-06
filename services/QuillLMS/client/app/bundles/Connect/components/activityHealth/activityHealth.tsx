import * as React from 'react'
import ReactTable from 'react-table'
import { matchSorter } from 'match-sorter';
import 'react-table/react-table.css';
import request from 'request'
import _ from 'underscore'
import stripHtml from "string-strip-html"
import { CSVLink } from 'react-csv'
import { connect } from 'react-redux';

import PromptHealth from './promptHealth'
import NumberFilterInput from './numberFilterInput'

import LoadingSpinner from '../shared/loading_indicator.jsx'
import { sort, sortByList } from '../../../../modules/sortingMethods.js'
import { FlagDropdown } from '../../../Shared/index'
import { filterNumbers } from '../../../../modules/filteringMethods.js'
import actions from '../../actions/activityHealth'

const CONNECT_TOOL = "connect"
const ACTIVITY_HEALTHS_URL = `${process.env.DEFAULT_URL}/api/v1/activities/activities_health.json`

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
    return !(this.state == nextState)
  }

  columnDefinitions() {
    return [
      {
        Header: 'Name',
        accessor: 'name',
        filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["name"]}),
        filterAll: true,
        resizeable: true,
        minWidth: 200,
        sortMethod: sort,
        Cell: cell => (<a href={cell.original.url} rel="noopener noreferrer" target="_blank">{cell.original.name}</a>)
      },
      {
        Header: 'Activity Categories',
        accessor: 'activity_categories',
        filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["activity_categories"] }),
        filterAll: true,
        resizeable: true,
        sortMethod: sortByList,
        Cell: (row) => (
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
        filterMethod: (filter, row) => {
          if (filter.value === "all") {
            return true;
          }
          else {
            return row[filter.id] === filter.value
          }
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: "100%" }}
            value={filter ? filter.value : "all"}
          >
            <option value="all">All</option>
            <option value="connect">Connect</option>
            <option value="grammar">Grammar</option>
          </select>
        ),
        resizeable: true,
        sortMethod: sort,
        minWidth: 90,
        Cell: props => this.getToolBadge(props.value)
      },
      {
        Header: 'Diagnostics',
        accessor: 'diagnostics',
        filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["diagnostics"] }),
        filterAll: true,
        resizeable: true,
        sortMethod: sortByList,
        Cell: (row) => (
          <div>
            {
            row.original['diagnostics'] ?
            row.original['diagnostics'].map((diagnostic, index) => {
              if (!diagnostic) return "";
              else if (index != row.original['diagnostics'].length - 1) return <div key={diagnostic}>{diagnostic},</div>
              else return <div key={diagnostic}>{diagnostic}</div>
            }
            ) : ''
            }
          </div>
        ),
        minWidth: 180
      },
      {
        Header: "Plays in Last 3 Months",
        accessor: 'recent_plays',
        filterMethod: filterNumbers,
        Filter: ({ filter, onChange }) =>
          (
            <NumberFilterInput
              filter={filter}
              handleChange={onChange}
              label="Filter for recent plays"
            />
          ),
        resizeable: true,
        sortMethod: sort,
        Cell: props => this.addCommasToThousands(props.value),
        maxWidth: 90
      },
      {
        Header: 'Activity Packs',
        accessor: 'activity_packs',
        filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["activity_packs.*.name"] }),
        filterAll: true,
        resizeable: true,
        sortMethod: sortByList,
        Cell: (row) => (
          <div>
            {
            row.original['activity_packs'] ?
            row.original['activity_packs'].map((ap, index) => {
              if (!ap.name) return "";
              else if (index != row.original['activity_packs'].length - 1) return <div key={ap.id}>{ap.name},</div>
              else return <div key={ap.id}>{ap.name}</div>
            }
            ) : ''
            }
          </div>
        ),
        minWidth: 180
      },
      {
        Header: 'Average Difficulty',
        accessor: 'avg_difficulty',
        filterMethod: filterNumbers,
        Filter: ({ filter, onChange }) =>
        (
          <NumberFilterInput
            filter={filter}
            handleChange={onChange}
            label="Filter for average difficulty"
          />
        ),
        resizeable: true,
        sortMethod: sort,
        Cell: props => props.value,
        maxWidth: 150
      },
      {
        Header: 'Standard Deviation Difficulty',
        accessor: 'standard_dev_difficulty',
        filterMethod: filterNumbers,
        Filter: ({ filter, onChange }) =>
        (
          <NumberFilterInput
            filter={filter}
            handleChange={onChange}
            label="Filter for recent plays"
          />
        ),
        resizeable: true,
        sortMethod: sort,
        Cell: props => props.value,
        maxWidth: 150
      },
      {
        Header: 'Average Common Unmatched',
        accessor: 'avg_common_unmatched',
        filterMethod: filterNumbers,
        Filter: ({ filter, onChange }) =>
        (
          <NumberFilterInput
            filter={filter}
            handleChange={onChange}
            label="Filter for avg common unmatched"
          />
        ),
        resizeable: true,
        sortMethod: sort,
        Cell: props => props.value,
        maxWidth: 150
      }
    ];
  }

  addCommasToThousands = (num) =>
  {
    if (!num) return ""
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }

  getToolBadge = (tool) => {
    if (tool === CONNECT_TOOL) {
      return (<div className="badge connect-badge">c</div>)
    } else {
      return (<div className="badge grammar-badge">g</div>)
    }
  }

  formatTableForCSV = (e) => {
    const currentRecords = this.reactTable.getResolvedState().sortedData
    const columns = this.columnDefinitions()
    let dataToDownload = []
    for (var index = 0; index < currentRecords.length; index++) {
       let recordToDownload = {}
       for(var colIndex = 0; colIndex < columns.length ; colIndex ++) {
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
    request.get({
      url: ACTIVITY_HEALTHS_URL,
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
          fetchedData: data.activities_health
        };
      }
      this.setState(newState)
    });
  }

  getFilteredData() {
    const { activityHealth } = this.props
    const { fetchedData, promptSearchInput } = this.state

    let filteredData = activityHealth.flag === 'All Flags' ? fetchedData : fetchedData.filter(data => data.flag === activityHealth.flag)
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
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]) === filter.value}
        defaultPageSize={dataToUse.length}
        defaultSorted={[{id: 'name', desc: false}]}
        filterable
        loading={false}
        pages={1}
        ref={(r) => this.reactTable = r}
        showPageSizeOptions={false}
        showPagination={false}
        style={{height: "600px"}}
        SubComponent={row => {
          return (
            <PromptHealth
              dataResults={row.original.prompt_healths}
            />
          );
        }}
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
