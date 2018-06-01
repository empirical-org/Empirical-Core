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
    if (this.props.playLesson.currentQuestion) {
      const { question, } = this.props.playLesson.currentQuestion;
      console.log(question);
      return (
        <div className="test-question-container">
          <PlayLessonQuestion key={this.state.key} question={question} prefill={false} nextQuestion={this.reset} dispatch={this.props.dispatch} />
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
  };
}

export default connect(select)(TestQuestion);
