import * as React from "react";
import { RouteComponentProps } from 'react-router-dom'
import { useQuery } from 'react-query';
import { firstBy } from "thenby";
import ReactTable from 'react-table';
import qs from 'qs';
import _ from 'lodash'

import { ActivityRouteProps, PromptInterface } from '../../../interfaces/comprehensionInterfaces';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { fetchPromptHealth } from '../../../utils/comprehension/ruleFeedbackHistoryAPIs';
import { DropdownInput, } from '../../../../Shared/index';


const ActivityStats: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ history, match }) => {
  const { params } = match;
  const { activityId, } = params;

  // get cached activity data to pass to rule
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const parentActivityId = activityData && activityData.activity && activityData.activity.parent_activity_id

  // cache rules data for updates
  const { data: promptHealth } = useQuery({
    queryKey: [`prompt-health-by-activity-${parentActivityId}`, parentActivityId],
    queryFn: fetchPromptHealth
  });


  const formattedRows = promptHealth && promptHealth.prompts && Object.values(promptHealth.prompts).map(prompt => {
    const {
      optimal_final_attempts,
      not_optimal_final_attempts,
      session_count,
      total_responses,
      final_attempt_pct_optimal,
      final_attempt_pct_not_optimal,
      display_name
    } = prompt;
    return {
      promptText: display_name,
      totalResponses: total_responses,
      sessionCount: session_count,
      finalAttemptData: `${final_attempt_pct_optimal * 100}% (${optimal_final_attempts}) | ${final_attempt_pct_not_optimal * 100}% (${not_optimal_final_attempts})`
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
    },
    {
      Header: 'Sessions',
      accessor: "sessionCount",
      key: "sessionCount",
    },
    {
      Header: 'Final Attempt: Optimal | Sub-Optimal',
      accessor: "finalAttemptData",
      key: "finalAttemptData",
    }
  ];

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
