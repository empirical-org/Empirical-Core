import React from 'react';
import { connect } from 'react-redux';
import * as request from 'request'
import _ from 'underscore';
import {
  hashToCollection,
  Spinner,
  CarouselAnimation,
  PlayTitleCard,
  ProgressBar
} from 'quill-component-library/dist/componentLibrary';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion } from '../../actions/turk.js';
import diagnosticQuestions from './diagnosticQuestions.jsx';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayFillInTheBlankQuestion from './fillInBlank.tsx';
import PlayTurkQuestion from './question.tsx';
import LandingPage from './landing.jsx';
import FinishedDiagnostic from './finishedDiagnostic.jsx';
import { getConceptResultsForAllQuestions } from '../../libs/conceptResults/diagnostic'
import {
  questionCount,
  answeredQuestionCount,
  getProgressPercent
} from '../../libs/calculateProgress'

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
    const { sessionID, } = this.state
    const { playTurk, params, } = this.props

    this.setState({ error: false, });
    const results = getConceptResultsForAllQuestions(playTurk.answeredQuestions);

    if (sessionID) {
      this.finishActivitySession(sessionID, results, 1);
    } else {
      this.createAnonActivitySession(params.lessonID, results, 1);
    }
  }

  finishActivitySession = (sessionID, results, score) => {
    request(
      { url: `${process.env.EMPIRICAL_BASE_URL}/api/v1/activity_sessions/${sessionID}`,
        method: 'PUT',
        json:
        {
          state: 'finished',
          concept_results: results,
          percentage: score,
        }
      },
      (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          // to do, use Sentry to capture error
          SessionActions.delete(sessionID);
          this.setState({ saved: true, });
        } else {
          // to do, use Sentry to capture error
          this.setState({ saved: false, error: true, });
        }
      }
    );
  }

  createAnonActivitySession = (lessonID, results, score) => {
    request(
      { url: `${process.env.EMPIRICAL_BASE_URL}/api/v1/activity_sessions/`,
        method: 'POST',
        json:
        {
          state: 'finished',
          activity_uid: lessonID,
          concept_results: results,
          percentage: score,
        }
      },
      (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          // to do, use Sentry to capture error
          this.setState({ saved: true, });
        }
      }
    );
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

  renderProgressBar = () => {
    const { playTurk, } = this.props
    if (!playTurk.currentQuestion) { return }

    if (!playTurk.currentQuestion) { return }

    const calculatedAnsweredQuestionCount = answeredQuestionCount(playTurk)

    const currentQuestionIsTitleCard = playTurk.currentQuestion.type === 'TL'
    const currentQuestionIsNotFirstQuestion = calculatedAnsweredQuestionCount !== 0

    const displayedAnsweredQuestionCount = currentQuestionIsTitleCard && currentQuestionIsNotFirstQuestion ? calculatedAnsweredQuestionCount + 1 : calculatedAnsweredQuestionCount

    return (<ProgressBar
      answeredQuestionCount={displayedAnsweredQuestionCount}
      percent={getProgressPercent(playTurk)}
      questionCount={questionCount(playTurk)}
      thingsCompleted='sentences'
    />)
  }


  render() {
    const { saved, } = this.state
    const { lessons, params, playTurk, questions, sentenceFragments, dispatch, conceptsFeedback, } = this.props
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
              conceptsFeedback={conceptsFeedback}
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
                handleContinueClick={this.nextQuestionWithoutSaving}
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
        <section className="section is-fullheight minus-nav student">
          {this.renderProgressBar()}
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
    conceptsFeedback: state.conceptsFeedback,
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
