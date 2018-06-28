import React from 'react';
import { connect } from 'react-redux';
import { CarouselAnimation } from 'quill-component-library/dist/componentLibrary';
import {
  clearData,
  loadData,
  nextQuestion,
  nextQuestionWithoutSaving,
  submitResponse,
  updateName,
  updateCurrentQuestion,
  resumePreviousDiagnosticSession,
  updateLanguage
} from '../../actions/diagnostics.js';
import _ from 'underscore';
import { hashToCollection } from 'quill-component-library/dist/componentLibrary';
import SessionActions from '../../actions/sessions.js';
import SmartSpinner from '../shared/smartSpinner.jsx';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayDiagnosticQuestion from './sentenceCombining.jsx';
import PlayFillInTheBlankQuestion from '../fillInBlank/playFillInTheBlankQuestion'
import TitleCard from './titleCard.tsx';
import LandingPage from './landing.jsx';
import LanguagePage from './languagePage.jsx';
import FinishedDiagnostic from './finishedDiagnostic.jsx';
import { DiagnosticProgressBar } from 'quill-component-library/dist/componentLibrary';
import { getConceptResultsForAllQuestions } from '../../libs/conceptResults/diagnostic';
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

  getSessionId() {
    let sessionID = getParameterByName('student');
    if (sessionID === 'null') {
      sessionID = undefined;
    }
    return sessionID;
  },

  saveSessionData(lessonData) {
    if (this.state.sessionID) {
      SessionActions.update(this.state.sessionID, lessonData);
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

  saveToLMS() {
    this.setState({ error: false, });
    const results = getConceptResultsForAllQuestions(this.props.playDiagnostic.answeredQuestions);
    console.log('Concept Results: ', results);

    const { diagnosticID, } = this.props.params;
    const sessionID = this.state.sessionID;
    if (sessionID) {
      this.finishActivitySession(sessionID, results, 1);
    } else {
      this.createAnonActivitySession(diagnosticID, results, 1);
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

  submitResponse(response) {
    const action = submitResponse(response);
    this.props.dispatch(action);
  },

  renderQuestionComponent() {
    let component
    if (this.props.playDiagnostic.currentQuestion.type === 'SC') {
      component = (<PlayDiagnosticQuestion
        question={this.props.playDiagnostic.currentQuestion.data}
        nextQuestion={this.nextQuestion}
        dispatch={this.props.dispatch}
        key={this.props.playDiagnostic.currentQuestion.data.key}
        marking="diagnostic"
        language={this.language()}
      />);
    } else if (this.props.playDiagnostic.currentQuestion.type === 'SF') {
      component = (<PlaySentenceFragment
        question={this.props.playDiagnostic.currentQuestion.data}
        currentKey={this.props.playDiagnostic.currentQuestion.data.key}
        key={this.props.playDiagnostic.currentQuestion.data.key}
        dispatch={this.props.dispatch}
        nextQuestion={this.nextQuestion} markIdentify={this.markIdentify}
        updateAttempts={this.submitResponse}
        language={this.language()}
      />);
    } else if (this.props.playDiagnostic.currentQuestion.type === 'TL') {
      component = (
        <TitleCard
          data={this.props.playDiagnostic.currentQuestion.data}
          currentKey={this.props.playDiagnostic.currentQuestion.data.key}
          dispatch={this.props.dispatch}
          nextQuestion={this.nextQuestionWithoutSaving}
          language={this.language()}
          key={this.props.playDiagnostic.currentQuestion.data.key}
        />
      );
    } else if (this.props.playDiagnostic.currentQuestion.type === 'FB') {
      component = (
        <PlayFillInTheBlankQuestion
          question={this.props.playDiagnostic.currentQuestion.data}
          currentKey={this.props.playDiagnostic.currentQuestion.data.key}
          dispatch={this.props.dispatch}
          nextQuestion={this.nextQuestionWithoutSaving}
          language={this.language()}
          key={this.props.playDiagnostic.currentQuestion.data.key}
        />
      );
    }
    return component
  },

  questionsForDiagnostic() {
    const questionsCollection = hashToCollection(this.props.questions.data);
    const { data, } = this.props.lessons,
      { lessonID, } = this.props.params;
    return data[lessonID].questions.map(id => _.find(questionsCollection, { key: id, }));
  },

  startActivity(data) {
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
    return this.props.lessons.data['ell'];
  },

  getLessonName() {
    return this.props.lessons.data['ell'].name;
  },

  saveStudentName(name) {
    this.props.dispatch(updateName(name));
  },

  questionsForLesson() {
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

  getQuestionCount() {
    const { diagnosticID, } = this.props.params;
    if (diagnosticID == 'researchDiagnostic') {
      return '15';
    }
    return '22';
  },

  markIdentify(bool) {
    const action = updateCurrentQuestion({ identified: bool, });
    this.props.dispatch(action);
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

  getFetchedData() {
    const lesson = this.getLesson()
    const filteredQuestions = lesson.questions.filter((ques) => {
      return this.props[ques.questionType] ? this.props[ques.questionType].data[ques.key] : null
    });
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
  },

  updateLanguage(language) {
    this.props.dispatch(updateLanguage(language));
  },

  language() {
    return this.props.playDiagnostic.language;
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
            begin={() => { this.startActivity(data); }}
            session={this.getPreviousSessionData()}
            resumeActivity={this.resumeSession}
            language={this.language()}
          />);
        } else {
          component = (<LanguagePage
            setLanguage={(language) => { this.updateLanguage(language); }}
          />);
        }
      }
    } else {
      component = (<SmartSpinner
        message={'Loading Your Lesson 25%'}
        onMount={() => {}} key="step1"
      />)
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
  },
});

function select(state) {
  return {
    routing: state.routing,
    questions: state.questions,
    playDiagnostic: state.playDiagnostic,
    sentenceFragments: state.sentenceFragments,
    fillInBlank: state.fillInBlank,
    // responses: state.responses,
    sessions: state.sessions,
    lessons: state.lessons,
    titleCards: state.titleCards
  };
}
export default connect(select)(StudentDiagnostic);
