import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayFillInTheBlankQuestion from '../studentLessons/fillInBlank.tsx';
import { clearData, loadData, nextQuestion, submitResponse } from '../../actions.js';

class TestQuestion extends Component {
  
  state = {
    responsesForGrading: [],
    allResponses: [],
    key: 0,
  };

  componentDidMount() {
    this.reset();
  }

  getQuestion = () => {
    const { fillInBlank, match } = this.props
    const { data } = fillInBlank
    const { params } = match
    const { questionID } = params
    return data[questionID];
  }

  setResponse = (response) => {
    this.setState({ gradedResponse: response })
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
        type: 'FB',
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
    dispatch(submitResponse(response))
  }

  renderGrading = () => {
    const { gradedResponse, } = this.state
    if (gradedResponse) {
      const {author, feedback} = gradedResponse.response
      return (
        <div style={{marginTop: '30px'}}>
          <p>Author: {author}</p>
          <p>Feedback: {feedback}</p>
        </div>
      )
    }
  }

  render() {
    const { playLesson, dispatch, conceptsFeedback, } = this.props
    const { currentQuestion } = playLesson
    const { key, } = this.state
    if (currentQuestion) {
      const { question } = currentQuestion
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
