import * as _ from 'underscore';
import {Response} from '../interfaces'

export function getOptimalResponses(responses: Array<Response>): Array<Response> {
  return _.where(responses, { optimal: true, });
}

export function getSubOptimalResponses(responses:Array<Response>) {
  return _.filter(responses, resp => resp.parentID === undefined && resp.feedback !== undefined && resp.optimal !== true);
}

export function getTopOptimalResponse(responses: Array<Response>) {
  return _.sortBy(getOptimalResponses(responses), r => r.count).reverse()[0]
}

function getWeakResponses(responses:Array<Response>) {
  return _.filter(responses, resp => resp.weak === true);
}

function getCommonUnmatchedResponses(responses: Array<Response>): Array<Response> {
  return _.filter(responses, resp => resp.feedback === undefined && resp.count > 2);
}

function getSumOfWeakAndCommonUnmatchedResponses(responses:Array<Response>) {
  return getWeakResponses(responses).length + getCommonUnmatchedResponses(responses).length;
}

export function getPercentageWeakResponses(responses:Array<Response>) {
  return (getSumOfWeakAndCommonUnmatchedResponses(responses) / responses.length * 100).toPrecision(4);
}

export function getGradedResponses(responses:Array<Response>) {
    // Returns sorted collection optimal first followed by suboptimal
  const gradedResponses = _.reject(responses, response =>
      (response.optimal === undefined) || (response.parentID)
    );
  return _.sortBy(gradedResponses, 'optimal').reverse();
}
