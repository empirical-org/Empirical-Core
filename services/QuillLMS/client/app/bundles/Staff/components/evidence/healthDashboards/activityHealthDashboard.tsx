import * as React from "react";
import { useRef } from 'react';
import { useQuery } from 'react-query';
import { CSVLink } from 'react-csv';
import { firstBy } from 'thenby';


import { PromptHealthRows } from './promptHealthRow'

import { FlagDropdown, ReactTable, filterNumbers, expanderColumn } from '../../../../Shared/index'
import { fetchAggregatedActivityHealths } from '../../../utils/evidence/ruleFeedbackHistoryAPIs';
import { getLinkToActivity, secondsToHumanReadableTime, addCommasToThousands } from "../../../helpers/evidence/miscHelpers";

const ALL_FLAGS = "All Flags"
const NAME_COLUMN = "name"
const POOR_HEALTH_FLAG_COLUMN = "poor_health_flag"

const CustomTextFilter = ({ column, setFilter, placeholder }) => {
  return (
    <input
      aria-label="text-filter"
      onChange={event => setFilter(column.id, event.target.value)}
      placeholder={placeholder}
      style={{ width: "100%" }}
      value={column.filterValue}
    />
  )
}

const NumberFilter = ({ column, setFilter }) => (
  <CustomTextFilter
    column={column}
    placeholder="1-2, <1, >1"
    setFilter={setFilter}
  />
)

const TimeFilter = ({ column, setFilter }) => (
  <CustomTextFilter
    column={column}
    placeholder="in seconds: 1-2, <1, >1"
    setFilter={setFilter}
  />
)

const TrueFalseFilter = ({ column, setFilter }) => (
  <CustomTextFilter
    column={column}
    placeholder="1 / 0"
    setFilter={setFilter}
  />
)

export const ActivityHealthDashboard = ({ handleDashboardToggle }) => {
  const [flag, setFlag] = React.useState<string>(ALL_FLAGS)
  const [promptSearchInput, setPromptSearchInput] = React.useState<string>("")
  const [dataToDownload, setDataToDownload] = React.useState<Array<{}>>([])
  const [rows, setRows] = React.useState<Array<{}>>(null)
  const [poorHealthFlag, setPoorHealthFlag] = React.useState<boolean>(false)
  let csvLink = useRef(null);

  // get cached activity data to pass to rule
  const { data: activityHealthsData } = useQuery({
    queryKey: [`evidence-activity-healths`],
    queryFn: fetchAggregatedActivityHealths
  });

  React.useEffect(() => {
    if (dataToDownload.length > 0) {
      csvLink.link.click();
    }
  }, [dataToDownload]);

  React.useEffect(() => {
    if (activityHealthsData && activityHealthsData.activityHealths) {
      setRows(getFilteredData(activityHealthsData.activityHealths))
    }
  }, [activityHealthsData])

  const dataTableFields = [
    expanderColumn,
    {
      Header: 'Name',
      accessor: "name",
      key: "name",
      Filter: CustomTextFilter,
      filterAll: true,
      Cell: ({row}) => <span className="name"><a href={getLinkToActivity(row.original.activity_id)} rel="noopener noreferrer" target="_blank">{row.original.name}</a></span>, // eslint-disable-line react/display-name
      minWidth: 330,
      width: 330,
      maxWidth: 330
    },
    {
      Header: 'Version #',
      accessor: "version",
      key: "version",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: 'Version Plays',
      accessor: "version_plays",
      key: "versionPlays",
      Filter: NumberFilter,
      minWidth: 70,
      Cell: ({row}) => row.original.version_plays && <span className="versionPlays">{addCommasToThousands(row.original.version_plays)}</span>
    },
    {
      Header: 'Total Plays',
      accessor: "total_plays",
      key: "totalPlays",
      Filter: NumberFilter,
      minWidth: 70,
      Cell: ({row}) => row.original.total_plays && <span className="versionPlays">{addCommasToThousands(row.original.total_plays)}</span>
    },
    {
      Header: 'Completed Rate',
      accessor: "completion_rate",
      key: "completionRate",
      Filter: NumberFilter,
      minWidth: 80,
      Cell: ({row}) => row.original.completion_rate && <span className="name">{row.original.completion_rate}%</span>
    },
    {
      Header: 'Because Final Optimal',
      accessor: "because_final_optimal",
      key: "becauseFinalOptimal",
      Filter: NumberFilter,
      minWidth: 70,
      Cell: ({row}) => row.original.because_final_optimal && <span className={row.original.because_final_optimal <= 75 ? "poor-health" : "" + " name"}>{row.original.because_final_optimal}%</span>
    },
    {
      Header: 'But Final Optimal',
      accessor: "but_final_optimal",
      key: "butFinalOptimal",
      Filter: NumberFilter,
      minWidth: 70,
      Cell: ({row}) => row.original.but_final_optimal && <span className={row.original.but_final_optimal <= 75 ? "poor-health" : "" + " name"}>{row.original.but_final_optimal}%</span>
    },
    {
      Header: 'So Final Optimal',
      accessor: "so_final_optimal",
      key: "soFinalOptimal",
      Filter: NumberFilter,
      minWidth: 70,
      Cell: ({row}) => row.original.so_final_optimal && <span className={row.original.so_final_optimal <= 75 ? "poor-health" : "" + " name"}>{row.original.so_final_optimal}%</span>
    },
    {
      Header: 'Avg Time Spent - Activity',
      accessor: "avg_completion_time",
      key: "avgCompletionTime",
      Filter: TimeFilter,
      minWidth: 70,
      Cell: ({row}) => secondsToHumanReadableTime(row.original.avg_completion_time)
    },
    {
      Header: 'Poor Health Flag',
      accessor: "poor_health_flag",
      key: "poorHealthFlag",
      Filter: TrueFalseFilter,
      minWidth: 70,
      Cell: ({row}) => row.original.poor_health_flag === true && <span className="poor-health-flag">X</span>
    }
  ];

  const handleFlagChange = (e) => {setFlag(e.target.value)}
  const handleSearchByPrompt = (e) => {setPromptSearchInput(e.target.value)}
  const handlePoorHealthFlagToggle = () => {setPoorHealthFlag(!poorHealthFlag)}

  const getFilteredData = (data) => {
    if (!data) return []

    let filteredData = flag === ALL_FLAGS ? data : data.filter(data => data.flag === flag)

    if (!filteredData) return []
    filteredData = filteredData.filter(value => {
      return (
        value.name && value.name.toLowerCase().includes(promptSearchInput.toLowerCase())
      );
    })

    if (poorHealthFlag) {
      filteredData = filteredData.filter(value => value.poor_health_flag)
    }

    return filteredData
  }


  const getSortedRows = (rows, sortInfo) => {
    if (!sortInfo) return rows;

    const { id, desc } = sortInfo;
    // we have this reversed so that the first click will sort from highest to lowest by default
    const directionOfSort = desc ? 'asc' : 'desc';
    return rows.sort(firstBy(id, { direction: directionOfSort }));
  }

  const filterPoorHealthRows = (value, rows) => {
    if (value === '1') return rows.filter(r => r.poor_health_flag === true)
    else if (value === '0') return rows.filter(r => !r.poor_health_flag)
    else return rows
  }

  const filterRowsByColumnValue = (rows, column, value) => {
    if (value === '' || !value) return rows

    if (column === NAME_COLUMN) {
      return rows.filter(r => r.name.toLowerCase().includes(value.toLowerCase()))
    } else if (column === POOR_HEALTH_FLAG_COLUMN) {
      return filterPoorHealthRows(value, rows)
    } else {
      return filterNumbers(rows.map(r => {return {original: r}}), [column], value.replaceAll(',','')).map(r => r.original)
    }
  }

  const handleFiltersChange = (filters) => {
    if (!rows) return;
    let newRows = activityHealthsData.activityHealths
    filters.forEach((filter) => {
      const column = filter.id
      const value = filter.value

      newRows = filterRowsByColumnValue(activityHealthsData.activityHealths, column, value)
    })
    setRows(getFilteredData(newRows))
  }

  const handleDataUpdate = (sorted) => {
    const sortInfo = sorted[0];
    if (!sortInfo) return

    const sortedRows = getSortedRows(rows, sortInfo)
    const newIdSortedRows = sortedRows.map((r, i) => {
      r.id = i
      return r
    })
    setRows(getFilteredData(newIdSortedRows))
  }


  const formatTableForCSV = (e) => {
    if (!rows) return;

    const columns = dataTableFields
    let dataToDownload = []
    for (let index = 0; index < rows.length; index++) {
      let recordToDownload = {}
      for(let colIndex = 0; colIndex < columns.length ; colIndex ++) {
        recordToDownload[columns[colIndex].Header] = rows[index][columns[colIndex].accessor]
      }
      dataToDownload.push(recordToDownload)
    }

    // Convert seconds to human readable time
    let clonedDataToDownload = JSON.parse(JSON.stringify(dataToDownload));
    clonedDataToDownload.forEach(item=> {
      item["Avg Time Spent - Activity"] = item["Avg Time Spent - Activity"] ? secondsToHumanReadableTime(item["Avg Time Spent - Activity"]) : ''
    });

    setDataToDownload(clonedDataToDownload)
  }

  return(
    <div>
      <section className="header-section">
        <h2>Activities Health Dashboard</h2>
        <div className="first-input-row">
          <FlagDropdown flag={flag} handleFlagChange={handleFlagChange} isLessons={true} />
          <div className="right-side-div">
            <button className="switch-view" onClick={handleDashboardToggle} type="button">Switch to Prompt View</button>
            <div className="csv-download-button">
              <button onClick={formatTableForCSV} type="button">
                Download CSV
              </button>
            </div>
          </div>
        </div>

        <div className="second-input-row">
          <input
            aria-label="Search by prompt"
            className="search-box"
            name="searchInput"
            onChange={handleSearchByPrompt}
            placeholder="Search by prompt or activity name"
            value={promptSearchInput || ""}
          />
        </div>

        <div className="poor-health-filter">
          <input aria-label="poor-health-check" checked={poorHealthFlag} onChange={handlePoorHealthFlagToggle} type="checkbox" />
          <label className="poor-health-label" htmlFor="poor-health-check">Poor Health Flag</label>
        </div>

        <div>
          <CSVLink
            data={dataToDownload}
            filename="activity_health_report"
            ref={(c) => (csvLink = c)}
            rel="noopener noreferrer"
            target="_blank"
          />
        </div>
      </section>

      <section className="table-section">
        <ReactTable
          className="activity-healths-table"
          columns={dataTableFields}
          data={(rows && getFilteredData(rows)) || []}
          defaultPageSize={(rows && rows.length) || 0}
          filterable
          manualFilters
          manualSortBy
          onFiltersChange={handleFiltersChange}
          onSortedChange={handleDataUpdate}
          SubComponent={(row) => {
            return (
              <PromptHealthRows
                data={row.original && row.original.prompt_healths || []}
              />
            );
          }}
        />
      </section>
    </div>
  );

}

export default ActivityHealthDashboard
