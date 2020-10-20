import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import FinishedDiagnostic from './finishedDiagnostic.jsx';
import LandingPage from './landing.jsx';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayDiagnosticQuestion from './sentenceCombining.jsx';

import PlayFillInTheBlankQuestion from '../fillInBlank/playFillInTheBlankQuestion';
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

const request = require('request');

// TODO: triage issue with missing title cards. Currently, we have to dipatch data from this.questionsForLesson() to the loadData action in
// three different places to ensure that preview mode always works: componentDidMount, onSpinnerMount & startActivity. Without these three calls,
// sometimes the spinner will hang at 50% or the user will be unable to click title card questions.

export class StudentDiagnostic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      saved: false,
      sessionID: this.getSessionId(),
      hasOrIsGettingResponses: false,
    }
  }

  componentDidMount() {
    const { sessionID } = this.state;
    const { dispatch, match } = this.props;
    const { params } = match;
    const { diagnosticID } = params;
    dispatch(clearData());
    dispatch(setDiagnosticID({ diagnosticID }))
    if (sessionID) {
      SessionActions.get(sessionID, (data) => {
        this.setState({ session: data, });
      });
    }
    const data = this.questionsForLesson()
    const action = loadData(data);
    dispatch(action);
  }

  componentDidUpdate(prevProps) {
    const { skippedToQuestionFromIntro, previewMode, playDiagnostic } = this.props;
    if(previewMode && skippedToQuestionFromIntro !== prevProps.skippedToQuestionFromIntro) {
      this.startActivity();
    }
    if (prevProps.playDiagnostic.answeredQuestions.length !== playDiagnostic.answeredQuestions.length) {
      this.saveSessionData(playDiagnostic);
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
    const { dispatch, previewMode, skippedToQuestionFromIntro, questionToPreview, } = this.props

    const data = this.questionsForLesson()
    const action = loadData(data);
    dispatch(action);

    // when user skips to question from the landing page, we set the current question here in this one instance
    if(previewMode && skippedToQuestionFromIntro && questionToPreview) {
      const action = setCurrentQuestion(questionToPreview);
      dispatch(action);
    } else {
      const next = nextQuestion();
      dispatch(next);
    }
  }

  handleSpinnerMount = () => {
    const { dispatch, } = this.props

    const data = this.questionsForLesson();
    const action = loadData(data);
    dispatch(action);
  }

  nextQuestion = () => {
    const { dispatch, playDiagnostic, previewMode } = this.props;
    const { unansweredQuestions } = playDiagnostic;
    // we set the current question here; otherwise, the attempts will be reset if the next question has already been answered
    if(previewMode) {
      const question = unansweredQuestions[0].data;
      const action = setCurrentQuestion(question);
      dispatch(action);
    } else {
      const next = nextQuestion();
      dispatch(next);
    }
  }

  nextQuestionWithoutSaving = () => {
    const { dispatch, playDiagnostic, previewMode } = this.props;
    const { unansweredQuestions } = playDiagnostic;
    // same case as above; questions that follow title cards will have their attempts reset without this
    if(previewMode) {
      const question = unansweredQuestions[0].data;
      const action = setCurrentQuestion(question);
      dispatch(action);
    } else {
      const next = nextQuestionWithoutSaving();
      dispatch(next);
    }
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
    const { playDiagnostic, dispatch, lessons, match } = this.props
    const { error, saved, } = this.state
    const { params } = match
    const { diagnosticID } = params
    const questionType = playDiagnostic.currentQuestion ? playDiagnostic.currentQuestion.type : ''

    let component;

    const isLastQuestion = playDiagnostic.unansweredQuestions.length === 0

    if (lessons.hasreceiveddata) {
      document.title = `Quill.org | ${lessons.data[diagnosticID].name}`
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
      const questionType = playDiagnostic.currentQuestion.type || '';
      const question = playDiagnostic.currentQuestion.data;
      const key = playDiagnostic.currentQuestion.data.key;
      if (questionType === 'SC') {
        component = (<PlayDiagnosticQuestion
          dispatch={dispatch}
          isLastQuestion={isLastQuestion}
          key={key}
          marking="diagnostic"
          nextQuestion={this.nextQuestion}
          previewMode={previewMode}
          question={question}
        />);
      } else if (questionType === 'SF') {
        component = (<PlaySentenceFragment
          currentKey={key}
          dispatch={dispatch}
          isLastQuestion={isLastQuestion}
          key={key}
          markIdentify={this.markIdentify}
          nextQuestion={this.nextQuestion}
          previewMode={previewMode}
          question={question}
          updateAttempts={this.submitResponse}
        />);
      } else if (questionType === 'FB') {
        component = (<PlayFillInTheBlankQuestion
          currentKey={key}
          dispatch={dispatch}
          isLastQuestion={isLastQuestion}
          key={key}
          nextQuestion={this.nextQuestion}
          previewMode={previewMode}
          question={question}
        />)
      } else if (questionType === 'TL') {
        component = (
          <PlayTitleCard
            currentKey={key}
            data={question}
            dispatch={dispatch}
            handleContinueClick={this.nextQuestionWithoutSaving}
            isLastQuestion={isLastQuestion}
            previewMode={previewMode}
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
