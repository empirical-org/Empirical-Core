import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import {
  hashToCollection,
  Spinner,
  CarouselAnimation
} from 'quill-component-library/dist/componentLibrary';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion } from '../../actions/diagnostics.js';
import diagnosticQuestions from './diagnosticQuestions.jsx';
import PlaySentenceFragment from '../studentLessons/sentenceFragment.jsx';
import PlayDiagnosticQuestion from '../studentLessons/question.tsx';
import LandingPage from './landing.jsx';
import FinishedDiagnostic from './finishedDiagnostic.jsx';

const StudentDiagnostic = React.createClass({

  getInitialState() {
    return {
      saved: false,
    };
  },

  saveToLMS() {
    this.setState({ saved: true, });
  },

  componentWillMount() {
    this.props.dispatch(clearData());
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
    // const action = loadData(data)
    // this.props.dispatch(action);
    // const next = nextQuestion();
    // this.props.dispatch(next);
    const action = loadData(this.questionsForLesson());
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

  questionsForLesson() {
    // const {data} = this.props.lessons, {lessonID} = this.props.params;
    // console.log(data[lessonID], data[lessonID].questions)
    // return data[lessonID].questions;
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
      const data = this.props[questionType].data[key];
      data.key = key;
      const type = questionType === 'questions' ? 'SC' : 'SF';
      return { type, data, };
    });
  },

  getData() {
    if (this.props.params.lessonID) {
      return this.questionsForLesson();
    }
    return diagnosticQuestions();
  },

  markIdentify(bool) {
    const action = updateCurrentQuestion({ identified: bool, });
    this.props.dispatch(action);
  },

  getProgressPercent() {
    if (this.props.playDiagnostic && this.props.playDiagnostic.answeredQuestions && this.props.playDiagnostic.questionSet) {
      return this.props.playDiagnostic.answeredQuestions.length / this.props.playDiagnostic.questionSet.length * 100;
    }
    0;
  },

  getFetchedData() {
    const returnValue = this.getData().map((obj) => {
      console.log(obj);
      const data = (obj.questionType === 'questions') ? this.props.questions.data[obj.key] : this.props.sentenceFragments.data[obj.key];
      data.key = obj.key;
      // if(obj.type==="SF") {
      //   data.needsIdentification = true
      // } else if(obj.type==="SF2") {
      //   data.needsIdentification = false
      // }
      return {
        type: obj.questionType,
        data,
      };
    });
    return returnValue;
  },

  render() {
    const { data, } = this.props.lessons,
      { lessonID, } = this.props.params;
    let component;
    if (this.props.questions.hasreceiveddata && this.props.sentenceFragments.hasreceiveddata) {
      if (data[lessonID]) {
        if (this.props.playDiagnostic.currentQuestion) {
          if (this.props.playDiagnostic.currentQuestion.type === 'SC') {
            component = (<PlayDiagnosticQuestion question={this.props.playDiagnostic.currentQuestion.data} nextQuestion={this.nextQuestion} key={this.props.playDiagnostic.currentQuestion.data.key} dispatch={this.props.dispatch} />);
          } else {
            component = (<PlaySentenceFragment
              question={this.props.playDiagnostic.currentQuestion.data} currentKey={this.props.playDiagnostic.currentQuestion.data.key}
              key={this.props.playDiagnostic.currentQuestion.data.key}
              nextQuestion={this.nextQuestion} markIdentify={this.markIdentify}
              updateAttempts={this.submitResponse} dispatch={this.props.dispatch}
            />);
          }
        } else if (this.props.playDiagnostic.answeredQuestions.length > 0 && this.props.playDiagnostic.unansweredQuestions.length === 0) {
          component = (<FinishedDiagnostic saveToLMS={this.saveToLMS} saved={this.state.saved} />);
        } else {
          component = <LandingPage lesson={this.getLesson()} begin={() => { this.startActivity('John'); }} />;
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
    lessons: state.lessons,
    routing: state.routing,
    questions: state.questions,
    playDiagnostic: state.playDiagnostic,
    sentenceFragments: state.sentenceFragments,
  };
}
export default connect(select)(StudentDiagnostic);
