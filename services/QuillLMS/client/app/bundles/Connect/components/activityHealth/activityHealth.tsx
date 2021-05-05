import * as React from 'react'
import ReactTable from 'react-table'
import { matchSorter } from 'match-sorter';
import 'react-table/react-table.css';
import request from 'request'
import _ from 'underscore'
import stripHtml from "string-strip-html"
import { CSVLink } from 'react-csv'
import { connect } from 'react-redux';

import LoadingSpinner from '../shared/loading_indicator.jsx'
import { sort, sortByList } from '../../../../modules/sortingMethods.js'
import { FlagDropdown } from '../../../Shared/index'
import PromptHealth from './promptHealth'
import { filterNumbers } from '../../../../modules/filteringMethods.js'
import actions from '../../actions/activityHealth'
import { getDataFromTree } from 'react-apollo';
import activity from '../../../Staff/components/comprehension/activity.js';

const recentPlaysText = "Number of plays in the last 3 months if the activity's first play was more than 3 months ago"


class ActivityHealth extends React.Component<ComponentProps, any> {

  state = {
    loadingTableData: true,
    flag: 'All Flags',
    activityId: '',
    fetchedData: [],
    searchInput: "",
    dataToDownload: []
  };

  shouldComponentUpdate(nextProps, nextState){
    console.log(nextState)
    console.log(this.state)
    console.log(this.state == nextState)
    return !(this.state == nextState)// equals() is your implementation
  }

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

  thousands_separators = (num) =>
  {
    if (!num) return ""
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }

  badge = (tool) => {
    if (tool === 'connect') {
      return (<div className="btn btn-connect">c</div>)
    } else {
      return (<div className="btn btn-grammar">g</div>)
    }
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
        Cell: cell => (<a href={cell.original.url} target="_blank">{cell.original.name}</a>),
        style: { 'whiteSpace': 'unset' }
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
        Cell: props => this.badge(props.value)
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
            row.original['diagnostics'].map((diagnostic, index) => {
              if (!diagnostic) return "";
              else if (index != row.original['diagnostics'].length - 1) return <div>{diagnostic},</div>
              else return <div>{diagnostic}</div>
            }
            )
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
        Cell: props => this.thousands_separators(props.value),
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
            row.original['activity_packs'].map((ap, index) => {
              if (!ap.name) return "";
              else if (index != row.original['activity_packs'].length - 1) return <div>{ap.name},</div>
              else return <div>{ap.name}</div>
            }
            )
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
            placeholder={`e.g. 0-5, >5, <5`}
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
        accessor: 'standard_dev_difficulty',
        filterMethod: filterNumbers,
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
            placeholder={`e.g. 0-5, >5, <5`}
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
        filterMethod: filterNumbers,
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
            placeholder={`e.g. 0-100, <10, >10`}
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
    this.setState({ loadingNewTableData: true }, () => (console.log("setting loadingNewTableData")));
    request.get({
      url: 'https://www.quill.org/api/v1/activities/activities_health.json',
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

      this.setState(newState, () => (console.log("setting fetchedData")));
    });
  }

  download = (event) => {
    const currentRecords = this.reactTable.getResolvedState().sortedData;
    var data_to_download = []
    for (var index = 0; index < currentRecords.length; index++) {
       let record_to_download = {}
       let columns = this.columnDefinitions()
       for(var colIndex = 0; colIndex < columns.length ; colIndex ++) {
          record_to_download[columns[colIndex].Header] = currentRecords[index][columns[colIndex].accessor]
       }
       data_to_download.push(record_to_download)
    }
    let clonedData = JSON.parse(JSON.stringify(data_to_download));
    clonedData.forEach(item=> {
      item["Activity Packs"] = item["Activity Packs"].map(v => v.name)
    });
    this.setState({ dataToDownload: clonedData }, () => {
       // click the CSVLink component to trigger the CSV download
       this.csvLink.link.click();
       console.log("setting data to download")
    })
  }

  tableOrEmptyMessage() {
    console.log(" re rendering table")
    const { fetchedData } = this.state

    let tableOrEmptyMessage

    if (fetchedData) {
      let dataToUse = this.getFilteredData()
      tableOrEmptyMessage = (<ReactTable ref={(r) => this.reactTable = r}
        autoResetExpanded={false}
        className='records-table'
        columns={this.columnDefinitions()}
        data={dataToUse}
        defaultPageSize={dataToUse.length}
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
        style={{
          height: "600px"
        }}
        SubComponent={row => {
          console.log(row.original.prompt_healths)
          return (
            <PromptHealth
            dataResults={row.original.prompt_healths}/>
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

  getFilteredData() {
    const { activityHealth } = this.props
    const flag = activityHealth.flag
    console.log(flag)
    const { fetchedData, searchInput } = this.state
    let filteredByFlags = flag === 'All Flags' ? fetchedData : fetchedData.filter(data => data.flag === flag)
    let filteredByFlagsAndPrompt = filteredByFlags.filter(value => {
      return (
        value.prompt_healths.map(x => x.text || '').some(y => stripHtml(y).toLowerCase().includes(searchInput.toLowerCase()))
      );
    })
    return filteredByFlagsAndPrompt
  }

  handleSelect = (e) => {
    const { dispatch } = this.props
    dispatch(actions.setFlag(e.target.value))
    this.setState({flag: e.target.value})
  }

  handleSearch = (e) => {
    this.setState({ searchInput: e.target.value }, () => (console.log("setting search input")))
  }

  render() {
    const { activityHealth } = this.props
    const { searchInput } = this.state
    return (
      <section className="section">
        <div style={{display: 'inline-block', width: '100%'}}>
        <div style={{display: 'inline-block', marginLeft: '10px', float: 'left'}}>
          <FlagDropdown flag={activityHealth.flag} handleFlagChange={this.handleSelect} isLessons={true} />
          <input
          name="searchInput"
          value={searchInput || ""}
          placeholder="Search by prompt"
          onChange={this.handleSearch}
          style={{border: "1px solid rgba(0,0,0,0.1)",
            background: "#fff",
            padding: "5px 7px",
            fontSize: "inherit",
            borderRadius: "3px",
            fontWeight: "normal",
            outlineWidth: "0",
            marginTop: "10px",
            width: "700px"}}
        />
        </div>
        <div>
        <div style = {{
          display: "inline-block",
          float: "right",
          border: "1px solid rgba(0,0,0,0.1)",
          background: "#fff",
          padding: "5px 7px",
          fontSize: "inherit",
          borderRadius: "3px",
          fontWeight: "normal",
          outlineWidth: "0",
          cursor: 'pointer'
        }
        }>
        <button style={{cursor: 'pointer'}}onClick={this.download}>
            Download CSV
        </button>
        </div>
        <div>
        <CSVLink
          data={this.state.dataToDownload}
          filename="activity_health_report"
          ref={(r) => this.csvLink = r}
          target="_blank" />
        </div>

        </div>
        </div>

        <div className="large-admin-container">
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
