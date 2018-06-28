import React from 'react';
import _ from 'underscore';
import { hashToCollection } from 'quill-component-library/dist/componentLibrary';
import { connect } from 'react-redux';
const arrow = 'http://cdn.quill.org/images/icons/correct_icon.svg';
import { Feedback } from 'quill-component-library/dist/componentLibrary';
const jsDiff = require('diff');

const EndState = React.createClass({

  renderStaticText() {
    let message = '';
    if (this.props.answeredNonMultipleChoiceCorrectly || this.props.multipleChoiceCorrect) {
      message = 'Good work! Here are the most popular strong answers:';
    } else {
      message = 'Keep going! Here are the most popular strong answers:';
    }
    return (
      <Feedback
        key="end-state"
        feedbackType="continue"
        feedback={(<p>{message}</p>)}
      />
    );
  },

  returnSanitizedArray(str) {
    return str.toLowerCase().replace(/\n/g, ' ').replace(/(<([^>]+)>)/ig, ' ').replace(/&nbsp;/g, '').replace(/[.",\/#?!$%\^&\*;:{}=\_`~()]/g, '').split(' ').sort().join(' ').trim().split(' ');
  },

  findDiffs(answer) {
    let styledString = answer;
    const sanitizedQuestionArray = this.returnSanitizedArray(this.props.question.prompt);
    const sanitizedAnswerArray = this.returnSanitizedArray(answer);
    const diffObjects = jsDiff.diffArrays(sanitizedQuestionArray, sanitizedAnswerArray);
    diffObjects.forEach((diff) => {
      if (diff.added) {
        diff.value.forEach((word) => {
          const regex = new RegExp(`(^|[^(a-zA-Z>)])${word }($|[^(<a-zA-Z)])`, 'i');
          if (styledString.match(regex)) {
            styledString = styledString.replace(regex, `<span style="color: green;">${styledString.match(regex)[0]}</span>`);
          }
          const punctuationAtStartOfString = styledString.match(new RegExp('<span style="color: green;">[^(a-zA-Z>)]', 'g'));
          if (punctuationAtStartOfString) {
            const charToMove = punctuationAtStartOfString[0][punctuationAtStartOfString[0].length - 1];
            styledString = styledString.replace(new RegExp(`<span style="color: green;">[${charToMove}]`, 'g'), `${charToMove}<span style="color: green;">`);
          }
          const punctuationAtEndOfString = styledString.match(new RegExp('[^(a-zA-Z)]</span>', 'g'));
          if (punctuationAtEndOfString) {
            const charToMove = punctuationAtEndOfString[0][punctuationAtEndOfString[0].length - 8];
            styledString = styledString.replace(new RegExp(`[${charToMove }]</span>`, 'g'), `</span>${charToMove}`);
          }
        });
      }
    });
    return styledString;
  },

  renderTopThreeResponses() {
    let responses = this.props.responses;
    responses = hashToCollection(responses);
    responses = responses.filter(response => response.optimal).sort((a, b) => b.count - a.count);
    const responsesToRender = _.first(responses, 3);
    const sum = _.reduce(responsesToRender, (memo, response) => memo + response.count, 0);
    let attemptKey;
    if (this.props.answeredNonMultipleChoiceCorrectly) {
      attemptKey = getLatestAttempt(this.props.question.attempts).response.key;
    }
    return responsesToRender.map((response, index) => {
      const active = attemptKey === response.key ? 'active' : '';
      return (
        <li key={index} className={`top-answer-list-item ${active}`}>
          <div className="top-answer-list-item-index">
            {`${index + 1}. `}
          </div>
          <div className="top-answer-list-item-text" dangerouslySetInnerHTML={{ __html: this.findDiffs(response.text), }} />
        </li>
      );
    });
  },

  render() {
    const listStyle = {
      listStyle: 'none',
      marginLeft: '1em',
    };
    return (
      <div className="end-state-container">
        {this.renderStaticText()}
        <div className="top-answer-text">
          <ul className="top-answer-list">
            {this.renderTopThreeResponses()}
          </ul>
        </div>
      </div>
    );
  },
});

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

function select(state) {
  return {
    questions: state.questions,
  };
}
export default connect(select)(EndState);
