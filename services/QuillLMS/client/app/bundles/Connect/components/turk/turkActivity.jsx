import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { requestPost, requestPut } from '../../../../modules/request/index';
import {
    CarouselAnimation,
    PlayTitleCard,
    ProgressBar, Spinner
} from '../../../Shared/index';
import { clearData, loadData, nextQuestion, submitResponse, updateCurrentQuestion } from '../../actions/turk.js';
import {
    answeredQuestionCount,
    getProgressPercent, questionCount
} from '../../libs/calculateProgress';
import { getConceptResultsForAllQuestions } from '../../libs/conceptResults/diagnostic';
import diagnosticQuestions from './diagnosticQuestions.jsx';
import PlayFillInTheBlankQuestion from './fillInBlank.tsx';
import FinishedDiagnostic from './finishedDiagnostic.jsx';
import LandingPage from './landing.jsx';
import PlayTurkQuestion from './question.tsx';
import PlaySentenceFragment from './sentenceFragment.jsx';

export class TurkActivity extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      saved: false,
    }
  }

  componentDidMount() {
    const { dispatch, } = this.props
    dispatch(clearData());
  }


  getData = () => {
    const { match } = this.props
    const { params } = match
    const { lessonID } = params
    if (lessonID) {
      return this.questionsForLesson();
    }
    return diagnosticQuestions();
  }

  getLesson = () => {
    const { lessons, match } = this.props
    const { data } = lessons
    const { params } = match
    const { lessonID } = params
    return data[lessonID];
  }

  createAnonActivitySession = (lessonID, results, score) => {
    requestPost(
      `${import.meta.env.VITE_DEFAULT_URL}/api/v1/activity_sessions/`,
      {
        state: 'finished',
        activity_uid: lessonID,
        concept_results: results,
        percentage: score,
      },
      (body) => {
        this.setState({ saved: true, });
      }
    )
  }

  finishActivitySession = (sessionID, results, score) => {
    requestPut(
      `${import.meta.env.VITE_DEFAULT_URL}/api/v1/activity_sessions/${sessionID}`,
      {
        state: 'finished',
        concept_results: results,
        percentage: score,
      },
      (body) => {
        this.setState({ saved: true, });
      },
      (body) => {
        this.setState({ saved: false, error: true, });
      }
    )
  }

  markIdentify = (bool) => {
    const { dispatch, } = this.props
    const action = updateCurrentQuestion({ identified: bool, });
    dispatch(action);
  }

  nextQuestion = () => {
    const { dispatch, } = this.props
    const next = nextQuestion();
    dispatch(next);
  }

  questionsForLesson = () => {
    const { lessons, match } = this.props
    const { params } = match
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
      let type
      switch (questionType) {
        case 'questions':
          type = 'SC'
          break
        case 'fillInBlank':
          type = 'FB'
          break
        case 'titleCards':
          type = 'TL'
          break
        case 'sentenceFragments':
        default:
          type = 'SF'
      }
      return { type, data, };
    });
  }

  saveToLMS = () => {
    const { sessionID, } = this.state
    const { playTurk, match } = this.props
    const { answeredQuestions } = playTurk
    const { params } = match
    const { lessonID } = params

    this.setState({ error: false, });
    const results = getConceptResultsForAllQuestions(answeredQuestions);

    if (sessionID) {
      this.finishActivitySession(sessionID, results, 1);
    } else {
      this.createAnonActivitySession(lessonID, results, 1);
    }
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
    const action = submitResponse(response);
    dispatch(action);
  }

  renderProgressBar = () => {
    const { playTurk, } = this.props

    if (!playTurk.currentQuestion) { return }

    const calculatedAnsweredQuestionCount = answeredQuestionCount(playTurk)
    const currentQuestionIsTitleCard = playTurk.currentQuestion.type === 'TL'
    const currentQuestionIsNotFirstQuestion = calculatedAnsweredQuestionCount !== 0
    const displayedAnsweredQuestionCount = currentQuestionIsTitleCard && currentQuestionIsNotFirstQuestion ? calculatedAnsweredQuestionCount + 1 : calculatedAnsweredQuestionCount

    return (
      <ProgressBar
        answeredQuestionCount={displayedAnsweredQuestionCount}
        label='questions'
        percent={getProgressPercent(playTurk)}
        questionCount={questionCount(playTurk)}
      />
    )
  }


  render() {
    const { saved, } = this.state
    const { lessons, match, playTurk, questions, sentenceFragments, dispatch, conceptsFeedback, } = this.props
    const { data, } = lessons
    const { params } = match
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
export default withRouter(connect(select)(TurkActivity));
