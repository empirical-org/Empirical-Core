import _ from 'underscore';
import * as qpos from "./partsOfSpeechTagging.js";
import {hashToCollection} from './hashToCollection.js'

String.prototype.normalize = function() {
  return this.replace(/[\u201C\u201D]/g, '\u0022').replace(/[\u00B4\u0060\u2018\u2019]/g, '\u0027').replace('‚', ',');
}


export default class POSMatcher {
  constructor(responses) {
    responses = hashToCollection(responses)
    this.optimalResponses = responses
    // this.optimalResponses = _.filter(responses, (response)=>{
    //   return response.optimal===true
    // })
  }

  checkMatch(userResponse) {
    userResponse = userResponse.trim().replace(/\s{2,}/g, ' ');
    var returnValue = {
      found: true,
      submitted: userResponse,
      posMatch: false,
      exactMatch: false
    }

    const exactMatch = this.checkExactMatch(userResponse)
    if(exactMatch!==undefined) {
      returnValue.response = exactMatch
      returnValue.exactMatch = true
      returnValue.posMatch = true //an exact match implies a posMatch
      return returnValue
    }

    // console.log("User tags: ", qpos.getPartsOfSpeechTags(userResponse))
    const posMatch = this.checkPOSMatch(userResponse)
    // console.log("POS match: " + posMatch)
    if(posMatch!==undefined) {
      returnValue.response = posMatch
      returnValue.posMatch = true
      return returnValue
    }

    returnValue.found = false
    return returnValue
  }

  checkExactMatch(userResponse) {
    return _.find(this.optimalResponses, (response)=>{
      return response.text===userResponse
    })
  }

  checkPOSMatch(userResponse) {
    const correctPOSTags = this.optimalResponses.map((optimalResponse)=>{
      return qpos.getPartsOfSpeechTags(optimalResponse.text);
    })
    const userPOSTags = qpos.getPartsOfSpeechTags(userResponse);
    if (userPOSTags) {
      return _.find(this.optimalResponses, (optimalResponse, index)=>{
        var found = true;
        if(optimalResponse.parentID) {
          found = false;
        } else if (correctPOSTags[index]){
          correctPOSTags[index].forEach((tag, indexValue)=>{
            if(tag!==userPOSTags[indexValue]){
              found = false;
            }
          })
        }
        return found;
      })
    }
    // return (foundMatch) ? true : false;
  }
}
