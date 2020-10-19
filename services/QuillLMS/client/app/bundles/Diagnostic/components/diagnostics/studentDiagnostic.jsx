import React from 'react';
import { connect } from 'react-redux';
import {
  CarouselAnimation,
  SmartSpinner,
  PlayTitleCard,
  ProgressBar
} from 'quill-component-library/dist/componentLibrary';
import _ from 'underscore';

import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayDiagnosticQuestion from './sentenceCombining.jsx';
import LandingPage from './landing.jsx';
import FinishedDiagnostic from './finishedDiagnostic.jsx';

import PlayFillInTheBlankQuestion from '../fillInBlank/playFillInTheBlankQuestion';
import { clearData, loadData, nextQuestion, nextQuestionWithoutSaving, submitResponse, updateName, updateCurrentQuestion, resumePreviousDiagnosticSession } from '../../actions/diagnostics.js';
import SessionActions from '../../actions/sessions.js';
import { getConceptResultsForAllQuestions } from '../../libs/conceptResults/diagnostic';
import { getParameterByName } from '../../libs/getParameterByName';
import {
  questionCount,
  answeredQuestionCount,
  getProgressPercent
} from '../../libs/calculateProgress'
import { hashToCollection } from '../../../Shared/index'

const request = require('request');

export class StudentDiagnostic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      saved: false,
      sessionID: this.getSessionId(),
      hasOrIsGettingResponses: false,
    }
  }

  UNSAFE_componentWillMount = () => {
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

  getPreviousSessionData = () => {
    const { session, } = this.state
    return session;
  }

  resumeSession = (data) => {
    const { dispatch, } = this.props
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
    const { sessionID, } = this.state
    const { playDiagnostic, match } = this.props
    const { params } = match
    const { diagnosticID } = params

    this.setState({ error: false, });

    const results = getConceptResultsForAllQuestions(playDiagnostic.answeredQuestions);

    if (sessionID) {
      this.finishActivitySession(sessionID, results, 1);
    } else {
      this.createAnonActivitySession(diagnosticID, results, 1);
    }
  }

  finishActivitySession = (sessionID, results, score) => {
    request(
      {
        url: `${process.env.DEFAULT_URL}/api/v1/activity_sessions/${sessionID}`,
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
          document.location.href = process.env.DEFAULT_URL
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
      {
        url: `${process.env.DEFAULT_URL}/api/v1/activity_sessions/`,
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
          document.location.href = process.env.DEFAULT_URL
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
    const { questions, lessons, match, } = this.props
    const questionsCollection = hashToCollection(questions.data);
    const { data, } = lessons
    const { params } = match
    const { lessonID, } = params
    return data[lessonID].questions.map(id => _.find(questionsCollection, { key: id, }));
  }

  startActivity = () => {
    const { dispatch, } = this.props
    const data = this.questionsForLesson()
    const action = loadData(data);
    dispatch(action);
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
    const { lessons, match } = this.props
    const { data } = lessons
    const { params } = match
    const { diagnosticID } = params
    return data[diagnosticID];
  }

  questionsForLesson = () => {
    const { lessons, match } = this.props
    const { params } = match
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
    const { match } = this.props
    const { params } = match
    const { diagnosticID } = params
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
    const { lessons, match } = this.props
    const { params } = match
    const { data } = lessons
    const { diagnosticID, } = params;
    return data[diagnosticID].landingPageHtml
  }

  renderProgressBar = () => {
    const { playDiagnostic, } = this.props
    if (!playDiagnostic.currentQuestion) { return }

    const calculatedAnsweredQuestionCount = answeredQuestionCount(playDiagnostic)

    const currentQuestionIsTitleCard = playDiagnostic.currentQuestion.type === 'TL'
    const currentQuestionIsNotFirstQuestion = calculatedAnsweredQuestionCount !== 0

    const displayedAnsweredQuestionCount = currentQuestionIsTitleCard && currentQuestionIsNotFirstQuestion ? calculatedAnsweredQuestionCount + 1 : calculatedAnsweredQuestionCount

    const progressPercent = getProgressPercent(playDiagnostic);
    const totalQuestionCount = questionCount(playDiagnostic);

    return (<ProgressBar
      answeredQuestionCount={displayedAnsweredQuestionCount > totalQuestionCount ? totalQuestionCount : displayedAnsweredQuestionCount}
      label='questions'
      percent={progressPercent}
      questionCount={totalQuestionCount}
    />)
  }

  render() {
    const { playDiagnostic, dispatch, lessons } = this.props
    const { error, saved, } = this.state
    const { params } = match
    const { diagnosticID } = params
    const questionType = playDiagnostic.currentQuestion ? playDiagnostic.currentQuestion.type : ''
    let component;

    const isLastQuestion = playDiagnostic.unansweredQuestions.length === 0

    if (lessons.hasreceiveddata) {
      document.title = `Quill.org | ${lessons[diagnosticID].name}`
    }

    if (!playDiagnostic.questionSet) {
      return (
        <div>
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
            handleContinueClick={this.nextQuestionWithoutSaving}
            isLastQuestion={isLastQuestion}
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
