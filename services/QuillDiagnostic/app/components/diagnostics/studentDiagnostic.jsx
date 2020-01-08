import React from 'react';
import { connect } from 'react-redux';
import {
  CarouselAnimation,
  hashToCollection,
  SmartSpinner,
  PlayTitleCard,
  DiagnosticProgressBar
} from 'quill-component-library/dist/componentLibrary';
import { clearData, loadData, nextQuestion, nextQuestionWithoutSaving, submitResponse, updateName, updateCurrentQuestion, resumePreviousDiagnosticSession } from '../../actions/diagnostics.js';
import _ from 'underscore';
import SessionActions from '../../actions/sessions.js';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayDiagnosticQuestion from './sentenceCombining.jsx';
import PlayFillInTheBlankQuestion from '../fillInBlank/playFillInTheBlankQuestion';
import TitleCard from '../studentLessons/titleCard.tsx';
import LandingPage from './landing.jsx';
import FinishedDiagnostic from './finishedDiagnostic.jsx';
import { getConceptResultsForAllQuestions } from '../../libs/conceptResults/diagnostic';
import { getParameterByName } from '../../libs/getParameterByName';

const request = require('request');

class StudentDiagnostic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      saved: false,
      sessionID: this.getSessionId(),
      hasOrIsGettingResponses: false,
    }
  }

  componentWillMount = () => {
    const { dispatch, } = this.props
    const { sessionID, } = this.state
    dispatch(clearData());
    if (sessionID) {
      SessionActions.get(sessionID, (data) => {
        this.setState({ session: data, });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { playDiagnostic, } = this.props
    if (nextProps.playDiagnostic.answeredQuestions.length !== playDiagnostic.answeredQuestions.length) {
      this.saveSessionData(nextProps.playDiagnostic);
    }
  }

  getPreviousSessionData = () => {
    const { session, } = this.state
    return session;
  }

  resumeSession = (data) => {
    if (data) {
      dispatch(resumePreviousDiagnosticSession(data));
    }
  }

  getSessionId = () => {
    let sessionID = getParameterByName('student');
    if (sessionID === 'null') {
      sessionID = undefined;
    }
    return sessionID;
  }

  saveSessionData = (lessonData) => {
    const { sessionID, } = this.state
    if (!sessionID) { return }

    SessionActions.update(sessionID, lessonData);
  }

  doesNotHaveAndIsNotGettingResponses = () => {
    const { hasOrIsGettingResponses, } = this.state
    return (!hasOrIsGettingResponses);
  }

  hasQuestionsInQuestionSet = (props) => {
    const pL = props.playDiagnostic;
    return (pL && pL.questionSet && pL.questionSet.length);
  }

  saveToLMS = () => {
    const { playDiagnostic, params, } = this.props
    const { sessionID, } = this.state

    this.setState({ error: false, });

    const results = getConceptResultsForAllQuestions(playDiagnostic.answeredQuestions);
    const { diagnosticID, } = params;

    if (sessionID) {
      this.finishActivitySession(sessionID, results, 1);
    } else {
      this.createAnonActivitySession(diagnosticID, results, 1);
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
          document.location.href = process.env.EMPIRICAL_BASE_URL
          this.setState({ saved: true, });
        } else {
          this.setState({
            saved: false,
            error: body.meta.message,
          });
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
          document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${body.activity_session.uid}`;
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

  questionsForDiagnostic = () => {
    const { questions, lessons, params, } = this.props
    const questionsCollection = hashToCollection(questions.data);
    const { data, } = lessons
    const { lessonID, } = params
    return data[lessonID].questions.map(id => _.find(questionsCollection, { key: id, }));
  }

  startActivity = () => {
    const { dispatch, } = this.props
    const next = nextQuestion();
    dispatch(next);
  }

  handleSpinnerMount = () => {
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

  nextQuestionWithoutSaving = () => {
    const { dispatch, } = this.props
    const next = nextQuestionWithoutSaving();
    dispatch(next);
  }

  getLesson = () => {
    const { lessons, params, } = this.props
    return lessons.data[params.diagnosticID];
  }

  questionsForLesson = () => {
    const { lessons, params, } = this.props
    const { data, } = lessons
    const { diagnosticID, } = params
    const filteredQuestions = data[diagnosticID].questions.filter(ques => {
      return this.props[ques.questionType] ? this.props[ques.questionType].data[ques.key] : null  // eslint-disable-line react/destructuring-assignment
    }
    );
    // this is a quickfix for missing questions -- if we leave this in here
    // long term, we should return an array through a forloop to
    // cut the time from 2N to N
    return filteredQuestions.map((questionItem) => {
      const questionType = questionItem.questionType;
      const key = questionItem.key;
      const question = this.props[questionType].data[key];  // eslint-disable-line react/destructuring-assignment
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
    const { params, } = this.props
    if (params.diagnosticID == 'researchDiagnostic') {
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
    let percent;
    const { playDiagnostic } = this.props;
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

  getQuestionType = (type) => {
    let questionType
    switch (type) {
      case 'questions':
        questionType = 'SC'
        break
      case 'fillInBlanks':
        questionType = 'FB'
        break
      case 'titleCards':
        questionType = 'TL'
        break
      case 'sentenceFragments':
        questionType = 'SF'
        break
    }
    return questionType
  }

  landingPageHtml = () => {
    const { lessons, params, } = this.props
    const { data, } = lessons
    const { diagnosticID, } = params;
    return data[diagnosticID].landingPageHtml
  }

  render() {
    const { playDiagnostic, lessons, questions, sentenceFragments, dispatch, } = this.props
    const { error, saved, } = this.state
    const questionType = playDiagnostic.currentQuestion ? playDiagnostic.currentQuestion.type : ''
    let component;

    if (!(lessons.hasreceiveddata && questions.hasreceiveddata && sentenceFragments.hasreceiveddata)) {
      return (
        <div>
          <DiagnosticProgressBar percent={this.getProgressPercent()} />
          <section className="section is-fullheight minus-nav student">
            <div className="student-container student-container-diagnostic">
              <SmartSpinner key="step1" message='Loading Your Lesson 25%' />
            </div>
          </section>
        </div>
      );
    }

    if (!playDiagnostic.questionSet) {
      return (
        <div>
          <DiagnosticProgressBar percent={this.getProgressPercent()} />
          <section className="section is-fullheight minus-nav student">
            <div className="student-container student-container-diagnostic">
              <SmartSpinner key="step2" message='Loading Your Lesson 50%' onMount={this.handleSpinnerMount} />
            </div>
          </section>
        </div>
      );
    }

    if (playDiagnostic.currentQuestion) {
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
        />)
      } else if (questionType === 'TL') {
        component = (
          <PlayTitleCard
            currentKey={playDiagnostic.currentQuestion.data.key}
            data={playDiagnostic.currentQuestion.data}
            dispatch={dispatch}
            nextQuestion={this.nextQuestionWithoutSaving}
          />
        );
      }
    } else if (playDiagnostic.answeredQuestions.length > 0 && playDiagnostic.unansweredQuestions.length === 0) {
      component = (<FinishedDiagnostic
        error={error}
        saved={saved}
        saveToLMS={this.saveToLMS}
      />);
    } else {
      component = (<LandingPage
        begin={this.startActivity}
        landingPageHtml={this.landingPageHtml()}
        questionCount={this.getQuestionCount()}
        resumeActivity={this.resumeSession}
        session={this.getPreviousSessionData()}
      />);
    }
    return (
      <div>
        <DiagnosticProgressBar percent={this.getProgressPercent()} />
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
    routing: state.routing,
    questions: state.questions,
    playDiagnostic: state.playDiagnostic,
    sentenceFragments: state.sentenceFragments,
    fillInBlank: state.fillInBlank,
    sessions: state.sessions,
    lessons: state.lessons,
    titleCards: state.titleCards
  };
}
export default connect(select)(StudentDiagnostic);
