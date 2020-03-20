import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayFillInTheBlankQuestion from './playFillInTheBlankQuestion';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion, resumePreviousSession } from '../../actions/diagnostics.js';

class TestQuestion extends Component {
  constructor() {
    super();
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
    const { dispatch } = this.props;
    const { key } = this.state;
    dispatch(clearData());
    this.startActivity();
    this.setState({ key: key + 1, });
  };

  questionsForLesson() {
    const { params } = this.props;
    const { questionID } = params;
    const question = this.getQuestion();
    question.key = questionID;
    return [
      {
        type: 'FB',
        data: question,
      }
    ];
  }

  startActivity(name = 'Triangle') {
    const { dispatch } = this.props;
    const action = loadData(this.questionsForLesson());
    dispatch(action);
    const next = nextQuestion();
    dispatch(next);
  }

  getQuestion() {
    const { fillInBlank, params } = this.props;
    const { data } = fillInBlank;
    const { questionID } = params;
    return data[questionID];
  }

  renderGrading() {
    const { gradedResponse } = this.state;
    const { response } = gradedResponse;
    const { author, feedback } = response;
    if (gradedResponse) {
      return (<div style={{marginTop: '30px'}}>
        <p>Author: {author}</p>
        <p>Feedback: {feedback}</p>
      </div>)
    }
  }

  setResponse = response => {
    this.setState({gradedResponse: response})
  };

  render() {
    const { dispatch, playDiagnostic } = this.props;
    const { key } = this.state;
    const { currentQuestion } = playDiagnostic;
    const { data } = currentQuestion;
    if (currentQuestion) {
      const question = data;
      return (
        <div>
          <div className="test-question-container">
            <PlayFillInTheBlankQuestion dispatch={dispatch} key={key} nextQuestion={this.reset} prefill={false} question={question} setResponse={this.setResponse} />
          </div>
          {this.renderGrading()}
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
    fillInBlank: props.fillInBlank,
    playDiagnostic: props.playDiagnostic,
  };
}

export default connect(select)(TestQuestion);
