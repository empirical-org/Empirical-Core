import _ from 'underscore';
import * as qpos from "./partsOfSpeechTagging.js";

String.prototype.normalize = function() {
  return this.replace(/[\u201C\u201D]/g, '\u0022').replace(/[\u00B4\u0060\u2018\u2019]/g, '\u0027').replace('‚', ',');
}


export default class POSMatcher {
  constructor(data) {
    this.optimalResponses = data.optimalResponses;
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

    const posMatch = this.checkPOSMatch(userResponse)
    if(posMatch!==undefined) {
      returnValue.response = posMatch
      returnValue.posMatch = true
      return returnValue
    }

    returnValue.found = false
    return returnValue
  }

  checkExactMatch(userResponse){
    // var exactMatch = false;
    // if (this.optimalResponses.indexOf(userResponse) > -1){
    //   exactMatch = true;
    // }
    // return exactMatch;
    return _.find(this.optimalResponses, (response)=>{
      return response===userResponse
    })
  }

  checkPOSMatch(userResponse){
    const correctPOSTags = this.optimalResponses.map((correctResponse)=>{
      return qpos.getPartsOfSpeechTags(correctResponse);
    })
    const userPOSTags = qpos.getPartsOfSpeechTags(userResponse);

    return _.find(correctPOSTags, (posTags)=>{
        var found = true;
        // console.log("Optimal: ", posTags)
        posTags.forEach((tag, index)=>{
          if(tag!==userPOSTags[index]){
            found = false;
          }
        })
        return found;
      })
    // return (foundMatch) ? true : false;
  }
}
