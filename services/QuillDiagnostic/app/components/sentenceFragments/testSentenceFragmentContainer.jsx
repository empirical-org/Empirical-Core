import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlaySentenceFragment from '../diagnostics/sentenceFragment.jsx';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion, resumePreviousSession } from '../../actions/diagnostics.js';

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

  reset = () => {
    const { dispatch, } = this.props
    dispatch(clearData());
    this.startActivity();
    this.setState(prevState => ({ key: prevState.key + 1, }));
  }

  questionsForLesson = () => {
    const { params, } = this.props

    const question = this.getQuestion();
    question.key = params.questionID;
    return [
      {
        type: 'SF',
        data: question,
      }
    ];
  }

  startActivity(name = 'Triangle') {
    const { dispatch, } = this.props

    const action = loadData(this.questionsForLesson());
    dispatch(action);
    const next = nextQuestion();
    dispatch(next);
  }

  getQuestion = () => {
    const { sentenceFragments, params, } = this.props

    return sentenceFragments.data[params.questionID];
  }

  markIdentify = (bool) => {
    const { dispatch, } = this.props

    const action = updateCurrentQuestion({identified: bool})
    dispatch(action)
  }

  submitResponse = (response) => {
    const { dispatch, } = this.props

    const action = submitResponse(response);
    dispatch(action);
  }

  render() {
    const { playDiagnostic, params, dispatch, } = this.props

    if (playDiagnostic.currentQuestion) {
      const question = playDiagnostic.currentQuestion.data;
      return (
        <div className="test-question-container">
          <PlaySentenceFragment
            currentKey={params.questionID}
            dispatch={dispatch}
            key={params.questionID}
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
    sentenceFragments: props.sentenceFragments,
    playDiagnostic: props.playDiagnostic,
  };
}

export default connect(select)(TestQuestion);
