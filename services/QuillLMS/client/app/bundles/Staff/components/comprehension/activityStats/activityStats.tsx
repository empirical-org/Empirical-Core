import * as React from "react";
import { RouteComponentProps } from 'react-router-dom'
import { useQuery } from 'react-query';
import { firstBy } from "thenby";
import ReactTable from 'react-table';
import qs from 'qs';
import * as _ from 'lodash'

import { ActivityRouteProps, PromptInterface } from '../../../interfaces/comprehensionInterfaces';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { fetchPromptHealth } from '../../../utils/comprehension/ruleFeedbackHistoryAPIs';
import { DropdownInput, Spinner, } from '../../../../Shared/index';


const ActivityStats: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ history, match }) => {
  const { params } = match;
  const { activityId, } = params;

  // get cached activity data to pass to rule
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  // cache rules data for updates
  const { data: promptHealth } = useQuery({
    queryKey: [`prompt-health-by-activity-${activityId}`, activityId],
    queryFn: fetchPromptHealth
  });


  const formattedRows = promptHealth && promptHealth.prompts && Object.values(promptHealth.prompts).map(prompt => {
    const {
      session_count,
      total_responses,
      display_name,
      num_final_attempt_optimal,
      num_final_attempt_not_optimal,
      avg_attempts_to_optimal,
      num_sessions_with_consecutive_repeated_rule,
      num_sessions_with_non_consecutive_repeated_rule,
      num_first_attempt_optimal,
      num_first_attempt_not_optimal,
    } = prompt;

    const percentageOptimalFinalAttempt = _.round(num_final_attempt_optimal / session_count * 100, 2)
    const percentageNotOptimalFinalAttempt = _.round(num_final_attempt_not_optimal / session_count * 100, 2)

    const percentageConsecutiveRepeatedRule = _.round(num_sessions_with_consecutive_repeated_rule / session_count * 100, 2)
    const percentageNotConsecutiveRepeatedRule = _.round(num_sessions_with_non_consecutive_repeated_rule / session_count * 100, 2)

    const percentageOptimalFirstAttempt = _.round(num_first_attempt_optimal / session_count * 100, 2)
    const percentageNotOptimalFirstAttempt = _.round(num_first_attempt_not_optimal / session_count * 100, 2)

    return {
      promptText: display_name,
      totalResponses: total_responses,
      sessionCount: session_count,
      finalAttemptData: `${percentageOptimalFinalAttempt}% (${num_final_attempt_optimal}) | ${percentageNotOptimalFinalAttempt}% (${num_final_attempt_not_optimal})`,
      ruleRepeatedConsecutiveData: `${percentageConsecutiveRepeatedRule}% (${num_sessions_with_consecutive_repeated_rule})`,
      ruleRepeatedNotConsecutiveData:  `${percentageNotConsecutiveRepeatedRule}% (${num_sessions_with_non_consecutive_repeated_rule})`,
      averageAttemptsToOptimal: _.round(avg_attempts_to_optimal, 2),
      firstAttemptData: `${percentageOptimalFirstAttempt}% (${num_first_attempt_optimal}) | ${percentageNotOptimalFirstAttempt}% (${num_first_attempt_not_optimal})`,
    }
  })

  const dataTableFields = [
    {
      Header: '',
      accessor: "promptText",
      key: "promptText",
      Cell: (data) => <span className="prompt-text">{data.original.promptText}</span>
    },
    {
      Header: 'Total Responses',
      accessor: "totalResponses",
      key: "totalResponses",
      width: 80,
    },
    {
      Header: 'Sessions',
      accessor: "sessionCount",
      key: "sessionCount",
      width: 70,
    },
    {
      Header: 'Final Attempt: Optimal | Sub-Optimal',
      accessor: "finalAttemptData",
      key: "finalAttemptData",
      width: 160,
    },
    {
      Header: 'Average Attempts to Optimal',
      accessor: "averageAttemptsToOptimal",
      key: "averageAttemptsToOptimal",
      width: 120,
    },
    {
      Header: 'Rule Repeated: Consecutive Attempt',
      accessor: "ruleRepeatedConsecutiveData",
      key: "ruleRepeatedConsecutiveData",
      width: 150,
    },
    {
      Header: 'Rule Repeated: Non-consecutive Attempt',
      accessor: "ruleRepeatedNotConsecutiveData",
      key: "ruleRepeatedNotConsecutiveData",
      width: 150,
    },
    {
      Header: 'First Attempt: Optimal | Sub-Optimal',
      accessor: "firstAttemptData",
      key: "firstAttemptData",
      width: 160,
    }
  ];

  if (!formattedRows) {
    return <Spinner />
  }

  debugger;

  return(
    <div className="activity-stats-container">
      <h1>Activity Stats</h1>
      {formattedRows && (<ReactTable
        className="activity-stats-table"
        columns={dataTableFields}
        data={formattedRows ? formattedRows : []}
        defaultPageSize={formattedRows.length}
        showPagination={false}
      />)}
    </div>
  );
}

export default ActivityStats
