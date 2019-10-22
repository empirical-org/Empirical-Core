import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import {
  hashToCollection,
  Spinner,
  CarouselAnimation,
  PlayTitleCard
} from 'quill-component-library/dist/componentLibrary';
import { clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion } from '../../actions/turk.js';
import diagnosticQuestions from './diagnosticQuestions.jsx';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayFillInTheBlankQuestion from './fillInBlank.tsx';
import PlayTurkQuestion from './question.tsx';
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
        prefill={this.getLesson().prefill}
        question={this.props.question.currentQuestion}
        submitResponse={this.submitResponse}
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
    if (this.props.playTurk && this.props.playTurk.answeredQuestions && this.props.playTurk.questionSet) {
      return this.props.playTurk.answeredQuestions.length / this.props.playTurk.questionSet.length * 100;
    }
    0;
  },

  getFetchedData() {
    const returnValue = this.getData().map((obj) => {
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
    const questionType = this.props.playTurk.currentQuestion ? this.props.playTurk.currentQuestion.type : ''
    let component;
    if (this.props.questions.hasreceiveddata && this.props.sentenceFragments.hasreceiveddata) {
      if (data[lessonID]) {
        if (this.props.playTurk.currentQuestion) {
          if (questionType === 'SC') {
            component = (<PlayTurkQuestion
              dispatch={this.props.dispatch}
              key={this.props.playTurk.currentQuestion.data.key}
              nextQuestion={this.nextQuestion}
              // responses={this.props.responses.data[this.props.playTurk.currentQuestion.data.key]}
              question={this.props.playTurk.currentQuestion.data}
              submitResponse={this.submitResponse}
            />);
          } else if (questionType === 'SF') {
            component = (<PlaySentenceFragment
              currentKey={this.props.playTurk.currentQuestion.data.key}
              dispatch={this.props.dispatch}
              key={this.props.playTurk.currentQuestion.data.key}
              // responses={this.props.responses.data[this.props.playTurk.currentQuestion.data.key]}
              markIdentify={this.markIdentify}
              nextQuestion={this.nextQuestion}
              question={this.props.playTurk.currentQuestion.data}
              updateAttempts={this.submitResponse}
            />);
          } else if (questionType === 'FB') {
            component = (<PlayFillInTheBlankQuestion
              currentKey={this.props.playTurk.currentQuestion.data.key}
              dispatch={this.props.dispatch}
              key={this.props.playTurk.currentQuestion.data.key}
              nextQuestion={this.nextQuestion}
              question={this.props.playTurk.currentQuestion.data}
              submitResponse={this.submitResponse}
            />)
          } else if (questionType === 'TL') {
            component = (
              <PlayTitleCard
                currentKey={this.props.playTurk.currentQuestion.data.key}
                data={this.props.playTurk.currentQuestion.data}
                dispatch={this.props.dispatch}
                nextQuestion={this.nextQuestionWithoutSaving}
              />
            );
          }        } else if (this.props.playTurk.answeredQuestions.length > 0 && this.props.playTurk.unansweredQuestions.length === 0) {
          component = (<FinishedDiagnostic saved={this.state.saved} saveToLMS={this.saveToLMS} />);
        } else {
          component = <LandingPage begin={() => { this.startActivity('John'); }} lesson={this.getLesson()} />;
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
        <progress className="progress diagnostic-progress" max="100" value={this.getProgressPercent()}>15%</progress>
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
    playTurk: state.playTurk,
    sentenceFragments: state.sentenceFragments,
    titleCards: state.titleCards,
    fillInBlank: state.fillInBlank
  };
}
export default connect(select)(StudentDiagnostic);
