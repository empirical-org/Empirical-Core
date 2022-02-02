import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom';
import {clearData, loadData, nextQuestion, submitResponse, updateCurrentQuestion} from '../../actions/diagnostics.js'
import _ from 'underscore'
import {
  CarouselAnimation,
  SmartSpinner,
  PlayTitleCard,
  ProgressBar
} from '../../../Shared/index';
import PlaySentenceFragment from '../diagnostics/sentenceFragment.jsx'
import PlayDiagnosticQuestion from '../diagnostics/sentenceCombining.jsx';
import PlayFillInTheBlankQuestion from '../fillInBlank/playFillInTheBlankQuestion';
import LandingPage from './landing.jsx'
import FinishedDiagnostic from './finishedDiagnostic.jsx'
import {getConceptResultsForAllQuestions} from '../../libs/conceptResults/diagnostic'
import { getParameterByName } from '../../libs/getParameterByName';
import {
  questionCount,
  answeredQuestionCount,
  getProgressPercent
} from '../../libs/calculateProgress'

const request = require('request');

class TurkDiagnostic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      saved: false,
      sessionID: this.getSessionId(),
      hasOrIsGettingResponses: false,
    }
  }

  UNSAFE_componentWillMount() {
    const { dispatch, } = this.props
    const { sessionID, } = this.state
    dispatch(clearData());
    if (sessionID) {
      SessionActions.get(sessionID, (data) => {
        this.setState({ session: data, });
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { playDiagnostic, } = this.props
    if (nextProps.playDiagnostic.answeredQuestions.length !== playDiagnostic.answeredQuestions.length) {
      this.saveSessionData(nextProps.playDiagnostic);
    }
  }

  resumeSession = (data) => {
    if (!data) { return }

    const { dispatch, } = this.props
    dispatch(resumePreviousDiagnosticSession(data));
  }

  getSessionId = () => {
    return getParameterByName('student') === 'null' ? undefined : getParameterByName('student')
  }

  saveSessionData = (lessonData) => {
    const { sessionID, } = this.state

    if (!sessionID) { return }
    SessionActions.update(sessionID, lessonData);
  }

  saveToLMS = () => {
    const { sessionID, } = this.state
    const { playDiagnostic, match, } = this.props
    const { params } = match
    const { diagnosticID } = params

    this.setState({ error: false, });
    const relevantAnsweredQuestions = playDiagnostic.answeredQuestions.filter(q => q.questionType !== TITLE_CARD_TYPE)
    const results = getConceptResultsForAllQuestions(relevantAnsweredQuestions);

    if (sessionID) {
      this.finishActivitySession(sessionID, results, 1);
    } else {
      this.createAnonActivitySession(diagnosticID, results, 1);
    }
  }

  finishActivitySession = (sessionID, results, score) => {
    request(
      { url: `${process.env.DEFAULT_URL}/api/v1/activity_sessions/${sessionID}`,
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
      { url: `${process.env.DEFAULT_URL}/api/v1/activity_sessions/`,
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

  handleSmartSpinnerMount = () => this.loadQuestionSet()

  loadQuestionSet = () => {
    const { dispatch, } = this.props
    const data = this.questionsForLesson();
    const action = loadData(data);
    dispatch(action);
  }

  nextQuestion = () => {
    const { dispatch, } = this.props
    const next = nextQuestion();
    dispatch(next);
  }

  questionsForLesson = () => {
    const { lessons, match, } = this.props
    const { data, } = lessons
    const { params } = match
    const { diagnosticID, } = params
    const filteredQuestions = data[diagnosticID].questions.filter(ques => {
      return this.props[ques.questionType] ? this.props[ques.questionType].data[ques.key] : null  // eslint-disable-line react/destructuring-assignment
    });
    // this is a quickfix for missing questions -- if we leave this in here
    // long term, we should return an array through a forloop to
    // cut the time from 2N to N
    return filteredQuestions.map((questionItem) => {
      const questionType = questionItem.questionType;
      const key = questionItem.key;
      const question = this.props[questionType].data[key]; // eslint-disable-line react/destructuring-assignment
      question.key = key;
      question.attempts = question.attempts ? question.attempts : []
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
      return { type, data: question, };
    });
  }

  getQuestionCount = () => {
    const { match } = this.props
    const { params } = match
    const { diagnosticID, } = params;
    if (diagnosticID == 'researchDiagnostic') {
      return '15';
    }
    return '22';
  }

  markIdentify = (bool) => {
    const { dispatch, } = this.props
    const action = updateCurrentQuestion({ identified: bool, });
    dispatch(action);
  }

  getProgressPercent = () => {
    const { playDiagnostic, } = this.props
    let percent;

    if (playDiagnostic && playDiagnostic.unansweredQuestions && playDiagnostic.questionSet) {
      const questionSetCount = playDiagnostic.questionSet.length;
      const answeredQuestionCount = questionSetCount - playDiagnostic.unansweredQuestions.length;
      if (playDiagnostic.currentQuestion) {
        percent = ((answeredQuestionCount - 1) / questionSetCount) * 100;
      } else {
        percent = ((answeredQuestionCount) / questionSetCount) * 100;
      }
    } else {
      percent = 0;
    }

    return percent;
  }

  landingPageHtml() {
    const { lessons, match, } = this.props
    const { data } = lessons
    const { params } = match
    const { diagnosticID } = params
    return data[diagnosticID].landingPageHtml
  }

  renderProgressBar = () => {
    const { playDiagnostic, } = this.props
    if (!playDiagnostic.currentQuestion) { return }

    const calculatedAnsweredQuestionCount = answeredQuestionCount(playDiagnostic)

    const currentQuestionIsTitleCard = playDiagnostic.currentQuestion.type === 'TL'
    const currentQuestionIsNotFirstQuestion = calculatedAnsweredQuestionCount !== 0

    const displayedAnsweredQuestionCount = currentQuestionIsTitleCard && currentQuestionIsNotFirstQuestion ? calculatedAnsweredQuestionCount + 1 : calculatedAnsweredQuestionCount

    return (
      <ProgressBar
        answeredQuestionCount={displayedAnsweredQuestionCount}
        label='questions'
        percent={getProgressPercent(playDiagnostic)}
        questionCount={questionCount(playDiagnostic)}
      />
    )
  }

  render() {
    const { session, error, saved, } = this.state
    const { playDiagnostic, questions, sentenceFragments, dispatch, } = this.props
    const questionType = playDiagnostic.currentQuestion ? playDiagnostic.currentQuestion.type : ''

    let component;
    if (questions.hasreceiveddata && sentenceFragments.hasreceiveddata) {
      if (!playDiagnostic.questionSet) {
        component = (<SmartSpinner key="step2" message='Loading Your Lesson 50%' onMount={this.handleSmartSpinnerMount} />);
      } else if (playDiagnostic.currentQuestion) {
        if (questionType === 'SC') {
          component = (<PlayDiagnosticQuestion
            dispatch={dispatch}
            key={playDiagnostic.currentQuestion.data.key}
            marking="diagnostic"
            nextQuestion={this.nextQuestion}
            question={playDiagnostic.currentQuestion.data}
          />);
        } else if (questionType === 'SF') {
          component = (<PlaySentenceFragment
            currentKey={playDiagnostic.currentQuestion.data.key}
            dispatch={dispatch}
            key={playDiagnostic.currentQuestion.data.key}
            markIdentify={this.markIdentify}
            nextQuestion={this.nextQuestion}
            question={playDiagnostic.currentQuestion.data}
            updateAttempts={this.submitResponse}
          />);
        } else if (questionType === 'FB') {
          component = (<PlayFillInTheBlankQuestion
            currentKey={playDiagnostic.currentQuestion.data.key}
            dispatch={dispatch}
            key={playDiagnostic.currentQuestion.data.key}
            nextQuestion={this.nextQuestion}
            question={playDiagnostic.currentQuestion.data}
          />);
        } else if (questionType === 'TL') {
          component = (
            <PlayTitleCard
              currentKey={playDiagnostic.currentQuestion.data.key}
              data={playDiagnostic.currentQuestion.data}
              dispatch={dispatch}
              handleContinueClick={this.nextQuestion}
            />
          );
        }
      } else if (playDiagnostic.answeredQuestions.length > 0 && playDiagnostic.unansweredQuestions.length === 0) {
        component = (<FinishedDiagnostic error={error} saved={saved} saveToLMS={this.saveToLMS} />);
      } else {
        component = (<LandingPage
          begin={this.nextQuestion}
          landingPageHtml={this.landingPageHtml()}
          questionCount={this.getQuestionCount()}
          resumeActivity={this.resumeSession}
          session={session}
        />);
      }
    } else {
      component = (<SmartSpinner key="step1" message='Loading Your Lesson 25%' />);
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

function select(state, props) {
  return {
    routing: state.routing,
    match: props.match,
    questions: state.questions,
    playDiagnostic: state.playDiagnostic,
    sentenceFragments: state.sentenceFragments,
    fillInBlank: state.fillInBlank,
    sessions: state.sessions,
    lessons: state.lessons,
    titleCards: state.titleCards
  };
}
export default withRouter(connect(select)(TurkDiagnostic));
