import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearData, loadData, nextQuestion, submitResponse, updateCurrentQuestion } from '../../actions/diagnostics.js';
import PlaySentenceFragment from '../diagnostics/sentenceFragment.jsx';

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
    const { match } = this.props
    const { params } = match
    const { questionID } = params

    const question = this.getQuestion();
    question.key = questionID;
    return [
      {
        type: 'SF',
        data: question,
      }
    ];
  }

  startActivity = (name = 'Triangle') => {
    const { dispatch, } = this.props

    const action = loadData(this.questionsForLesson());
    dispatch(action);
    const next = nextQuestion();
    dispatch(next);
  }

  getQuestion = () => {
    const { sentenceFragments, match } = this.props
    const { data } = sentenceFragments
    const { params } = match
    const { questionID } = params

    return data[questionID];
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
    const { playDiagnostic, match, dispatch, } = this.props
    const { currentQuestion } = playDiagnostic
    const { params } = match
    const { questionID } = params

    if (currentQuestion) {
      const { data } = currentQuestion
      return (
        <div className="test-question-container">
          <PlaySentenceFragment
            currentKey={questionID}
            dispatch={dispatch}
            key={questionID}
            markIdentify={this.markIdentify}
            nextQuestion={this.reset}
            prefill={false}
            question={data}
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
