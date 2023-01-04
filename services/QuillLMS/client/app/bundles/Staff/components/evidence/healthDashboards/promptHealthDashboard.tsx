import * as React from "react";
import { useRef } from 'react';
import { useQuery } from 'react-query';
import { CSVLink } from 'react-csv';
import { firstBy } from 'thenby';


import { FlagDropdown, ReactTable, filterNumbers } from '../../../../Shared/index'
import { fetchAggregatedPromptHealths } from '../../../utils/evidence/ruleFeedbackHistoryAPIs';
import { getLinkToPrompt, secondsToHumanReadableTime, addCommasToThousands } from "../../../helpers/evidence/miscHelpers";

const ALL_FLAGS = "All Flags"
const SHORT_NAME_COLUMN = "activity_short_name"
const TEXT_COLUMN = "text"
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

export const PromptHealthDashboard = ({ handleDashboardToggle }) => {
  const [flag, setFlag] = React.useState<string>(ALL_FLAGS)
  const [promptSearchInput, setPromptSearchInput] = React.useState<string>("")
  const [dataToDownload, setDataToDownload] = React.useState<Array<{}>>([])
  const [rows, setRows] = React.useState<Array<{}>>(null)
  const [poorHealthFlag, setPoorHealthFlag] = React.useState<boolean>(false)
  let csvLink = useRef(null);

  // get cached activity data to pass to rule
  const { data: promptHealthsData } = useQuery({
    queryKey: [`evidence-prompt-healths`],
    queryFn: fetchAggregatedPromptHealths
  });

  React.useEffect(() => {
    if (dataToDownload.length > 0) {
      csvLink.link.click();
    }
  }, [dataToDownload]);

  React.useEffect(() => {
    if (promptHealthsData && promptHealthsData.promptHealths) {
      setRows(getFilteredData(promptHealthsData.promptHealths))
    }
  }, [promptHealthsData])

  const dataTableFields = [
    {
      Header: 'Activity Short Name',
      accessor: "activity_short_name",
      key: "activity_short_name",
      Filter: CustomTextFilter,
      filterAll: true,
      Cell: ({row}) => <span>{row.original.activity_short_name}</span>, // eslint-disable-line react/display-name
      minWidth: 100,
      width: 100,
      maxWidth: 100
    },
    {
      Header: 'Prompt',
      accessor: "text",
      key: "text",
      Filter: CustomTextFilter,
      filterAll: true,
      Cell: ({row}) => <span className="name"><a href={getLinkToPrompt(row.original.activity_id, row.original.conjunction)} rel="noopener noreferrer" target="_blank">{row.original.text}</a></span>, // eslint-disable-line react/display-name
      minWidth: 330,
      width: 330,
      maxWidth: 330
    },
    {
      Header: 'Version #',
      accessor: "current_version",
      key: "current_version",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: 'Version responses',
      accessor: "version_responses",
      key: "version_responses",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: 'First Attempt Optimal',
      accessor: "first_attempt_optimal",
      key: "first_attempt_optimal",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: 'Final Attempt Optimal',
      accessor: "final_attempt_optimal",
      key: "final_attempt_optimal",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: 'Average Attempts',
      accessor: "avg_attempts",
      key: "avg_attempts",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: 'Confid- ence',
      accessor: "confidence",
      key: "confidence",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: '% AutoML Consecut- ive Repeated',
      accessor: "percent_automl_consecutive_repeated",
      key: "percent_automl_consecutive_repeated",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: '% AutoML',
      accessor: "percent_automl",
      key: "percent_automl",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: '% Plagiar- ism',
      accessor: "percent_plagiarism",
      key: "percent_plagiarism",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: '% Opinion',
      accessor: "percent_opinion",
      key: "percent_opinion",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: '% Grammar',
      accessor: "percent_grammar",
      key: "percent_grammar",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: '% Spelling',
      accessor: "percent_spelling",
      key: "percent_spelling",
      Filter: NumberFilter,
      minWidth: 70,
    },
    {
      Header: 'Avg Time Spent - Prompt',
      accessor: "avg_time_spent_per_prompt",
      key: "avg_time_spent_per_prompt",
      Filter: TimeFilter,
      minWidth: 70,
      Cell: ({row}) => secondsToHumanReadableTime(row.original.avg_time_spent_per_prompt)
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
        ((value.text && value.text.toLowerCase().includes(promptSearchInput.toLowerCase())) ||
        (value.activity_short_name && value.activity_short_name.toLowerCase().includes(promptSearchInput.toLowerCase())))
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

    if (column === TEXT_COLUMN) {
      return rows.filter(r => r.text.toLowerCase().includes(value.toLowerCase()))
    } else if (column === SHORT_NAME_COLUMN) {
      return rows.filter(r => r.activity_short_name.toLowerCase().includes(value.toLowerCase()))
    } else if (column === POOR_HEALTH_FLAG_COLUMN) {
      return filterPoorHealthRows(value, rows)
    } else {
      return filterNumbers(rows.map(r => {return {original: r}}), [column], value.replaceAll(',','')).map(r => r.original)
    }
  }

  const handleFiltersChange = (filters) => {
    if (!rows) return;
    let newRows = promptHealthsData.promptHealths
    filters.forEach((filter) => {
      const column = filter.id
      const value = filter.value

      newRows = filterRowsByColumnValue(promptHealthsData.promptHealths, column, value)
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
        <h2>Prompt Health Dashboard</h2>
        <div className="first-input-row">
          <FlagDropdown flag={flag} handleFlagChange={handleFlagChange} isLessons={true} />
          <div className="right-side-div">
            <a onClick={handleDashboardToggle}>Switch to Activity View</a>
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
        />
      </section>
    </div>
  );

}

export default PromptHealthDashboard
