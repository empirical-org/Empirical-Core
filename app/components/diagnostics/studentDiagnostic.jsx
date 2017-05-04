import React from 'react';
import { connect } from 'react-redux';
import CarouselAnim from '../shared/carouselAnimation.jsx';
import { clearData, loadData, nextQuestion, nextQuestionWithoutSaving, submitResponse, updateName, updateCurrentQuestion, resumePreviousDiagnosticSession } from '../../actions/diagnostics.js';
import _ from 'underscore';
import { loadResponseData, loadMultipleResponses } from '../../actions/responses';
import { hashToCollection } from '../../libs/hashToCollection';
import diagnosticQuestions from './diagnosticQuestions.js';
import SessionActions from '../../actions/sessions.js';
import Spinner from '../shared/spinner.jsx';
import SmartSpinner from '../shared/smartSpinner.jsx';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayDiagnosticQuestion from './sentenceCombining.jsx';
import TitleCard from './titleCard.jsx';
import LandingPage from './landing.jsx';
import FinishedDiagnostic from './finishedDiagnostic.jsx';
import DiagnosticProgressBar from '../shared/diagnosticProgressBar.jsx'
import { getConceptResultsForAllQuestions } from '../../libs/conceptResults/diagnostic';
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
    // this.getResponsesForEachQuestion();
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
    let sessionID = this.props.location.query.student;
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

  getResponsesForEachQuestion() {
    const questionIDs = diagnosticQuestions().map(q => q.key);
    this.props.dispatch(loadMultipleResponses(questionIDs, () => {
      this.setState({ responsesReady: true, });
    }));
    // we need to change the gettingResponses state so that we don't keep hitting this as the props update,
    // otherwise it forms an infinite loop via component will receive props
    // this.setState({ hasOrIsGettingResponses: true, }, () => {
    //   _.each(diagnosticQuestions(), (q) => {
    //     this.props.dispatch(loadResponseData(q.key));
    //   });
    // });
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
    if (this.props.question.currentQuestion) {
      return (<Question
        question={this.props.question.currentQuestion}
        submitResponse={this.submitResponse}
        prefill={this.getLesson().prefill}
      />);
    }
  },

  questionsForDiagnostic() {
    const questionsCollection = hashToCollection(this.props.questions.data);
    const { data, } = this.props.lessons,
      { lessonID, } = this.props.params;
    return data[lessonID].questions.map(id => _.find(questionsCollection, { key: id, }));
  },

  startActivity(name) {
    // this.saveStudentName(name);
    const next = nextQuestion();
    this.props.dispatch(next);
  },

  loadQuestionSet() {
    const data = this.getFetchedData();
    const action = loadData(data);
    this.props.dispatch(action);
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
    return diagnosticQuestions();
  },

  markIdentify(bool) {
    const action = updateCurrentQuestion({ identified: bool, });
    this.props.dispatch(action);
  },

  getFetchedData() {
    const returnValue = this.getData().map((obj) => {
      let data;
      if (obj.type === 'SC') {
        data = this.props.questions.data[obj.key];
      } else if (obj.type === 'SF') {
        data = this.props.sentenceFragments.data[obj.key];
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

  render() {
    const diagnosticID = this.props.params.diagnosticID;
    let component;
    if (this.props.questions.hasreceiveddata && this.props.sentenceFragments.hasreceiveddata) {
      if (!this.props.playDiagnostic.questionSet) {
        component = (<SmartSpinner message={'Loading Your Lesson 50%'} onMount={this.loadQuestionSet} key="step2" />);
      } else if (this.props.playDiagnostic.currentQuestion) {
        if (this.props.playDiagnostic.currentQuestion.type === 'SC') {
          component = (<PlayDiagnosticQuestion
            question={this.props.playDiagnostic.currentQuestion.data} nextQuestion={this.nextQuestion}
            dispatch={this.props.dispatch}
            // responses={this.props.responses.data[this.props.playDiagnostic.currentQuestion.data.key]}
            key={this.props.playDiagnostic.currentQuestion.data.key}
            marking="diagnostic"
          />);
        } else if (this.props.playDiagnostic.currentQuestion.type === 'SF') {
          component = (<PlaySentenceFragment
            question={this.props.playDiagnostic.currentQuestion.data} currentKey={this.props.playDiagnostic.currentQuestion.data.key}
            key={this.props.playDiagnostic.currentQuestion.data.key}
            // responses={this.props.responses.data[this.props.playDiagnostic.currentQuestion.data.key]}
            dispatch={this.props.dispatch}
            nextQuestion={this.nextQuestion} markIdentify={this.markIdentify}
            updateAttempts={this.submitResponse}
          />);
        } else if (this.props.playDiagnostic.currentQuestion.type === 'TL') {
          component = (
            <TitleCard
              data={this.props.playDiagnostic.currentQuestion.data}
              currentKey={this.props.playDiagnostic.currentQuestion.data.key}
              dispatch={this.props.dispatch}
              nextQuestion={this.nextQuestionWithoutSaving}
            />
          );
        }
      } else if (this.props.playDiagnostic.answeredQuestions.length > 0 && this.props.playDiagnostic.unansweredQuestions.length === 0) {
        component = (<FinishedDiagnostic saveToLMS={this.saveToLMS} saved={this.state.saved} error={this.state.error} />);
      } else {
        component = <LandingPage begin={() => { this.startActivity('John'); }} session={this.getPreviousSessionData()} resumeActivity={this.resumeSession} />;
      }
    } else {
      component = (<SmartSpinner message={'Loading Your Lesson 25%'} onMount={() => {}} key="step1" />);
    }
    // component = (<SmartSpinner message={'Loading Your Lesson 33%'} onMount={() => {}} />);
    return (
      <div>
        <DiagnosticProgressBar playDiagnostic={this.props.playDiagnostic}/>
        <section className="section is-fullheight minus-nav student">
          <div className="student-container student-container-diagnostic">
            <CarouselAnim>
              {component}
            </CarouselAnim>
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
    // responses: state.responses,
    sessions: state.sessions,
  };
}
export default connect(select)(StudentDiagnostic);
