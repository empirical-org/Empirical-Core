import * as React from 'react';
import { connect } from 'react-redux';
import PlayQuestion from '../grammarActivities/question';
import { setSessionReducer, goToNextQuestion, checkAnswer } from '../../actions/session';

class TestQuestion extends React.Component {
  constructor() {
    super();
    this.state = {
      responsesForGrading: [],
      allResponses: [],
      key: 0,
    };

    this.reset = this.reset.bind(this)
    this.questionsForLesson = this.questionsForLesson.bind(this)
    this.startActivity = this.startActivity.bind(this)
    this.getQuestion = this.getQuestion.bind(this)
    this.checkAnswer = this.checkAnswer.bind(this)
  }

  componentDidMount() {
    this.reset();
  }

  componentWillUnmount() {
    this.props.dispatch(setSessionReducer({}));
  }

  reset() {
    this.props.dispatch(setSessionReducer({}));
    this.startActivity();
    this.setState({ key: this.state.key + 1, });
  }

  questionsForLesson() {
    const question = this.getQuestion();
    question.uid = this.props.match.params.questionID;
    return [
      question
    ];
  }

  startActivity() {
    const session = {
      hasreceiveddata: true,
      answeredQuestions: [],
      unansweredQuestions: this.questionsForLesson(),
      currentQuestion: this.getQuestion(),
    }
    const action = setSessionReducer(session);
    this.props.dispatch(action);
    const next = goToNextQuestion();
    this.props.dispatch(next);
  }

  getQuestion() {
    return this.props.questions.data[this.props.match.params.questionID];
  }

  checkAnswer(response:string, question, responses, isFirstAttempt:Boolean) {
    this.props.dispatch(checkAnswer(response, question, responses, isFirstAttempt))
  }

  render() {
    if (this.props.session.currentQuestion) {
      const { currentQuestion, answeredQuestions, unansweredQuestions } = this.props.session;
      return (
        <div className="test-question-container">
          <PlayQuestion
            currentQuestion={currentQuestion}
            answeredQuestions={answeredQuestions}
            goToNextQuestion={this.reset}
            unansweredQuestions={unansweredQuestions}
            activity={{title: 'Test Question', concepts: {}, description: ''}}
            checkAnswer={this.checkAnswer}
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
    session: props.session,
  };
}

export default connect(select)(TestQuestion);
