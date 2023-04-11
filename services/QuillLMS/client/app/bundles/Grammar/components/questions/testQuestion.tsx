import * as React from 'react';
import { connect } from 'react-redux';
import { checkAnswer, goToNextQuestion, setSessionReducer } from '../../actions/session';
import PlayQuestion from '../grammarActivities/question';

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

  checkAnswer(response: string, question, responses, isFirstAttempt: Boolean) {
    this.props.dispatch(checkAnswer(response, question, responses, isFirstAttempt))
  }

  render() {
    if (this.props.session.currentQuestion) {
      const { currentQuestion, answeredQuestions, unansweredQuestions } = this.props.session;
      return (
        <div className="test-question-container">
          <PlayQuestion
            activity={{title: 'Test Question', concepts: {}, description: ''}}
            answeredQuestions={answeredQuestions}
            checkAnswer={this.checkAnswer}
            concepts={this.props.concepts}
            conceptsFeedback={this.props.conceptsFeedback}
            currentQuestion={currentQuestion}
            goToNextQuestion={this.reset}
            unansweredQuestions={unansweredQuestions}
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
    conceptsFeedback: props.conceptsFeedback,
    concepts: props.concepts
  };
}

export default connect(select)(TestQuestion);
