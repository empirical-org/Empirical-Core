import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlaySentenceFragment from '../studentLessons/sentenceFragment.jsx';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion, resumePreviousSession } from '../../actions.js';

class TestQuestion extends Component {
  constructor() {
    super();
    this.reset = this.reset.bind(this);
    this.markIdentify = this.markIdentify.bind(this);
    this.submitResponse = this.submitResponse.bind(this);
    this.state = {
      responsesForGrading: [],
      allResponses: [],
      key: 0,
    };
  }

  componentDidMount() {
    this.reset();
  }

  reset() {
    this.props.dispatch(clearData());
    this.startActivity();
    this.setState({ key: this.state.key + 1, });
  }

  questionsForLesson() {
    const question = this.getQuestion();
    question.key = this.props.params.questionID;
    if (!question.attempts) {
      question.attempts = []
    }
    return [
      {
        type: 'SF',
        question,
      }
    ];
  }

  startActivity(name = 'Triangle') {
    const action = loadData(this.questionsForLesson());
    this.props.dispatch(action);
    const next = nextQuestion();
    this.props.dispatch(next);
  }

  getQuestion() {
    return this.props.sentenceFragments.data[this.props.params.questionID];
  }

  markIdentify(bool) {
    const action = updateCurrentQuestion({identified: bool})
    this.props.dispatch(action)
  }

  submitResponse(response) {
    const action = submitResponse(response);
    this.props.dispatch(action);
  }

  render() {
    if (this.props.playLesson.currentQuestion) {
      const question = this.props.playLesson.currentQuestion.question;
      return (
        <div className="test-question-container">
          <PlaySentenceFragment
            currentKey={this.props.params.questionID}
            key={this.props.params.questionID}
            question={question}
            prefill={false}
            nextQuestion={this.reset}
            dispatch={this.props.dispatch}
            markIdentify={this.markIdentify}
            updateAttempts={this.submitResponse}
          />
        </div>
      );
    } else {
      return (
        <p>Loading...</p>
      );
    }
  }

}

function select(props) {
  return {
    sentenceFragments: props.sentenceFragments,
    playLesson: props.playLesson,
  };
}

export default connect(select)(TestQuestion);
