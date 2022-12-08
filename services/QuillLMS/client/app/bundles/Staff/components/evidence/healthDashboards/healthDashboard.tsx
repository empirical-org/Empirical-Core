import * as React from "react";
import { useRef } from 'react';
import { useQuery } from 'react-query';
import { matchSorter } from 'match-sorter';
import { CSVLink } from 'react-csv';
import { firstBy } from 'thenby';


import Navigation from '../navigation'
import { tableSort, sortTableByList } from '../../../../../../app/modules/sortingMethods.js'
import { FlagDropdown, ReactTable, expanderColumn, TextFilter, NumberFilterInput, filterNumbers } from '../../../../Shared/index'
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

  // React.useEffect(() => {
  //   if (dataToDownload.length > 1) {
  //     csvLink.link.click();
  //   }
  // }, [dataToDownload]);

  // get cached activity data to pass to rule
  const { data: activityHealthsData } = useQuery({
    queryKey: [`evidence-activity-healths`],
    queryFn: fetchActivityHealths
  });

  React.useEffect(() => {
    if (activityHealthsData && activityHealthsData.activityHealths) {
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
      Filter: ({ column, setFilter }) =>
        (
          <NumberFilterInput
            column={column}
            handleChange={setFilter}
            label="Filter for version"
          />
        ),
      width: 80,
    },
    {
      Header: 'Version Plays',
      accessor: "version_plays",
      key: "versionPlays",
      filter: filterNumbers,
      Filter: ({ column, setFilter }) =>
        (
          <NumberFilterInput
            column={column}
            handleChange={setFilter}
            label="Filter for version plays"
          />
        ),
      width: 80,
      Cell: ({row}) => <span className="versionPlays">{addCommasToThousands(row.original.version_plays)}</span>
    },
    {
      Header: 'Total Plays',
      accessor: "total_plays",
      key: "totalPlays",
      filter: filterNumbers,
      Filter: ({ column, setFilter }) =>
        (
          <NumberFilterInput
            column={column}
            handleChange={setFilter}
            label="Filter for total plays"
          />
        ),
      width: 80,
      Cell: ({row}) => <span className="versionPlays">{addCommasToThousands(row.original.total_plays)}</span>
    },
    {
      Header: 'Completion Rate',
      accessor: "completion_rate",
      key: "completionRate",
      filter: filterNumbers,
      Filter: ({ column, setFilter }) =>
        (
          <NumberFilterInput
            column={column}
            handleChange={setFilter}
            label="Filter for completion rate"
          />
        ),
      width: 80,
      Cell: ({row}) => row.original.completion_rate && <span className="name">{row.original.completion_rate}%</span>
    },
    {
      Header: 'Because Final Optimal',
      accessor: "because_final_optimal",
      key: "becauseFinalOptimal",
      filter: filterNumbers,
      Filter: ({ column, setFilter }) =>
        (
          <NumberFilterInput
            column={column}
            handleChange={setFilter}
            label="Filter for because final optimal"
          />
        ),
      width: 80,
      Cell: ({row}) => row.original.because_final_optimal && <span className="name">{row.original.because_final_optimal}%</span>
    },
    {
      Header: 'But Final Optimal',
      accessor: "but_final_optimal",
      key: "butFinalOptimal",
      filter: filterNumbers,
      Filter: ({ column, setFilter }) =>
        (
          <NumberFilterInput
            column={column}
            handleChange={setFilter}
            label="Filter for but final optimal"
          />
        ),
      width: 80,
      Cell: ({row}) => row.original.but_final_optimal && <span className="name">{row.original.but_final_optimal}%</span>
    },
    {
      Header: 'So Final Optimal',
      accessor: "so_final_optimal",
      key: "soFinalOptimal",
      filter: filterNumbers,
      Filter: ({ column, setFilter }) =>
        (
          <NumberFilterInput
            column={column}
            handleChange={setFilter}
            label="Filter for so final optimal"
          />
        ),
      width: 80,
      Cell: ({row}) => row.original.so_final_optimal && <span className="name">{row.original.so_final_optimal}%</span>
    },
    {
      Header: 'Avg Time Spent - Activity',
      accessor: "avg_completion_time",
      key: "avgCompletionTime",
      filter: filterNumbers,
      Filter: ({ column, setFilter }) =>
        (
          <NumberFilterInput
            column={column}
            handleChange={setFilter}
            label="Filter for avg completion time"
          />
        ),
      width: 160,
    }
  ];

  const handleFlagChange = (e) => {setFlag(e.target.value)}
  const handleSearchByPrompt = (e) => {setPromptSearchInput(e.target.value)}

  const getFilteredData = (data) => {

    let filteredData = flag === ALL_FLAGS ? data.activity_healths : data.activity_healths.filter(data => data.flag === flag)
    filteredData = filteredData.filter(value => {
      return (
        value.name && value.name.toLowerCase().includes(promptSearchInput.toLowerCase())
        // value.prompt_healths && value.prompt_healths.map(x => x.text || '').some(y => stripHtml(y).toLowerCase().includes(promptSearchInput.toLowerCase()))
      );
    })
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

  function handleDataUpdate(sorted) {
    console.log(sorted)
    const sortInfo = sorted[0];
    if (!sortInfo) { return }


    const sortedRows = getSortedRows(rows, sortInfo)
    const newIdSortedRows = sortedRows.map((r, i) => {
      r.id = i
      return r
    })
    console.log(sortedRows)
    setRows(newIdSortedRows)
    console.log(rows)
  }


  const formatTableForCSV = (e) => {
    console.log("data to download")
    console.log(dataToDownload)

    const columns = dataTableFields
    // let dataToDownload = []
    // for (let index = 0; index < currentRecords.length; index++) {
    //   let recordToDownload = {}
    //   for(let colIndex = 0; colIndex < columns.length ; colIndex ++) {
    //     recordToDownload[columns[colIndex].Header] = currentRecords[index][columns[colIndex].accessor]
    //   }
    //   dataToDownload.push(recordToDownload)
    // }

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
          <FlagDropdown flag={flag} handleFlagChange={handleFlagChange} isLessons={true} />
          <input
            aria-label="Search by prompt"
            className="search-box"
            name="searchInput"
            onChange={handleSearchByPrompt}
            placeholder="Search by prompt or activity name"
            value={promptSearchInput || ""}
          />
          <div className="csv-download-button">
            <button onClick={formatTableForCSV} style={{cursor: 'pointer'}} type="button">
                Download CSV
            </button>
          </div>
          <div>
            {/* <CSVLink
              data={dataToDownload}
              filename="activity_health_report"
              ref={(c) => (csvLink = c)}
              rel="noopener noreferrer"
              target="_blank"
            /> */}
          </div>
          <ReactTable
            className="activity-healths-table"
            columns={dataTableFields}
            data={rows || []}
            defaultPageSize={(rows && rows.length) || 0}
            manualSortBy
            onSortedChange={handleDataUpdate}
            filterable={true}
          />)
        </section>
      </div>
    </React.Fragment>
  );

}

export default HealthDashboard
