import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion, nextQuestionWithoutSaving, resumePreviousDiagnosticSession, updateLanguage } from '../../actions/diagnostics.js';
import _ from 'underscore';
import { hashToCollection } from '../../libs/hashToCollection';
import diagnosticQuestions from './diagnosticQuestions.jsx';
import { loadResponseData } from '../../actions/responses';
import Spinner from '../shared/spinner.jsx';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayDiagnosticQuestion from './sentenceCombining.jsx';
import PlayFillInTheBlankQuestion from '../fillInBlank/playFillInTheBlankQuestion';
import LandingPage from './landing.jsx';
import LanguagePage from './languagePage.jsx';
import FinishedDiagnostic from './finishedDiagnostic.jsx';
import DiagnosticProgressBar from '../shared/diagnosticProgressBar.jsx';
import { getConceptResultsForAllQuestions } from '../../libs/conceptResults/diagnostic';
import TitleCard from './titleCard.tsx';
import SessionActions from '../../actions/sessions.js';
import { getParameterByName } from '../../libs/getParameterByName';

const request = require('request');

const StudentDiagnostic = React.createClass({

  getInitialState() {
    return {
      saved: false,
      sessionID: this.getSessionId(),
      hasOrIsGettingResponses: false,
    };
  },

  getSessionId() {
    let sessionID = getParameterByName('student');
    if (sessionID === 'null') {
      sessionID = undefined;
    }
    return sessionID;
  },

  saveToLMS() {
    this.setState({ error: false, });
    const results = getConceptResultsForAllQuestions(this.props.playDiagnostic.answeredQuestions);
    const sessionID = this.state.sessionID;
    if (sessionID) {
      this.finishActivitySession(sessionID, results, 1);
    } else {
      this.createAnonActivitySession('ell', results, 1);
    }
  },

  finishActivitySession(sessionID, results, score) {
    request(
      { url: `${process.env.EMPIRICAL_BASE_URL}/api/v1/activity_sessions/${sessionID}`,
        method: 'PUT',
        json:
        {
          state: 'finished',
          concept_results: results,
          percentage: score,
        },
      },
      (err, httpResponse, body) => {
        if (httpResponse.statusCode === 200) {
          console.log('Finished Saving');
          console.log(err, httpResponse, body);
          SessionActions.delete(this.state.sessionID);
          document.location.href = process.env.EMPIRICAL_BASE_URL;
          this.setState({ saved: true, });
        } else {
          console.log('Save not successful');
          this.setState({ saved: false, error: true, });
        }
      }
    );
  },

  createAnonActivitySession(lessonID, results, score) {
    request(
      { url: `${process.env.EMPIRICAL_BASE_URL}/api/v1/activity_sessions/`,
        method: 'POST',
        json:
        {
          state: 'finished',
          activity_uid: lessonID,
          concept_results: results,
          percentage: score,
        },
      },
      (err, httpResponse, body) => {
        if (httpResponse.statusCode === 200) {
          console.log('Finished Saving');
          console.log(err, httpResponse, body);
          document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${body.activity_session.uid}`;
          this.setState({ saved: true, });
        }
      }
    );
  },

  saveSessionData(lessonData) {
    if (this.state.sessionID) {
      SessionActions.update(this.state.sessionID, lessonData);
    }
  },

  componentWillMount() {
    this.props.dispatch(clearData());
    if (this.state.sessionID) {
      SessionActions.get(this.state.sessionID, (data) => {
        this.setState({ session: data, });
      });
    }
  },

  getPreviousSessionData() {
    return this.state.session;
  },

  resumeSession(data) {
    if (data) {
      this.props.dispatch(resumePreviousDiagnosticSession(data));
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.playDiagnostic.answeredQuestions.length !== this.props.playDiagnostic.answeredQuestions.length) {
      this.saveSessionData(nextProps.playDiagnostic);
    }
  },

  doesNotHaveAndIsNotGettingResponses() {
    return (!this.state.hasOrIsGettingResponses);
  },

  hasQuestionsInQuestionSet(props) {
    const pL = props.playDiagnostic;
    return (pL && pL.questionSet && pL.questionSet.length);
  },

  getResponsesForEachQuestion(playDiagnostic) {
    // we need to change the gettingResponses state so that we don't keep hitting this as the props update,
    // otherwise it forms an infinite loop via component will receive props
    this.setState({ hasOrIsGettingResponses: true, }, () => {
      const questionSet = playDiagnostic.questionSet;
      questionSet.forEach((q) => {
        console.log(q);
        this.props.dispatch(loadResponseData(q.data.key));
      });
    });
  },

  submitResponse(response) {
    const action = submitResponse(response);
    this.props.dispatch(action);
  },

  questionsForDiagnostic() {
    const questionsCollection = hashToCollection(this.props.questions.data);
    const { data, } = this.props.lessons,
      { lessonID, } = this.props.params;
    return data[lessonID].questions.map(id => _.find(questionsCollection, { key: id, }));
  },

  startActivity(name, data) {
    // this.saveStudentName(name);
    const action = loadData(data);
    this.props.dispatch(action);
    const next = nextQuestion();
    this.props.dispatch(next);
  },

  nextQuestion() {
    const next = nextQuestion();
    this.props.dispatch(next);
  },

  nextQuestionWithoutSaving() {
    const next = nextQuestionWithoutSaving();
    this.props.dispatch(next);
  },

  getLesson() {
    return this.props.lessons.data[this.props.params.lessonID];
  },

  getLessonName() {
    return this.props.lessons.data[this.props.params.lessonID].name;
  },

  saveStudentName(name) {
    this.props.dispatch(updateName(name));
  },

  getData() {
    const { data, } = this.props.lessons,
      { lessonID, } = this.props.params;
    if (data[lessonID].questions) {
      return _.values(data[lessonID].questions).map((question) => {
        console.log(question)
        const questions = this.props[question.questionType].data;
        const qFromDB = Object.assign({}, questions[question.key]);
        qFromDB.questionType = question.questionType;
        qFromDB.key = question.key;
        return qFromDB;
      });
    }
  },

  markIdentify(bool) {
    const action = updateCurrentQuestion({ identified: bool, });
    this.props.dispatch(action);
  },

  updateLanguage(language) {
    this.props.dispatch(updateLanguage(language));
  },

  getFetchedData() {
    const returnValue = this.getData().map((obj) => {
      let data;
      if (obj.type === 'SC') {
        data = this.props.questions.data[obj.key];
      } else if (obj.type === 'SF') {
        data = this.props.sentenceFragments.data[obj.key];
      } else if (obj.type === 'FB') {
        data = this.props.fillInBlank.data[obj.key];
      } else {
        data = obj;
      }
      data.key = obj.key;
      return {
        type: obj.type,
        data,
      };
    });
    return returnValue;
  },

  language() {
    return this.props.playDiagnostic.language;
  },

  getProgressPercent() {
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
  },

  renderQuestionComponent() {
    if (this.props.playDiagnostic.currentQuestion.type === 'SC') {
      return (<PlayDiagnosticQuestion
        question={this.props.playDiagnostic.currentQuestion.data}
        nextQuestion={this.nextQuestion}
        key={this.props.playDiagnostic.currentQuestion.data.key}
        marking="diagnostic"
        language={this.language()}
      />);
    } else if (this.props.playDiagnostic.currentQuestion.type === 'TL') {
      return (
        <TitleCard
          data={this.props.playDiagnostic.currentQuestion.data}
          currentKey={this.props.playDiagnostic.currentQuestion.data.key}
          dispatch={this.props.dispatch}
          nextQuestion={this.nextQuestionWithoutSaving}
          language={this.language()}
        />
      );
    } else if (this.props.playDiagnostic.currentQuestion.type === 'FB') {
      return (<PlayFillInTheBlankQuestion
        question={this.props.playDiagnostic.currentQuestion.data}
        nextQuestion={this.nextQuestion}
        key={this.props.playDiagnostic.currentQuestion.data.key}
        dispatch={this.props.dispatch}
        language={this.language()}
      />);
    }
    return (<PlaySentenceFragment
      question={this.props.playDiagnostic.currentQuestion.data} currentKey={this.props.playDiagnostic.currentQuestion.data.key}
      key={this.props.playDiagnostic.currentQuestion.data.key}
      nextQuestion={this.nextQuestion} markIdentify={this.markIdentify}
      updateAttempts={this.submitResponse}
      language={this.language()}
    />);
  },

  render() {
    let component;
    if (this.props.questions.hasreceiveddata && this.props.sentenceFragments.hasreceiveddata && this.props.fillInBlank.hasreceiveddata) {
      const data = this.getFetchedData();
      if (data) {
        if (this.props.playDiagnostic.currentQuestion) {
          component = this.renderQuestionComponent();
        } else if (this.props.playDiagnostic.answeredQuestions.length > 0 && this.props.playDiagnostic.unansweredQuestions.length === 0) {
          component = (<FinishedDiagnostic
            saveToLMS={this.saveToLMS}
            saved={this.state.saved}
            error={this.state.error}
            language={this.language()}
          />);
        } else if (this.props.playDiagnostic.language) {
          component = (<LandingPage
            begin={() => { this.startActivity('John', data); }}
            session={this.getPreviousSessionData()}
            resumeActivity={this.resumeSession}
            language={this.language()}
          />);
        } else {
          component = <LanguagePage setLanguage={(language) => { this.updateLanguage(language); }} />;
        }
      }
    } else {
      component = (<Spinner />);
    }

    return (
      <div>
        <DiagnosticProgressBar percent={this.getProgressPercent()} />
        <section className="section is-fullheight minus-nav student">
          <div className="student-container student-container-diagnostic">
            <ReactCSSTransitionGroup
              transitionName="carousel"
              transitionEnterTimeout={350}
              transitionLeaveTimeout={350}
            >
              {component}
            </ReactCSSTransitionGroup>
          </div>
        </section>
      </div>
    );
  },
});

function select(state) {
  return {
    routing: state.routing,
    questions: state.questions,
    fillInBlank: state.fillInBlank,
    playDiagnostic: state.playDiagnostic,
    sentenceFragments: state.sentenceFragments,
    sessions: state.sessions,
  };
}
export default connect(select)(StudentDiagnostic);
