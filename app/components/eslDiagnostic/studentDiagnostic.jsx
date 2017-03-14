import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion, nextQuestionWithoutSaving } from '../../actions/diagnostics.js';
import _ from 'underscore';
import { hashToCollection } from '../../libs/hashToCollection';
import diagnosticQuestions from './diagnosticQuestions.jsx';
import { loadResponseData } from '../../actions/responses';
import Spinner from '../shared/spinner.jsx';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayDiagnosticQuestion from './sentenceCombining.jsx';
import LandingPage from './landing.jsx';
import FinishedDiagnostic from './finishedDiagnostic.jsx';
import { getConceptResultsForAllQuestions } from '../../libs/conceptResults/diagnostic';
import TitleCard from './titleCard.jsx';
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
    let sessionID = this.props.location.query.student;
    if (sessionID === 'null') {
      sessionID = undefined;
    }
    return sessionID;
  },

  saveToLMS() {
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
    return diagnosticQuestions();
  },

  markIdentify(bool) {
    const action = updateCurrentQuestion({ identified: bool, });
    this.props.dispatch(action);
  },

  getProgressPercent() {
    if (this.props.playDiagnostic && this.props.playDiagnostic.answeredQuestions && this.props.playDiagnostic.questionSet) {
      return this.props.playDiagnostic.answeredQuestions.length / this.props.playDiagnostic.questionSet.length * 100;
    } else {
      0;
    }
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
      const data = this.getFetchedData();
      if (data) {
        if (this.props.playDiagnostic.currentQuestion) {
          if (this.props.playDiagnostic.currentQuestion.type === 'SC') {
            component = (<PlayDiagnosticQuestion question={this.props.playDiagnostic.currentQuestion.data} nextQuestion={this.nextQuestion} key={this.props.playDiagnostic.currentQuestion.data.key} marking="diagnostic" />);
          } else if (this.props.playDiagnostic.currentQuestion.type === 'TL') {
            component = (
              <TitleCard
                data={this.props.playDiagnostic.currentQuestion.data}
                currentKey={this.props.playDiagnostic.currentQuestion.data.key}
                dispatch={this.props.dispatch}
                nextQuestion={this.nextQuestionWithoutSaving}
              />
            );
          } else {
            component = (<PlaySentenceFragment
              question={this.props.playDiagnostic.currentQuestion.data} currentKey={this.props.playDiagnostic.currentQuestion.data.key}
              key={this.props.playDiagnostic.currentQuestion.data.key}
              nextQuestion={this.nextQuestion} markIdentify={this.markIdentify}
              updateAttempts={this.submitResponse}
            />);
          }
        } else if (this.props.playDiagnostic.answeredQuestions.length > 0 && this.props.playDiagnostic.unansweredQuestions.length === 0) {
          component = (<FinishedDiagnostic saveToLMS={this.saveToLMS} saved={this.state.saved} />);
        } else {
          component = <LandingPage begin={() => { this.startActivity('John', data); }} />;
          // (
          //   <div className="container">
          //     <button className="button is-info" onClick={()=>{this.startActivity("John", data)}}>Start</button>
          //   </div>
          // )
        }
      }
    } else {
      component = (<Spinner />);
    }

    return (
      <div>
        <progress className="progress diagnostic-progress" value={this.getProgressPercent()} max="100">15%</progress>
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
    playDiagnostic: state.playDiagnostic,
    sentenceFragments: state.sentenceFragments,
    sessions: state.sessions,
  };
}
export default connect(select)(StudentDiagnostic);
