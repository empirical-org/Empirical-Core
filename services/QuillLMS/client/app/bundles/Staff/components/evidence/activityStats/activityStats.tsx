import * as React from "react";
import { RouteComponentProps } from 'react-router-dom'
import { useQuery } from 'react-query';
;
import * as _ from 'lodash'

import FilterWidget from "../shared/filterWidget";
import { ActivityRouteProps, PromptHealthInterface, DropdownObjectInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity, fetchActivityVersions } from '../../../utils/evidence/activityAPIs';
import { fetchPromptHealth } from '../../../utils/evidence/ruleFeedbackHistoryAPIs';
import { Spinner, ReactTable, } from '../../../../Shared/index';
import { handlePageFilterClick, getVersionOptions } from '../../../helpers/evidence/miscHelpers';
import { renderHeader } from '../../../helpers/evidence/renderHelpers';
import { ACTIVITY_STATS } from '../../../../../constants/evidence';

const ActivityStats: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ history, match }) => {
  const { params } = match;
  const { activityId, } = params;

  const initialStartDateString = window.sessionStorage.getItem(`${ACTIVITY_STATS}startDate`) || '';
  const initialEndDateString = window.sessionStorage.getItem(`${ACTIVITY_STATS}endDate`) || '';
  const initialStartDate = initialStartDateString ? new Date(initialStartDateString) : null;
  const initialEndDate = initialEndDateString ? new Date(initialEndDateString) : null;
  const initialVersionOption = JSON.parse(window.sessionStorage.getItem(`${ACTIVITY_STATS}versionOption`)) || null;

  const [versionOption, setVersionOption] = React.useState<DropdownObjectInterface>(initialVersionOption);
  const [versionOptions, setVersionOptions] = React.useState<DropdownObjectInterface[]>([]);
  const [startDate, onStartDateChange] = React.useState<Date>(initialStartDate);
  const [startDateForQuery, setStartDate] = React.useState<string>(initialStartDateString);
  const [endDate, onEndDateChange] = React.useState<Date>(initialEndDate);
  const [endDateForQuery, setEndDate] = React.useState<string>(initialEndDateString);

  // get cached activity data to pass to rule
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  // cache rules data for updates
  const { data: promptHealth } = useQuery({
    queryKey: [`prompt-health-by-activity-${activityId}`, activityId, startDateForQuery, endDateForQuery],
    queryFn: fetchPromptHealth
  });

  const { data: activityVersionData } = useQuery({
    queryKey: [`change-logs-for-activity-versions-${activityId}`, activityId],
    queryFn: fetchActivityVersions
  });

  React.useEffect(() => {
    if(activityVersionData && activityVersionData.changeLogs && (!versionOption || !versionOptions.length)) {
      const options = getVersionOptions(activityVersionData);
      !versionOption && setVersionOption(options[0]);
      setVersionOptions(options);
    }
  }, [activityVersionData]);

  function handleVersionSelection(versionOption: DropdownObjectInterface) {
    setVersionOption(versionOption);
  }

  function handleFilterClick() {
    handlePageFilterClick({ startDate, endDate, versionOption, setStartDate, setEndDate, setPageNumber: null, storageKey: ACTIVITY_STATS });
  }

  const formattedRows = promptHealth && promptHealth.prompts && Object.values(promptHealth.prompts).map((prompt: PromptHealthInterface) => {
    const {
      session_count,
      total_responses,
      display_name,
      num_final_attempt_optimal,
      num_final_attempt_not_optimal,
      avg_attempts,
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
      averageAttempts: _.round(avg_attempts, 2),
      firstAttemptData: `${percentageOptimalFirstAttempt}% (${num_first_attempt_optimal}) | ${percentageNotOptimalFirstAttempt}% (${num_first_attempt_not_optimal})`,
    }
  })

  const dataTableFields = [
    {
      Header: '',
      accessor: "promptText",
      key: "promptText",
      Cell: ({row}) => <span className="prompt-text">{row.original.promptText}</span> // eslint-disable-line react/display-name
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
      Header: 'Average Attempts',
      accessor: "averageAttempts",
      key: "averageAttempts",
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

  return(
    <div className="activity-stats-container">
      {renderHeader(activityData, 'Activity Stats')}
      <FilterWidget
        endDate={endDate}
        handleFilterClick={handleFilterClick}
        handleVersionSelection={handleVersionSelection}
        onEndDateChange={onEndDateChange}
        onStartDateChange={onStartDateChange}
        startDate={startDate}
        versionOptions={versionOptions}
        selectedVersion={versionOption}
      />
      {formattedRows && (<ReactTable
        className="activity-stats-table"
        columns={dataTableFields}
        data={formattedRows || []}
        defaultPageSize={formattedRows.length}
      />)}
    </div>
  );
}

export default ActivityStats
