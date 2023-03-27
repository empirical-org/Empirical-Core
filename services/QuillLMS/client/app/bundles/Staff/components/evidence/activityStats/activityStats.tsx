import * as _ from 'lodash';
import * as React from "react";
import { useQuery } from 'react-query';
import { RouteComponentProps } from 'react-router-dom';
;

import { ACTIVITY_STATS } from '../../../../../constants/evidence';
import { ReactTable, Spinner } from '../../../../Shared/index';
import { getVersionOptions, handlePageFilterClick } from '../../../helpers/evidence/miscHelpers';
import { renderHeader } from '../../../helpers/evidence/renderHelpers';
import { ActivityRouteProps, DropdownObjectInterface, PromptHealthInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity, fetchActivityVersions } from '../../../utils/evidence/activityAPIs';
import { fetchActivityHealth, fetchPromptHealth } from '../../../utils/evidence/ruleFeedbackHistoryAPIs';
import FilterWidget from "../shared/filterWidget";

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
  const { data: activityHealthData } = useQuery({
    queryKey: [`activity-health-by-activity-${activityId}`, activityId],
    queryFn: fetchActivityHealth
  });

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
      const defaultOption = options[0];
      !versionOption && setVersionOption(defaultOption);
      setVersionOptions(options);
      handleFilterClick(defaultOption);
    }
  }, [activityVersionData]);

  React.useEffect(() => {
    if(versionOption && versionOption.value) {
      const { value } = versionOption;
      const { start_date, end_date } = value;
      onStartDateChange(new Date(start_date))
      onEndDateChange(new Date(end_date))
    }
  }, [versionOption]);

  function handleVersionSelection(versionOption: DropdownObjectInterface) {
    setVersionOption(versionOption);
  }


  function handleFilterClick(e: React.SyntheticEvent, passedVersionOption?: DropdownObjectInterface) {
    handlePageFilterClick({
      startDate,
      endDate,
      versionOption: passedVersionOption || versionOption,
      setStartDate,
      setEndDate,
      setPageNumber: null,
      storageKey: ACTIVITY_STATS
    });
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
      avg_time_spent,
      avg_confidence
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
      averageTimeSpent: avg_time_spent,
      averageAutoMLConfidence: `${avg_confidence}%`,
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
      Header: 'AutoML Confidence',
      accessor: "averageAutoMLConfidence",
      key: "averageAutoMLConfidence",
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
    },
    {
      Header: 'Time Spent',
      accessor: "averageTimeSpent",
      key: "averageTimeSpent",
      width: 160,
    }
  ];

  if (!formattedRows) {
    return <Spinner />
  }

  const activityHealth = (
    <div>
      <p><strong>Average Time Spent: </strong>{activityHealthData && activityHealthData.activity ? activityHealthData.activity.average_time_spent : "Loading..."}</p>
      <p><strong>Average Completion Rate: </strong> {activityHealthData && activityHealthData.activity ? `${activityHealthData.activity.average_completion_rate}% Completed` : "Loading..."}</p>
    </div>
  )

  return(
    <div className="activity-stats-container">
      {renderHeader(activityData, 'Activity Stats')}
      <FilterWidget
        endDate={endDate}
        handleFilterClick={handleFilterClick}
        handleVersionSelection={handleVersionSelection}
        onEndDateChange={onEndDateChange}
        onStartDateChange={onStartDateChange}
        selectedVersion={versionOption}
        startDate={startDate}
        versionOptions={versionOptions}
      />
      {activityHealth}
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
