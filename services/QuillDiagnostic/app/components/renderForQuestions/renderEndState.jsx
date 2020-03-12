import React from 'react';
import _ from 'underscore';
import {
  hashToCollection,
  Feedback
} from 'quill-component-library/dist/componentLibrary';
import { connect } from 'react-redux';
const jsDiff = require('diff');

class EndState extends React.Component {

  renderStaticText = () => {
    const { answeredNonMultipleChoiceCorrectly, multipleChoiceCorrect, } = this.props
    let message = '';
    if (answeredNonMultipleChoiceCorrectly || multipleChoiceCorrect) {
      message = 'Good work! Here are the most popular strong answers:';
    } else {
      message = 'Keep going! Here are the most popular strong answers:';
    }
    return (
      <Feedback
        feedback={(<p>{message}</p>)}
        feedbackType="continue"
        key="end-state"
      />
    );
  }

  returnSanitizedArray(str) {
    return str.toLowerCase().replace(/\n/g, ' ').replace(/(<([^>]+)>)/ig, ' ').replace(/&nbsp;/g, '').replace(/[.",\/#?!$%\^&\*;:{}=\_`~()]/g, '').split(' ').sort().join(' ').trim().split(' ');
  }

  findDiffs(answer) {
    const { question, } = this.props
    let styledString = answer;
    const sanitizedQuestionArray = this.returnSanitizedArray(question.prompt);
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
  }

  renderTopThreeResponses = () => {
    const { responses, question, answeredNonMultipleChoiceCorrectly, } = this.props
    let selectedResponses = responses
    selectedResponses = hashToCollection(selectedResponses);
    selectedResponses = selectedResponses.filter(response => response.optimal).sort((a, b) => b.count - a.count);
    const responsesToRender = _.first(selectedResponses, 3);
    const sum = _.reduce(responsesToRender, (memo, response) => memo + response.count, 0);
    let attemptKey;
    if (answeredNonMultipleChoiceCorrectly) {
      attemptKey = getLatestAttempt(question.attempts).response.key;
    }
    return responsesToRender.map((response, index) => {
      const active = attemptKey === response.key ? 'active' : '';
      return (
        <li className={`top-answer-list-item ${active}`} key={index}>
          <div className="top-answer-list-item-index">
            {`${index + 1}. `}
          </div>
          <div className="top-answer-list-item-text" dangerouslySetInnerHTML={{ __html: this.findDiffs(response.text), }} />
        </li>
      );
    });
  }

  render = () => {
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
  }
}

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
