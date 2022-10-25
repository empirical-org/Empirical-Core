const mainApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/`;
const evidenceBaseUrl = `${mainApiBaseUrl}evidence/`;
const fetchDefaults = require("fetch-defaults");

const headerHash = {
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
}

export const apiFetch = fetchDefaults(fetch, evidenceBaseUrl, headerHash)

export const mainApiFetch = fetchDefaults(fetch, mainApiBaseUrl, headerHash)

export const mainFetch = fetchDefaults(fetch, process.env.DEFAULT_URL, headerHash)

export function getModelsUrl(promptId: string | number, state: string) {
  let url = 'automl_models';
  if(promptId && !state) {
    url = url + `?prompt_id=${promptId}`;
  } else if(!promptId && state) {
    url = url + `?state=${state}`;
  } else if(promptId && state) {
    url = url + `?prompt_id=${promptId}&state=${state}`;
  }
  return url;
}

export function getActivitySessionsUrl({ activityId, pageNumber, startDate, endDate, turkSessionID, filterType }) {
  let url = `session_feedback_histories.json?page=${pageNumber}&activity_id=${activityId}`;
  url = startDate ? url + `&start_date=${startDate}` : url;
  url = endDate ? url + `&end_date=${endDate}` : url;
  url = turkSessionID ? url + `&turk_session_id=${turkSessionID}` : url;
  url = filterType ? url + `&filter_type=${filterType}` : url;
  return url;
}

export const getRuleFeedbackHistoriesUrl = ({ activityId, selectedConjunction, startDate, endDate, turkSessionID }) => {
  let url = `rule_feedback_histories?activity_id=${activityId}&conjunction=${selectedConjunction}`;
  url = startDate ? url + `&start_date=${startDate}` : url;
  url = endDate ? url + `&end_date=${endDate}` : url;
  url = turkSessionID ? url + `&turk_session_id=${turkSessionID}` : url;
  return url;
}

export const getRuleFeedbackHistoryUrl = ({ ruleUID, promptId, startDate, endDate, turkSessionID }) => {
  let url = `rule_feedback_history/${ruleUID}?prompt_id=${promptId}`;
  url = startDate ? url + `&start_date=${startDate}` : url;
  url = endDate ? url + `&end_date=${endDate}` : url;
  url = turkSessionID ? url + `&turk_session_id=${turkSessionID}` : url;
  return url;
};

export const getActivityStatsUrl = ({ activityId, startDate, endDate, turkSessionID }) => {
  let url = `prompt_health?activity_id=${activityId}`;
  url = startDate ? url + `&start_date=${startDate}` : url;
  url = endDate ? url + `&end_date=${endDate}` : url;
  url = turkSessionID ? url + `&turk_session_id=${turkSessionID}` : url;
  return url;
};

export const getOverallActivityStatsUrl = ({ activityId }) => {
  return `overall_stats?activity_id=${activityId}`;
}

// not a 2xx status
export const requestFailed = (status: number ) => Math.round(status / 100) !== 2;

export const handleApiError = (errorMessage: string, response: any) => {
  let error: string;
  const { status } = response;
  if(requestFailed(status)) {
    error = errorMessage;
  }
  return error;
}

export const handleRequestErrors = async (errors: object) => {
  let errorsArray = [];
  if(errors) {
    Object.keys(errors).forEach(key => {
      errorsArray.push(`${key}: ${errors[key]}`);
    });
  }
  return errorsArray;
}
