import React from 'react'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import {connect} from 'react-redux'
import arrow from '../../img/correct_icon.svg'
const jsDiff = require('diff');

const EndState = React.createClass({

  renderStaticText: function() {
    let message = ""
    if(this.props.answeredNonMultipleChoiceCorrectly || this.props.multipleChoiceCorrect) {
      message = "Good work! Here are the most popular strong answers:"
    } else {
      message = "Keep going! Here are the most popular strong answers:"
    }
    return (
      <p className="top-answer-title">{message}</p>
    )
  },

  returnSanitizedArray: function(str) {
    return str.toLowerCase().replace(/\n/g," ").replace(/(<([^>]+)>)/ig," ").replace(/[.'",\/#?!$%\^&\*;:{}=\-_`~()]/g,"").split(' ').sort().join(' ').trim().split(' ');
  },

  findDiffs: function(answer) {
    let styledString = answer;
    const sanitizedQuestion = this.returnSanitizedArray(this.props.question.prompt);
    const sanitizedAnswer = this.returnSanitizedArray(answer);
    const diffObjects = jsDiff.diffArrays(sanitizedQuestion, sanitizedAnswer);
    let diffStrings = [];
    diffObjects.forEach(function(diff) {
      if(diff.added) {
        diffStrings = diffStrings.concat(diff.value);
      }
    });
    diffStrings.forEach(function(word) {
      console.log("Word: " + word);
      // styledString = styledString.replace(new RegExp("( |^|[.'\",\/#?!$%\^&\*;:{}=\-_`~()])" + word + "( |$|[.'\",\/#?!$%\^&\*;:{}=\-_`~()])", "i"), '<span style="color: green;">' + word + '</span>');
      styledString = styledString.replace(new RegExp(" " + word + " ", "i"), ' <span style="color: green;">' + word + '</span> ');
    });
    // diffObjects.forEach(function(part) {
    //   if(part.added) {
    //     part.value.forEach(function(word) {
    //       //console.log(word);
    //       styledString = styledString.replace(new RegExp("( |^|[.'\",\/#?!$%\^&\*;:{}=\-_`~()])" + word + "( |$|[.'\",\/#?!$%\^&\*;:{}=\-_`~()])", 'i'), function(match) {
    //         console.log(match);
    //         return ' <span style="color: green;">' + match + '</span> ';
    //       });
    //     });
    //   }
    // });
    return styledString;
  },

  renderTopThreeResponses: function() {
    let responses = this.props.responses
    responses = hashToCollection(responses)
    responses = responses.filter((response) => {
      return response.optimal
    }).sort(function(a, b) {
      return b.count-a.count
    })
    let responsesToRender = _.first(responses, 3)
    const sum = _.reduce(responsesToRender, function(memo, response) {return memo+response.count}, 0)
    var attemptKey;
    if(this.props.answeredNonMultipleChoiceCorrectly) {
      attemptKey = getLatestAttempt(this.props.question.attempts).response.key
    }
    return responsesToRender.map((response, index) => {
      return (
        <li key={index} className={"top-answer-list-item " + (attemptKey === response.key ? 'active' : '')} >
          <div className="top-answer-list-item-index">
            {(index+1) + ". "}
          </div>
          <div className="top-answer-list-item-text" dangerouslySetInnerHTML={{__html: this.findDiffs(response.text)}}>
          </div>
          <div className="top-answer-list-item-score">
          {(Math.floor(response.count*100/sum)) + "%"}
          </div>
        </li>
      )
    })
  },

  render: function() {
    const listStyle = {
      "listStyle": "none",
      "marginLeft": "1em",
    }
    return (
      <div className="end-state-container">
        <img src={arrow}/>
        <div className="top-answer-text">
          {this.renderStaticText()}
          <ul className="top-answer-list">
            {this.renderTopThreeResponses()}
          </ul>
        </div>
      </div>
    )
  }
})

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex]
}

function select(state) {
  return {
    questions: state.questions,
  }
}
export default connect(select)(EndState)
