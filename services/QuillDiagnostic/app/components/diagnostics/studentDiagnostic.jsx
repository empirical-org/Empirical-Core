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
    this.props.dispatch(clearData());
    if (this.state.sessionID) {
      SessionActions.get(this.state.sessionID, (data) => {
        this.setState({ session: data, });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.playDiagnostic.answeredQuestions.length !== this.props.playDiagnostic.answeredQuestions.length) {
      this.saveSessionData(nextProps.playDiagnostic);
    }
  }

  getPreviousSessionData = () => {
    return this.state.session;
  }

  resumeSession = (data) => {
    if (data) {
      this.props.dispatch(resumePreviousDiagnosticSession(data));
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
    if (this.state.sessionID) {
      SessionActions.update(this.state.sessionID, lessonData);
    }
  }

  doesNotHaveAndIsNotGettingResponses = () => {
    return (!this.state.hasOrIsGettingResponses);
  }

  hasQuestionsInQuestionSet = (props) => {
    const pL = props.playDiagnostic;
    return (pL && pL.questionSet && pL.questionSet.length);
  }

  saveToLMS = () => {
    this.setState({ error: false, });
    const results = getConceptResultsForAllQuestions(this.props.playDiagnostic.answeredQuestions);

    const { diagnosticID, } = this.props.params;
    const sessionID = this.state.sessionID;
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
        if (httpResponse.statusCode === 200) {
          // to do, use Sentry to capture error
          SessionActions.delete(this.state.sessionID);
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
        if (httpResponse.statusCode === 200) {
          // to do, use Sentry to capture error
          document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${body.activity_session.uid}`;
          this.setState({ saved: true, });
        }
      }
    );
  }

  submitResponse = (response) => {
    const action = submitResponse(response);
    this.props.dispatch(action);
  }

  renderQuestionComponent = () => {
    if (this.props.question.currentQuestion) {
      return (<Question
        prefill={this.getLesson().prefill}
        question={this.props.question.currentQuestion}
        submitResponse={this.submitResponse}
      />);
    }
  }

  questionsForDiagnostic = () => {
    const questionsCollection = hashToCollection(this.props.questions.data);
    const { data, } = this.props.lessons,
      { lessonID, } = this.props.params;
    return data[lessonID].questions.map(id => _.find(questionsCollection, { key: id, }));
  }

  startActivity = () => {
    const next = nextQuestion();
    this.props.dispatch(next);
  }

  loadQuestionSet = () => {
    const data = this.questionsForLesson();
    const action = loadData(data);
    this.props.dispatch(action);
  }

  nextQuestion = () => {
    const next = nextQuestion();
    this.props.dispatch(next);
  }

  nextQuestionWithoutSaving = () => {
    const next = nextQuestionWithoutSaving();
    this.props.dispatch(next);
  }

  getLesson = () => {
    return this.props.lessons.data[this.props.params.diagnosticID];
  }

  getLessonName = () => {
    return this.props.lessons.data[this.props.params.diagnosticID].name;
  }

  questionsForLesson = () => {
    const { data, } = this.props.lessons,
      { diagnosticID, } = this.props.params;
    const filteredQuestions = data[diagnosticID].questions.filter(ques => {
      return this.props[ques.questionType] ? this.props[ques.questionType].data[ques.key] : null
    }
    );
    // this is a quickfix for missing questions -- if we leave this in here
    // long term, we should return an array through a forloop to
    // cut the time from 2N to N
    return filteredQuestions.map((questionItem) => {
      const questionType = questionItem.questionType;
      const key = questionItem.key;
      const question = this.props[questionType].data[key];
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
    const { diagnosticID, } = this.props.params;
    if (diagnosticID == 'researchDiagnostic') {
      return '15';
    }
    return '22';
  }

  markIdentify = (bool) => {
    const action = updateCurrentQuestion({ identified: bool, });
    this.props.dispatch(action);
  }

  getProgressPercent = () => {
    let percent;
    const playDiagnostic = this.props.playDiagnostic;
    if (playDiagnostic && playDiagnostic.unansweredQuestions && playDiagnostic.questionSet) {
      const questionSetCount = playDiagnostic.questionSet.length;
      const answeredQuestionCount = questionSetCount - this.props.playDiagnostic.unansweredQuestions.length;
      if (this.props.playDiagnostic.currentQuestion) {
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
    const { data, } = this.props.lessons,
      { diagnosticID, } = this.props.params;
    return data[diagnosticID].landingPageHtml
  }

  render() {
    const questionType = this.props.playDiagnostic.currentQuestion ? this.props.playDiagnostic.currentQuestion.type : ''
    let component;

    if (!(this.props.lessons.hasreceiveddata && this.props.questions.hasreceiveddata && this.props.sentenceFragments.hasreceiveddata)) {
      return (
        <div>
          <DiagnosticProgressBar percent={this.getProgressPercent()} />
          <section className="section is-fullheight minus-nav student">
            <div className="student-container student-container-diagnostic">
              <SmartSpinner key="step1" message={'Loading Your Lesson 25%'} onMount={() => {}} />
            </div>
          </section>
        </div>
      );
    }

    if (!this.props.playDiagnostic.questionSet) {
      return (
        <div>
          <DiagnosticProgressBar percent={this.getProgressPercent()} />
          <section className="section is-fullheight minus-nav student">
            <div className="student-container student-container-diagnostic">
              <SmartSpinner key="step2" message={'Loading Your Lesson 50%'} onMount={this.loadQuestionSet} />
            </div>
          </section>
        </div>
      );
    }

    if (this.props.playDiagnostic.currentQuestion) {
      if (questionType === 'SC') {
        component = (<PlayDiagnosticQuestion
          dispatch={this.props.dispatch}
          key={this.props.playDiagnostic.currentQuestion.data.key}
          marking="diagnostic"
          // responses={this.props.responses.data[this.props.playDiagnostic.currentQuestion.data.key]}
          nextQuestion={this.nextQuestion}
          question={this.props.playDiagnostic.currentQuestion.data}
        />);
      } else if (questionType === 'SF') {
        component = (<PlaySentenceFragment
          currentKey={this.props.playDiagnostic.currentQuestion.data.key}
          dispatch={this.props.dispatch}
          key={this.props.playDiagnostic.currentQuestion.data.key}
          // responses={this.props.responses.data[this.props.playDiagnostic.currentQuestion.data.key]}
          markIdentify={this.markIdentify}
          nextQuestion={this.nextQuestion}
          question={this.props.playDiagnostic.currentQuestion.data}
          updateAttempts={this.submitResponse}
        />);
      } else if (questionType === 'FB') {
        component = (<PlayFillInTheBlankQuestion
          currentKey={this.props.playDiagnostic.currentQuestion.data.key}
          dispatch={this.props.dispatch}
          key={this.props.playDiagnostic.currentQuestion.data.key}
          nextQuestion={this.nextQuestion}
          question={this.props.playDiagnostic.currentQuestion.data}
        />)
      } else if (questionType === 'TL') {
        component = (
          <PlayTitleCard
            currentKey={this.props.playDiagnostic.currentQuestion.data.key}
            data={this.props.playDiagnostic.currentQuestion.data}
            dispatch={this.props.dispatch}
            nextQuestion={this.nextQuestionWithoutSaving}
          />
        );
      }
    } else if (this.props.playDiagnostic.answeredQuestions.length > 0 && this.props.playDiagnostic.unansweredQuestions.length === 0) {
      component = (<FinishedDiagnostic
        error={this.state.error}
        saved={this.state.saved}
        saveToLMS={this.saveToLMS}
      />);
    } else {
      component = (<LandingPage
        begin={() => { this.startActivity('John'); }}
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
