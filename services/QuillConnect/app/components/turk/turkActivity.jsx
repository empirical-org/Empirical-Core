import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import {
  hashToCollection,
  Spinner,
  CarouselAnimation,
  PlayTitleCard
} from 'quill-component-library/dist/componentLibrary';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion } from '../../actions/turk.js';
import diagnosticQuestions from './diagnosticQuestions.jsx';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayFillInTheBlankQuestion from './fillInBlank.tsx';
import PlayTurkQuestion from './question.tsx';
import LandingPage from './landing.jsx';
import FinishedDiagnostic from './finishedDiagnostic.jsx';

export class TurkActivity extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      saved: false,
    }
  }

  componentWillMount() {
    const { dispatch, } = this.props
    dispatch(clearData());
  }

  saveToLMS = () => {
    this.setState({ saved: true, });
  }

  submitResponse = (response) => {
    const { dispatch, } = this.props
    const action = submitResponse(response);
    dispatch(action);
  }

  startActivity = () => {
    const { dispatch, } = this.props
    const action = loadData(this.questionsForLesson());
    dispatch(action);
    const next = nextQuestion();
    dispatch(next);
  }

  nextQuestion = () => {
    const { dispatch, } = this.props
    const next = nextQuestion();
    dispatch(next);
  }

  getLesson = () => {
    const { lessons, params, } = this.props
    return lessons.data[params.lessonID];
  }

  questionsForLesson = () => {
    const { lessons, params, } = this.props
    const { data, } = lessons
    const { lessonID, } = params

    const filteredQuestions = data[lessonID].questions.filter(ques =>
       this.props[ques.questionType].data[ques.key]  // eslint-disable-line react/destructuring-assignment
    );
    // this is a quickfix for missing questions -- if we leave this in here
    // long term, we should return an array through a forloop to
    // cut the time from 2N to N
    return filteredQuestions.map((questionItem) => {
      const questionType = questionItem.questionType;
      const key = questionItem.key;
      const data = this.props[questionType].data[key]; // eslint-disable-line react/destructuring-assignment
      data.key = key;
      const type = questionType === 'questions' ? 'SC' : 'SF';
      return { type, data, };
    });
  }

  getData = () => {
    const { params, } = this.props
    if (params.lessonID) {
      return this.questionsForLesson();
    }
    return diagnosticQuestions();
  }

  markIdentify = (bool) => {
    const { dispatch, } = this.props
    const action = updateCurrentQuestion({ identified: bool, });
    dispatch(action);
  }

  getProgressPercent = () => {
    const { playTurk, } = this.props
    if (!(playTurk && playTurk.answeredQuestions && playTurk.questionSet)) { return }

    return playTurk.answeredQuestions.length / playTurk.questionSet.length * 100;
  }

  render() {
    const { saved, } = this.state
    const { lessons, params, playTurk, questions, sentenceFragments, dispatch, } = this.props
    const { data, } = lessons
    const { lessonID, } = params
    const questionType = playTurk.currentQuestion ? playTurk.currentQuestion.type : ''
    let component;
    if (questions.hasreceiveddata && sentenceFragments.hasreceiveddata) {
      if (data[lessonID]) {
        if (playTurk.currentQuestion) {
          if (questionType === 'SC') {
            component = (<PlayTurkQuestion
              dispatch={dispatch}
              key={playTurk.currentQuestion.data.key}
              nextQuestion={this.nextQuestion}
              question={playTurk.currentQuestion.data}
              submitResponse={this.submitResponse}
            />);
          } else if (questionType === 'SF') {
            component = (<PlaySentenceFragment
              currentKey={playTurk.currentQuestion.data.key}
              dispatch={dispatch}
              key={playTurk.currentQuestion.data.key}
              markIdentify={this.markIdentify}
              nextQuestion={this.nextQuestion}
              question={playTurk.currentQuestion.data}
              updateAttempts={this.submitResponse}
            />);
          } else if (questionType === 'FB') {
            component = (<PlayFillInTheBlankQuestion
              currentKey={playTurk.currentQuestion.data.key}
              dispatch={dispatch}
              key={playTurk.currentQuestion.data.key}
              nextQuestion={this.nextQuestion}
              question={playTurk.currentQuestion.data}
              submitResponse={this.submitResponse}
            />)
          } else if (questionType === 'TL') {
            component = (
              <PlayTitleCard
                currentKey={playTurk.currentQuestion.data.key}
                data={playTurk.currentQuestion.data}
                dispatch={dispatch}
                nextQuestion={this.nextQuestionWithoutSaving}
              />
            );
          }
        } else if (playTurk.answeredQuestions.length > 0 && playTurk.unansweredQuestions.length === 0) {
          component = (<FinishedDiagnostic saved={saved} saveToLMS={this.saveToLMS} />);
        } else {
          component = <LandingPage begin={this.startActivity} lesson={this.getLesson()} />;
        }
      }
    } else {
      component = (<Spinner />);
    }

    return (
      <div>
        <progress className="progress diagnostic-progress" max="100" value={this.getProgressPercent()}>15%</progress>
        <section className="section is-fullheight minus-nav student">
          <div className="student-container student-container-diagnostic">
            <CarouselAnimation>
              {component}
            </CarouselAnimation>
          </div>
        </section>
      </div>
    );
  }
}

function select(state) {
  return {
    lessons: state.lessons,
    routing: state.routing,
    questions: state.questions,
    playTurk: state.playTurk,
    sentenceFragments: state.sentenceFragments,
    titleCards: state.titleCards,
    fillInBlank: state.fillInBlank
  };
}
export default connect(select)(TurkActivity);
