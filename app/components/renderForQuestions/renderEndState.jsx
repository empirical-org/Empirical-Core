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
    return str.toLowerCase().replace(/\n/g," ").replace(/(<([^>]+)>)/ig," ").replace(/&nbsp;/g, '').replace(/[.",\/#?!$%\^&\*;:{}=\_`~()]/g,"").split(' ').sort().join(' ').trim().split(' ');
  },

  findDiffs: function(answer) {
    let styledString = answer;
    const sanitizedQuestionArray = this.returnSanitizedArray(this.props.question.prompt);
    const sanitizedAnswerArray = this.returnSanitizedArray(answer);
    const diffObjects = jsDiff.diffArrays(sanitizedQuestionArray, sanitizedAnswerArray);
    diffObjects.forEach(function(diff) {
      if(diff.added) {
        diff.value.forEach(function(word) {
          let regex = new RegExp("(^|[^(a-zA-Z>)])" + word + "($|[^(<a-zA-Z)])", 'i');
          if(styledString.match(regex)) {
              styledString = styledString.replace(regex, '<span style="color: green;">' + styledString.match(regex)[0] + '</span>');
          }
          let punctuationAtStartOfString = styledString.match(new RegExp("<span style=\"color: green;\">[^(a-zA-Z>)]", 'g'));
          if(punctuationAtStartOfString) {
            const charToMove = punctuationAtStartOfString[0][punctuationAtStartOfString[0].length - 1];
            styledString = styledString.replace(new RegExp("<span style=\"color: green;\">[" + charToMove + "]", 'g'), charToMove + "<span style=\"color: green;\">");
          }
          let punctuationAtEndOfString = styledString.match(new RegExp("[^(a-zA-Z)]</span>", 'g'));
          if(punctuationAtEndOfString) {
              const charToMove = punctuationAtEndOfString[0][punctuationAtEndOfString[0].length - 8];
              styledString = styledString.replace(new RegExp("[" + charToMove + "]</span>", 'g'), "</span>" + charToMove);
          }
        });
      }
    });
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
      const active = attemptKey === response.key ? 'active' : ''
      return (
        <li key={index} className={`top-answer-list-item ${active}`}>
          <div className="top-answer-list-item-index">
            {`${index + 1}. `}
          </div>
          <div className="top-answer-list-item-text" dangerouslySetInnerHTML={{__html: this.findDiffs(response.text)}}>
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
