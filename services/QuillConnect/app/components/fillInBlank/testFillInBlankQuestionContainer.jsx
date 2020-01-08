import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayFillInTheBlankQuestion from '../studentLessons/fillInBlank.tsx';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion, resumePreviousSession } from '../../actions.js';

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
    if (!question.attempts) {
      question.attempts = []
    }
    return [
      {
        type: 'FB',
        question,
      }
    ];
  }

  startActivity = () => {
    const { dispatch, } = this.props
    const action = loadData(this.questionsForLesson());
    dispatch(action);
    const next = nextQuestion();
    dispatch(next);
  }

  getQuestion = () => {
    const { fillInBlank, params, } = this.props
    const fillInBlank = fillInBlank;
    return fillInBlank.data[params.questionID];
  }

  renderGrading = () => {
    const { gradedResponse, } = this.state
    if (gradedResponse) {
      const {author, feedback} = gradedResponse.response
      return (<div style={{marginTop: '30px'}}>
        <p>Author: {author}</p>
        <p>Feedback: {feedback}</p>
      </div>)
    }
  }

  setResponse = (response) => {
    this.setState({ gradedResponse: response })
  }

  submitResponse = (response) => {
    const { dispatch, } = this.props
    ispatch(submitResponse(response))
  }

  render() {
    const { playLesson, dispatch, conceptsFeedback, } = this.props
    const { key, } = this.state
    if (playLesson.currentQuestion) {
      const question = playLesson.currentQuestion.question;
      return (
        <div>
          <div className="test-question-container">
            <PlayFillInTheBlankQuestion
              conceptsFeedback={conceptsFeedback}
              dispatch={dispatch}
              key={key}
              nextQuestion={this.reset}
              prefill={false}
              question={question}
              setResponse={this.setResponse}
              submitResponse={this.submitResponse}
            />
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
    conceptsFeedback: props.conceptsFeedback,
    fillInBlank: props.fillInBlank,
    playLesson: props.playLesson
  };
}

export default connect(select)(TestQuestion);
