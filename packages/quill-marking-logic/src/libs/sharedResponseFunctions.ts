import * as _ from 'underscore';

import {Response} from '../interfaces'

export function getOptimalResponses(responses: Array<Response>): Array<Response> {
  return _.where(responses, { optimal: true, });
}

export function getSubOptimalResponses(responses: Array<Response>): Array<Response> {
  return _.filter(responses, resp => resp.parent_id == undefined && resp.feedback !== undefined && resp.optimal == false);
}

export function getTopOptimalResponse(responses: Array<Response>): Response {
  const returnVal =  _.sortBy(getOptimalResponses(responses), r => r.count).reverse()[0];
  if (returnVal === undefined) {
    throw 'DataError - No Optimal Response';
  }
  return returnVal;
}

function getWeakResponses(responses: Array<Response>): Array<Response> {
  return _.filter(responses, resp => resp.weak === true);
}

function getCommonUnmatchedResponses(responses: Array<Response>): Array<Response> {
  return _.filter(responses, resp => resp.feedback === undefined && resp.count > 2);
}

function getSumOfWeakAndCommonUnmatchedResponses(responses: Array<Response>): number {
  return getWeakResponses(responses).length + getCommonUnmatchedResponses(responses).length;
}

export function getPercentageWeakResponses(responses: Array<Response>): string {
  return (getSumOfWeakAndCommonUnmatchedResponses(responses) / responses.length * 100).toPrecision(4);
}

export function getGradedResponses(responses: Array<Response>): Array<Response> {
  // Returns sorted collection optimal first followed by suboptimal
  const gradedResponses: Array<Response> = responses.filter(response =>
    (response.optimal !== undefined) || (!response.parent_id)
  );
  return _.sortBy(gradedResponses, 'optimal').reverse();
}
