import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearData, loadData, nextQuestion, submitResponse, updateCurrentQuestion } from '../../actions.js';
import PlaySentenceFragment from '../studentLessons/sentenceFragment.jsx';

class TestQuestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      responsesForGrading: [],
      allResponses: [],
      key: 0,
    };
  }

  componentDidMount() {
    this.reset();
  }

  getQuestion = () => {
    const { sentenceFragments, match } = this.props
    const { params } = match
    const { questionID } = params
    const { data } = sentenceFragments
    return data[questionID];
  }

  markIdentify = (bool) => {
    const { dispatch, } = this.props
    const action = updateCurrentQuestion({identified: bool})
    dispatch(action)
  }

  questionsForLesson = () => {
    const { match } = this.props
    const { params } = match
    const { questionID } = params
    let question = this.getQuestion();
    question.key = questionID;
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

  reset = () => {
    const { dispatch, } = this.props
    dispatch(clearData());
    this.startActivity();
    this.setState(prevState => ({ key: prevState.key + 1, }));
  }

  startActivity = () => {
    const { dispatch, } = this.props
    const action = loadData(this.questionsForLesson());
    dispatch(action);
    const next = nextQuestion();
    dispatch(next);
  }

  submitResponse = (response) => {
    const { dispatch, } = this.props
    const action = submitResponse(response);
    dispatch(action);
  }

  render() {
    const { playLesson, conceptsFeedback, match, dispatch } = this.props
    const { currentQuestion } = playLesson
    const { params } = match
    const { questionID } = params

    if (currentQuestion) {
      const { question } = currentQuestion
      return (
        <div className="test-question-container">
          <PlaySentenceFragment
            conceptsFeedback={conceptsFeedback}
            currentKey={questionID}
            dispatch={dispatch}
            key={questionID}
            markIdentify={this.markIdentify}
            nextQuestion={this.reset}
            prefill={false}
            question={question}
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
    conceptsFeedback: props.conceptsFeedback,
    sentenceFragments: props.sentenceFragments,
    playLesson: props.playLesson,
  };
}

export default connect(select)(TestQuestion);
