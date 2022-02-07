import _ from 'underscore';

export function getOptimalResponses(responses) {
  return _.where(responses, { optimal: true, });
}

export function getSubOptimalResponses(responses) {
  return _.filter(responses, resp => resp.parentID === undefined && resp.feedback !== undefined && resp.optimal !== true);
}

export function getTopOptimalResponse(responses) {
  return _.sortBy(getOptimalResponses(responses), r => r.count).reverse(responses)[0];
}

function getWeakResponses(responses) {
  return _.filter(responses, resp => resp.weak === true);
}

function getCommonUnmatchedResponses(responses) {
  return _.filter(responses, resp => resp.feedback === undefined && resp.count > 2);
}

function getSumOfWeakAndCommonUnmatchedResponses(responses) {
  return getWeakResponses(responses).length + getCommonUnmatchedResponses(responses).length;
}

export function getPercentageWeakResponses(responses) {
  return (getSumOfWeakAndCommonUnmatchedResponses(responses) / responses.length * 100).toPrecision(4);
}

export function getGradedResponses(responses) {
  // Returns sorted collection optimal first followed by suboptimal
  const gradedResponses = _.reject(responses, response =>
    (response.optimal === undefined) || (response.parentID)
  );
  return _.sortBy(gradedResponses, 'optimal').reverse();
}
