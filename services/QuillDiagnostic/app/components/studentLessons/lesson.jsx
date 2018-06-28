import React from 'react';
import { connect } from 'react-redux';
import PlayLessonQuestion from './question';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayFillInTheBlankQuestion from './fillInBlank.tsx'
import TitleCard from './titleCard.tsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion, resumePreviousSession } from '../../actions.js';
import SessionActions from '../../actions/sessions.js';
import _ from 'underscore';
import { hashToCollection } from 'quill-component-library/dist/componentLibrary';
import { getConceptResultsForAllQuestions, calculateScoreForLesson } from '../../libs/conceptResults/lesson';
import Register from './register.jsx';
import Finished from './finished.jsx';
import { getParameterByName } from '../../libs/getParameterByName';

import { Spinner } from 'quill-component-library/dist/componentLibrary';
const request = require('request');

const Lesson = React.createClass({
  componentWillMount() {
    this.props.dispatch(clearData());
  },

  getInitialState() {
    return { hasOrIsGettingResponses: false, };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.playLesson.answeredQuestions.length !== this.props.playLesson.answeredQuestions.length) {
      this.saveSessionData(nextProps.playLesson);
    }
  },

  doesNotHaveAndIsNotGettingResponses() {
    return (!this.state.hasOrIsGettingResponses);
  },

  componentDidMount() {
    this.saveSessionIdToState();
  },

  getPreviousSessionData() {
    return this.state.session;
  },

  resumeSession(data) {
    if (data) {
      this.props.dispatch(resumePreviousSession(data));
    }
  },

  hasQuestionsInQuestionSet(props) {
    const pL = props.playLesson;
    return (pL && pL.questionSet && pL.questionSet.length);
  },

  saveSessionIdToState() {
    let sessionID = getParameterByName('student');
    if (sessionID === 'null') {
      sessionID = undefined;
    }
    this.setState({ sessionID, }, () => {
      if (sessionID) {
        SessionActions.get(this.state.sessionID, (data) => {
          this.setState({ session: data, });
        });
      }
    });
  },

  submitResponse(response) {
    const action = submitResponse(response);
    this.props.dispatch(action);
  },

  saveToLMS() {
    this.setState({ error: false, });
    const relevantAnsweredQuestions = this.props.playLesson.answeredQuestions.filter(q => q.questionType !== 'TL')
    const results = getConceptResultsForAllQuestions(relevantAnsweredQuestions);
    console.log(results);
    const score = calculateScoreForLesson(relevantAnsweredQuestions);
    const { lessonID, } = this.props.params;
    const sessionID = this.state.sessionID;
    if (sessionID) {
      this.finishActivitySession(sessionID, results, score);
    } else {
      this.createAnonActivitySession(lessonID, results, score);
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
          document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${this.state.sessionID}`;
          this.setState({ saved: true, });
        } else {
          this.setState({
            saved: false,
            error: true,
          });
        }
      }
    );
  },

  markIdentify(bool) {
    const action = updateCurrentQuestion({ identified: bool, });
    this.props.dispatch(action);
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

  questionsForLesson() {
    const { data, } = this.props.lessons,
      { lessonID, } = this.props.params;
    const filteredQuestions = data[lessonID].questions.filter(ques =>
       this.props[ques.questionType].data[ques.key]
    );
    // this is a quickfix for missing questions -- if we leave this in here
    // long term, we should return an array through a forloop to
    // cut the time from 2N to N
    return filteredQuestions.map((questionItem) => {
      const questionType = questionItem.questionType;
      const key = questionItem.key;
      const question = this.props[questionType].data[key];
      question.key = key;
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
      return { type, question, };
    });
  },

  startActivity(name) {
    this.saveStudentName(name);
    const action = loadData(this.questionsForLesson());
    this.props.dispatch(action);
    const next = nextQuestion();
    this.props.dispatch(next);
  },

  nextQuestion() {
    const next = nextQuestion();
    return this.props.dispatch(next);
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

  getProgressPercent() {
    if (this.props.playLesson && this.props.playLesson.answeredQuestions && this.props.playLesson.questionSet) {
      return this.props.playLesson.answeredQuestions.length / this.props.playLesson.questionSet.length * 100;
    } else {
      return 0;
    }
  },

  saveSessionData(lessonData) {
    if (this.state.sessionID) {
      SessionActions.update(this.state.sessionID, lessonData);
    }
  },

  render() {
    const { data, } = this.props.lessons,
      { lessonID, } = this.props.params;
    let component;
    if (data[lessonID]) {
      if (this.props.playLesson.currentQuestion) {
        const { type, question, } = this.props.playLesson.currentQuestion;

        if (type === 'SF') {
          component = (
            <PlaySentenceFragment
              currentKey={question.key}
              question={question}
              nextQuestion={this.nextQuestion}
              key={question.key}
              marking="diagnostic"
              updateAttempts={this.submitResponse}
              markIdentify={this.markIdentify}
              dispatch={this.props.dispatch}
            />
          );
        } else if (type === 'FB') {
          component = (
            <PlayFillInTheBlankQuestion
              key={question.key}
              question={question}
              nextQuestion={this.nextQuestion}
              prefill={this.getLesson().prefill}
              dispatch={this.props.dispatch}
              submitResponse={this.submitResponse}
            />
          );
        } else if (type === 'TL'){
          component = (
            <TitleCard
              nextQuestion={this.nextQuestion}
              data={question}
            />
          )
        } else {
          component = (
            <PlayLessonQuestion
              key={question.key}
              question={question}
              nextQuestion={this.nextQuestion}
              prefill={this.getLesson().prefill}
              dispatch={this.props.dispatch}
            />
          );
        }
      } else if (this.props.playLesson.answeredQuestions.length > 0 && (this.props.playLesson.unansweredQuestions.length === 0 && this.props.playLesson.currentQuestion === undefined)) {
        component = (
          <Finished
            data={this.props.playLesson}
            name={this.state.sessionID}
            lessonID={this.props.params.lessonID}
            saveToLMS={this.saveToLMS}
            saved={this.state.saved}
            error={this.state.error}
          />
        );
      } else {
        component = (
          <Register lesson={this.getLesson()} startActivity={this.startActivity} session={this.state.session} resumeActivity={this.resumeSession} />
        );
      }

      return (
        <div>
          <progress className="progress diagnostic-progress" value={this.getProgressPercent()} max="100">15%</progress>
          <section className="section is-fullheight minus-nav student">
            <div className="student-container student-container-diagnostic">
              {component}
            </div>
          </section>
        </div>
      );
    } else {
      return (<div className="student-container student-container-diagnostic"><Spinner /></div>);
    }
  },
});

function select(state) {
  return {
    lessons: state.lessons,
    questions: state.questions,
    sentenceFragments: state.sentenceFragments,
    playLesson: state.playLesson, // the questionReducer
    routing: state.routing,
    fillInBlank: state.fillInBlank,
    titleCards: state.titleCards
    // sessions: state.sessions,
    // responses: state.responses,
  };
}

export default connect(select)(Lesson);
