import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayFillInTheBlankQuestion from '../studentLessons/fillInBlank.tsx';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion, resumePreviousSession } from '../../actions.js';

class TestQuestion extends Component {
  constructor() {
    super();
    this.state = {
      responsesForGrading: [],
      allResponses: [],
      key: 0,
    };

    this.setResponse = this.setResponse.bind(this)
    this.reset = this.reset.bind(this);
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
    return [
      {
        type: 'FB',
        data: question,
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
    return this.props.fillInBlank.data[this.props.params.questionID];
  }

  renderGrading() {
    if (this.state.gradedResponse) {
      const {author, feedback} = this.state.gradedResponse.response
      return <div style={{marginTop: '30px'}}>
        <p>Author: {author}</p>
        <p>Feedback: {feedback}</p>
      </div>
    }
  }

  setResponse(response) {
    this.setState({gradedResponse: response})
  }

  render() {
    if (this.props.playLesson.currentQuestion) {
      const question = this.props.playLesson.currentQuestion.data;
      console.log(question);
      return (
        <div>
          <div className="test-question-container">
            <PlayFillInTheBlankQuestion
              key={this.state.key}
              question={question}
              prefill={false}
              nextQuestion={this.reset}
              dispatch={this.props.dispatch}
              setResponse={this.setResponse}
              submitResponse={submitResponse}
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
    fillInBlank: props.fillInBlank,
    playLesson: props.playLesson
  };
}

export default connect(select)(TestQuestion);
