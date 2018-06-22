import React from 'react';
import { connect } from 'react-redux';
import CarouselAnim from '../shared/carouselAnimation.jsx';
import { clearData, loadData, nextQuestion, nextQuestionWithoutSaving, submitResponse, updateName, updateCurrentQuestion, resumePreviousDiagnosticSession } from '../../actions/diagnostics.js';
import _ from 'underscore';
import { hashToCollection } from '../../libs/hashToCollection';
import SessionActions from '../../actions/sessions.js';
import SmartSpinner from '../shared/smartSpinner.jsx';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayDiagnosticQuestion from './sentenceCombining.jsx';
import TitleCard from '../studentLessons/titleCard.tsx';
import LandingPage from './landing.jsx';
import FinishedDiagnostic from './finishedDiagnostic.jsx';
import DiagnosticProgressBar from '../shared/diagnosticProgressBar.jsx';
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
    const data = this.questionsForLesson();
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
    return this.props.lessons.data[this.props.params.diagnosticID];
  },

  getLessonName() {
    return this.props.lessons.data[this.props.params.diagnosticID].name;
  },

  saveStudentName(name) {
    this.props.dispatch(updateName(name));
  },

  questionsForLesson() {
    const { data, } = this.props.lessons,
      { diagnosticID, } = this.props.params;
    const filteredQuestions = data[diagnosticID].questions.filter(ques =>
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

  getQuestionType(type) {
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
  },

  render() {
    const questionType = this.props.playDiagnostic.currentQuestion ? this.props.playDiagnostic.currentQuestion.type : ''
    let component;
    if (this.props.questions.hasreceiveddata && this.props.sentenceFragments.hasreceiveddata) {
      if (!this.props.playDiagnostic.questionSet) {
        component = (<SmartSpinner message={'Loading Your Lesson 50%'} onMount={this.loadQuestionSet} key="step2" />);
      } else if (this.props.playDiagnostic.currentQuestion) {
        if (questionType === 'SC') {
          component = (<PlayDiagnosticQuestion
            question={this.props.playDiagnostic.currentQuestion.data} nextQuestion={this.nextQuestion}
            dispatch={this.props.dispatch}
            // responses={this.props.responses.data[this.props.playDiagnostic.currentQuestion.data.key]}
            key={this.props.playDiagnostic.currentQuestion.data.key}
            marking="diagnostic"
          />);
        } else if (questionType === 'SF') {
          component = (<PlaySentenceFragment
            question={this.props.playDiagnostic.currentQuestion.data} currentKey={this.props.playDiagnostic.currentQuestion.data.key}
            key={this.props.playDiagnostic.currentQuestion.data.key}
            // responses={this.props.responses.data[this.props.playDiagnostic.currentQuestion.data.key]}
            dispatch={this.props.dispatch}
            nextQuestion={this.nextQuestion} markIdentify={this.markIdentify}
            updateAttempts={this.submitResponse}
          />);
        } else if (questionType === 'TL') {
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
        component = <LandingPage begin={() => { this.startActivity('John'); }} session={this.getPreviousSessionData()} resumeActivity={this.resumeSession} questionCount={this.getQuestionCount()} />;
      }
    } else {
      component = (<SmartSpinner message={'Loading Your Lesson 25%'} onMount={() => {}} key="step1" />);
    }
    // component = (<SmartSpinner message={'Loading Your Lesson 33%'} onMount={() => {}} />);
    return (
      <div>
        <DiagnosticProgressBar percent={this.getProgressPercent()} />
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
    lessons: state.lessons
  };
}
export default connect(select)(StudentDiagnostic);
