import React from 'react';
import { connect } from 'react-redux';
import CarouselAnim from '../shared/carouselAnimation.jsx';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion, resumePreviousDiagnosticSession } from '../../actions/diagnostics.js';
import _ from 'underscore';
import { loadResponseData } from '../../actions/responses';
import { hashToCollection } from '../../libs/hashToCollection';
import diagnosticQuestions from './diagnosticQuestions.js';
import SessionActions from '../../actions/sessions.js';
import Spinner from '../shared/spinner.jsx';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayDiagnosticQuestion from './sentenceCombining.jsx';
import LandingPage from './landing.jsx';
import FinishedDiagnostic from './finishedDiagnostic.jsx';
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

  componentDidMount() {
    this.props.dispatch(clearData());
    this.getResponsesForEachQuestion();
  },

  getPreviousSessionData() {
    return this.props.sessions.data[this.props.location.query.student];
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
      this.props.dispatch(SessionActions.update(this.state.sessionID, lessonData));
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
    // we need to change the gettingResponses state so that we don't keep hitting this as the props update,
    // otherwise it forms an infinite loop via component will receive props
    this.setState({ hasOrIsGettingResponses: true, }, () => {
      diagnosticQuestions().forEach((q) => {
        this.props.dispatch(loadResponseData(q.key));
      });
    });
  },

  saveToLMS() {
    const results = getConceptResultsForAllQuestions(this.props.playDiagnostic.answeredQuestions);
    console.log('Concept Results: ', results);
    request(
      { url: `${process.env.EMPIRICAL_BASE_URL}/api/v1/activity_sessions/${this.props.routing.locationBeforeTransitions.query.student}`,
        method: 'PUT',
        json:
        {
          state: 'finished',
          concept_results: results,
          percentage: 1,
        },
      },
      (err, httpResponse, body) => {
        if (httpResponse.statusCode === 200) {
          this.props.dispatch(SessionActions.delete(this.state.sessionID));
          document.location.href = process.env.EMPIRICAL_BASE_URL;
          this.setState({ saved: true, });
        }
        // console.log(err,httpResponse,body)
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
      const data = (obj.type === 'SC') ? this.props.questions.data[obj.key] : this.props.sentenceFragments.data[obj.key];
      data.key = obj.key;
      // if(obj.type==="SF") {
      //   data.needsIdentification = true
      // } else if(obj.type==="SF2") {
      //   data.needsIdentification = false
      // }
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
            component = (<PlayDiagnosticQuestion
              question={this.props.playDiagnostic.currentQuestion.data} nextQuestion={this.nextQuestion}
              responses={this.props.responses.data[this.props.playDiagnostic.currentQuestion.data.key]}
              key={this.props.playDiagnostic.currentQuestion.data.key}
              marking="diagnostic"
            />);
          } else {
            component = (<PlaySentenceFragment
              question={this.props.playDiagnostic.currentQuestion.data} currentKey={this.props.playDiagnostic.currentQuestion.data.key}
              key={this.props.playDiagnostic.currentQuestion.data.key}
              responses={this.props.responses.data[this.props.playDiagnostic.currentQuestion.data.key]}
              nextQuestion={this.nextQuestion} markIdentify={this.markIdentify}
              updateAttempts={this.submitResponse}
            />);
          }
        } else if (this.props.playDiagnostic.answeredQuestions.length > 0 && this.props.playDiagnostic.unansweredQuestions.length === 0) {
          component = (<FinishedDiagnostic saveToLMS={this.saveToLMS} saved={this.state.saved} />);
        } else {
          component = <LandingPage begin={() => { this.startActivity('John', data); }} session={this.getPreviousSessionData()} resumeActivity={this.resumeSession} />;
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
            {/* <CarouselAnim> */}
            {component}
            {/* </CarouselAnim> */}
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
    responses: state.responses,
    sessions: state.sessions,
  };
}
export default connect(select)(StudentDiagnostic);
