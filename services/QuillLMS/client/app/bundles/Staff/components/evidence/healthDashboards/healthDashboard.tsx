import * as React from "react";
import { useRef } from 'react';
import { useQuery } from 'react-query';
import { matchSorter } from 'match-sorter';
import { CSVLink } from 'react-csv';
import { firstBy } from 'thenby';


import Navigation from '../navigation'
import { tableSort, sortTableByList } from '../../../../../../app/modules/sortingMethods.js'
import { FlagDropdown, ReactTable, expanderColumn, CustomTextFilter, TextFilter, NumberFilterInput, filterNumbers } from '../../../../Shared/index'
import { fetchActivityHealths, fetchPromptHealth } from '../../../utils/evidence/ruleFeedbackHistoryAPIs';

const ALL_FLAGS = "All Flags"
const NO_DATA_FOUND_MESSAGE = "No data yet for Evidence Activity Healths."

function addCommasToThousands(num)
{
  if (!num) return ""
  let num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

function getLinkToActivity(id) {
  return `${process.env.DEFAULT_URL}/cms/evidence#/activities/${id}/settings`
}

export const HealthDashboard = ({ location, match }) => {
  const [flag, setFlag] = React.useState<string>(ALL_FLAGS)
  const [promptSearchInput, setPromptSearchInput] = React.useState<string>("")
  const [dataToDownload, setDataToDownload] = React.useState<Array<{}>>([])
  const [rows, setRows] = React.useState<Array<{}>>(null)
  let reactTable = useRef(null);
  let csvLink = useRef(null);

  React.useEffect(() => {
    if (dataToDownload.length > 0) {
      csvLink.link.click();
    }
  }, [dataToDownload]);

  // get cached activity data to pass to rule
  const { data: activityHealthsData } = useQuery({
    queryKey: [`evidence-activity-healths`],
    queryFn: fetchActivityHealths
  });

  React.useEffect(() => {
    if (activityHealthsData && activityHealthsData.activityHealths) {
      console.log("got new activity healths")
      console.log(activityHealthsData.activityHealths)
      setRows(getFilteredData(activityHealthsData.activityHealths))
    }
  }, [activityHealthsData])

  const dataTableFields = [
    {
      Header: 'Name',
      accessor: "name",
      key: "name",
      filter: (rows, idArray, filterValue) => {
        return matchSorter(rows, filterValue, { keys: ['original.name']})
      },
      Filter: TextFilter,
      filterAll: true,
      Cell: ({row}) => <span className="name"><a href={getLinkToActivity(row.original.activity_id)} rel="noopener noreferrer" target="_blank">{row.original.name}</a></span> // eslint-disable-line react/display-name
    },
    {
      Header: 'Version #',
      accessor: "version",
      key: "version",
      filter: filterNumbers,
      Filter: TextFilter,
      width: 80,
    },
    {
      Header: 'Version Plays',
      accessor: "version_plays",
      key: "versionPlays",
      filter: filterNumbers,
      Filter: TextFilter,
      width: 80,
      Cell: ({row}) => <span className="versionPlays">{addCommasToThousands(row.original.version_plays)}</span>
    },
    {
      Header: 'Total Plays',
      accessor: "total_plays",
      key: "totalPlays",
      filter: filterNumbers,
      Filter: TextFilter,
      width: 80,
      Cell: ({row}) => <span className="versionPlays">{addCommasToThousands(row.original.total_plays)}</span>
    },
    {
      Header: 'Completion Rate',
      accessor: "completion_rate",
      key: "completionRate",
      filter: filterNumbers,
      Filter: TextFilter,
      width: 80,
      Cell: ({row}) => row.original.completion_rate && <span className="name">{row.original.completion_rate}%</span>
    },
    {
      Header: 'Because Final Optimal',
      accessor: "because_final_optimal",
      key: "becauseFinalOptimal",
      filter: filterNumbers,
      Filter: TextFilter,
      width: 80,
      Cell: ({row}) => row.original.because_final_optimal && <span className="name">{row.original.because_final_optimal}%</span>
    },
    {
      Header: 'But Final Optimal',
      accessor: "but_final_optimal",
      key: "butFinalOptimal",
      filter: filterNumbers,
      Filter: TextFilter,
      width: 80,
      Cell: ({row}) => row.original.but_final_optimal && <span className="name">{row.original.but_final_optimal}%</span>
    },
    {
      Header: 'So Final Optimal',
      accessor: "so_final_optimal",
      key: "soFinalOptimal",
      filter: filterNumbers,
      Filter: TextFilter,
      width: 80,
      Cell: ({row}) => row.original.so_final_optimal && <span className="name">{row.original.so_final_optimal}%</span>
    },
    {
      Header: 'Avg Time Spent - Activity',
      accessor: "avg_completion_time",
      key: "avgCompletionTime",
      filter: filterNumbers,
      Filter: CustomTextFilter,
      width: 160,
    }
  ];

  const handleFlagChange = (e) => {setFlag(e.target.value)}
  const handleSearchByPrompt = (e) => {setPromptSearchInput(e.target.value)}

  const getFilteredData = (data) => {
    console.log("getting filtered data")
    console.log(data)
    if (!data || !data.activity_healths) return []

    let filteredData = flag === ALL_FLAGS ? data.activity_healths : data.activity_healths.filter(data => data.flag === flag)

    if (!filteredData) return []
    filteredData = filteredData.filter(value => {
      return (
        value.name && value.name.toLowerCase().includes(promptSearchInput.toLowerCase())
        // value.prompt_healths && value.prompt_healths.map(x => x.text || '').some(y => stripHtml(y).toLowerCase().includes(promptSearchInput.toLowerCase()))
      );
    })
    console.log("filtered data is")
    filteredData = {activity_healths: filteredData}
    console.log(filteredData)
    return filteredData
  }

  // const tableOrEmptyMessage = () => {
  //   const fetchedData = activityHealthsData && activityHealthsData.activityHealths

  //   let tableOrEmptyMessage

  //   if (fetchedData) {

  //     tableOrEmptyMessage = (

  //   } else {
  //     tableOrEmptyMessage = NO_DATA_FOUND_MESSAGE
  //   }
  //   return (
  //     <div>
  //       {tableOrEmptyMessage}
  //     </div>
  //   )
  // }

  function getSortedRows(rows, sortInfo) {
    if(sortInfo) {
      const { id, desc } = sortInfo;
      // we have this reversed so that the first click will sort from highest to lowest by default
      const directionOfSort = desc ? `asc` : 'desc';
      return rows.sort(firstBy(id, { direction: directionOfSort }));
    } else {
      return rows;
    }
  }

  function filterRowsByColumnValue(rows, column, value) {
    if (column === 'name') {
      return matchSorter(rows, value, { keys: [column]})
    } else {
      console.log("filtereed numbers are")
      console.log(rows.map(r => {return {original: r}}))
      return filterNumbers(rows.map(r => {return {original: r}}), [column], value).map(r => r.original)
    }

  }

  function handleFiltersChange(filters) {
    console.log("filters")
    console.log(filters)
    if (!rows || !rows.activity_healths) return;
    let newRows = activityHealthsData.activityHealths.activity_healths
    filters.forEach((filter) => {
        const column = filter.id
        const value = filter.value

        newRows = filterRowsByColumnValue(newRows, column, value)

      }
    )
    console.log("new rows")
    console.log(newRows)
    newRows = {activity_healths: newRows}
    setRows(getFilteredData(newRows))
  }

  function handleDataUpdate(sorted) {
    console.log("data update being handled")
    console.log(sorted)
    const sortInfo = sorted[0];
    if (!sortInfo) { return }

    console.log("rows is")
    console.log(rows)
    const sortedRows = getSortedRows(rows.activity_healths, sortInfo)
    const newIdSortedRows = {activity_healths: sortedRows.map((r, i) => {
      r.id = i
      return r
    })}
    console.log("sorted rows")
    console.log(sortedRows)
    console.log("filtered data")
    console.log(getFilteredData(newIdSortedRows))
    setRows(getFilteredData(newIdSortedRows))
  }


  const formatTableForCSV = (e) => {
    if (!rows || !rows.activity_healths) return;
    const currentRecords = rows.activity_healths

    const columns = dataTableFields
    let dataToDownload = []
    for (let index = 0; index < currentRecords.length; index++) {
      let recordToDownload = {}
      for(let colIndex = 0; colIndex < columns.length ; colIndex ++) {
        recordToDownload[columns[colIndex].Header] = currentRecords[index][columns[colIndex].accessor]
      }
      dataToDownload.push(recordToDownload)
    }

    console.log("rows to download")
    console.log(dataToDownload)
    // // Map Activity Packs to strings because JSON objects dont display in CSVs
    // let clonedDataToDownload = JSON.parse(JSON.stringify(dataToDownload));
    // clonedDataToDownload.forEach(item=> {
    //   item["Activity Packs"] = item["Activity Packs"] ? item["Activity Packs"].map(v => v.name) : ''
    // });

    setDataToDownload(dataToDownload)
  }


  return(
    <React.Fragment>
      <Navigation location={location} match={match} />
      <div className="health-dashboards-index-container">
        <section className="header-section">
          <h2>Activities Health Dashboard</h2>
          <div className="first-input-row">
            <FlagDropdown flag={flag} handleFlagChange={handleFlagChange} isLessons={true} />
            <div className="csv-download-button">
              <button onClick={formatTableForCSV} style={{cursor: 'pointer'}} type="button">
                  Download CSV
              </button>
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

          <div>
            <CSVLink
              data={dataToDownload}
              filename="activity_health_report"
              ref={(c) => (csvLink = c)}
              rel="noopener noreferrer"
              target="_blank"
            />
          </div>
          <ReactTable
            className="activity-healths-table"
            columns={dataTableFields}
            data={(rows && getFilteredData(rows).activity_healths) || []}
            defaultPageSize={(rows && rows.length) || 0}
            manualFilters
            manualSortBy
            onFiltersChange={handleFiltersChange}
            onSortedChange={handleDataUpdate}
            filterable
          />
        </section>
      </div>
    </React.Fragment>
  );

}

export default HealthDashboard
