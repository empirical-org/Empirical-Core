import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearData, loadData, nextQuestion } from '../../actions.js';
import PlayLessonQuestion from '../studentLessons/question';

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

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(clearData());
  }

  getQuestion = () => {
    const { match, questions } = this.props
    const { data } = questions
    const { params } = match
    const { questionID } = params
    return data[questionID];
  }

  questionsForLesson = () => {
    let question = this.getQuestion();
    const { match } = this.props
    const { params } = match
    const { questionID } = params
    question.key = questionID;
    return [
      {
        type: 'SC',
        question,
      }
    ];
  }

  reset = () => {
    const { dispatch } = this.props
    dispatch(clearData());
    this.startActivity();
    this.setState(prevState =>  ({ key: prevState.key + 1 }));
  };

  startActivity = (name = 'Triangle') => {
    const { dispatch } = this.props
    const action = loadData(this.questionsForLesson());
    dispatch(action);
    const next = nextQuestion();
    dispatch(next);
  }

  render() {
    const { key } = this.state
    const { playLesson, conceptsFeedback, dispatch, } = this.props
    const { currentQuestion } = playLesson
    if (currentQuestion) {
      const { question } = currentQuestion;
      return (
        <div className="test-question-container">
          <PlayLessonQuestion
            conceptsFeedback={conceptsFeedback}
            dispatch={dispatch}
            isAdmin={true}
            key={key}
            nextQuestion={this.reset}
            prefill={false}
            question={question}
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
