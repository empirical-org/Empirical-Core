import * as React from "react";

import { ReactTable } from '../../../../Shared/index';
import { getLinkToPrompt, secondsToHumanReadableTime } from "../../../helpers/evidence/miscHelpers";

const NO_DATA_FOUND_MESSAGE = "No prompt data yet available for this activity."

export const PromptHealthRows = ({ data }) => {

  const dataTableFields = [
    {
      Header: 'Activity Short Name',
      accessor: "activity_short_name",
      key: "activity_short_name",
      Cell: ({row}) => <span>{row.original.activity_short_name}</span>, // eslint-disable-line react/display-name
      minWidth: 100,
      width: 100,
      maxWidth: 100
    },
    {
      Header: 'Prompt',
      accessor: "text",
      key: "text",
      Cell: ({row}) => <span className="name"><a href={getLinkToPrompt(row.original.activity_id, row.original.conjunction)} rel="noopener noreferrer" target="_blank">{row.original.text}</a></span>, // eslint-disable-line react/display-name
      minWidth: 330,
      width: 330,
      maxWidth: 330
    },
    {
      Header: 'Version #',
      accessor: "current_version",
      key: "current_version",
      minWidth: 70,
    },
    {
      Header: 'Version responses',
      accessor: "version_responses",
      key: "version_responses",
      minWidth: 70,
    },
    {
      Header: 'First Attempt Optimal',
      accessor: "first_attempt_optimal",
      key: "first_attempt_optimal",
      minWidth: 70,
      Cell: ({row}) => {
        if (!row.original.first_attempt_optimal) { return <span />}
        const className = row.original.first_attempt_optimal < 25 ? "poor-health" : "" + " name"
        return <span className={className}>{row.original.first_attempt_optimal}%</span>
      }
    },
    {
      Header: 'Final Attempt Optimal',
      accessor: "final_attempt_optimal",
      key: "final_attempt_optimal",
      minWidth: 70,
      Cell: ({row}) => row.original.final_attempt_optimal && <span className={row.original.final_attempt_optimal < 75 ? "poor-health" : "" + " name"}>{row.original.final_attempt_optimal}%</span>
    },
    {
      Header: 'Average Attempts',
      accessor: "avg_attempts",
      key: "avg_attempts",
      minWidth: 70,
    },
    {
      Header: 'Confid- ence',
      accessor: "confidence",
      key: "confidence",
      minWidth: 70,
      Cell: ({row}) => row.original.confidence && <span className={row.original.confidence < 0.9 ? "poor-health" : "" + " name"}>{row.original.confidence}%</span>
    },
    {
      Header: '% AutoML Consecut- ive Repeated',
      accessor: "percent_automl_consecutive_repeated",
      key: "percent_automl_consecutive_repeated",
      minWidth: 70,
      Cell: ({row}) => row.original.percent_automl_consecutive_repeated && <span className={row.original.percent_automl_consecutive_repeated > 30 ? "poor-health" : "" + " name"}>{row.original.percent_automl_consecutive_repeated}%</span>
    },
    {
      Header: '% AutoML',
      accessor: "percent_automl",
      key: "percent_automl",
      minWidth: 70,
    },
    {
      Header: '% Plagiar- ism',
      accessor: "percent_plagiarism",
      key: "percent_plagiarism",
      minWidth: 70,
    },
    {
      Header: '% Opinion',
      accessor: "percent_opinion",
      key: "percent_opinion",
      minWidth: 70,
    },
    {
      Header: '% Grammar',
      accessor: "percent_grammar",
      key: "percent_grammar",
      minWidth: 70,
    },
    {
      Header: '% Spelling',
      accessor: "percent_spelling",
      key: "percent_spelling",
      minWidth: 70,
    },
    {
      Header: 'Avg Time Spent - Prompt',
      accessor: "avg_time_spent_per_prompt",
      key: "avg_time_spent_per_prompt",
      minWidth: 70,
      Cell: ({row}) => secondsToHumanReadableTime(row.original.avg_time_spent_per_prompt)
    },
    {
      Header: 'Poor Health Flag',
      accessor: "poor_health_flag",
      key: "poorHealthFlag",
      minWidth: 70,
      Cell: ({row}) => row.original.poor_health_flag === true && <span className="poor-health-flag">X</span>,
    }
  ];

  const renderTableOrEmptyMessage = () => {

    if (data.length) {
      return (
        <ReactTable
          className='prompt-health-dropdown-table'
          collapseOnDataChange={false}
          columns={dataTableFields}
          data={data}
          defaultPageSize={data.length}
          loading={false}
          pages={1}
        />
      )
    }
    return <p>{NO_DATA_FOUND_MESSAGE}</p>
  }


  return (
    <div className="standard-columns">
      {renderTableOrEmptyMessage()}
    </div>
  )

}

export default PromptHealthRows
