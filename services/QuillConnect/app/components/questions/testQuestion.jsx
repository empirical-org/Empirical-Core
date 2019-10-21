import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayLessonQuestion from '../studentLessons/question';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion, resumePreviousSession } from '../../actions.js';

class TestQuestion extends Component {
  constructor() {
    super();
    this.reset = this.reset.bind(this);
    this.state = {
      responsesForGrading: [],
      allResponses: [],
      key: 0,
    };
  }

  componentDidMount() {
    this.reset();
  }

  componentWillUnmount() {
    this.props.dispatch(clearData());
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
        type: 'SC',
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
    return this.props.questions.data[this.props.params.questionID];
  }

  render() {
    const { playLesson, conceptsFeedback, dispatch, } = this.props
    if (playLesson.currentQuestion) {
      const { question, } = playLesson.currentQuestion;
      return (
        <div className="test-question-container">
          <PlayLessonQuestion
            dispatch={dispatch}
            key={this.state.key}
            nextQuestion={this.reset}
            prefill={false}
            question={question}
            conceptsFeedback={conceptsFeedback}
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
    questions: props.questions,
    playLesson: props.playLesson,
    conceptsFeedback: props.conceptsFeedback
  };
}

export default connect(select)(TestQuestion);
