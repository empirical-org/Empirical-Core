import React from 'react';
import { shallow } from 'enzyme';
import { clearData, loadData, resumePreviousSession, submitResponse, updateCurrentQuestion, updateName, nextQuestion } from '../../../actions.js';
import { Lesson } from '../lesson.jsx';
import { PlayTitleCard, Register, Spinner } from 'quill-component-library/dist/componentLibrary';
import Finished from '../finished.jsx';
import PlayLessonQuestion from '../question';
import PlaySentenceFragment from '../sentenceFragment.jsx';
import PlayFillInTheBlankQuestion from '../fillInBlank.tsx';
import SessionActions from '../../../actions/sessions.js';

const mockProps = {
  conceptsFeedback: {},
  dispatch: jest.fn(),
  fillInBlank: {
    data: {},
    hasreceiveddata: false
  },
  lessons: {
    data: {
      "-KTAQiTDo_9gAnk3aBG5": {
        flag: "production",
        name: "Como Fazer Um Rolê",
        questions: [
          { key: "test1", questionType: "questions" },
          { key: "test2", questionType: "fillInBlank" },
          { key: "test3", questionType: "titleCards" },
          { key: "test4", questionType: "sentenceFragments" }
        ]
      }
    },
    hasreceiveddata: true
  },
  params: {
    lessonID: "-KTAQiTDo_9gAnk3aBG5"
  },
  playLesson: {
    answeredQuestions: [{}],
    currentQuestion: {
      question: {
        key: "-KSIktfuzOUIS4sSxfIx6",
        attempts: []
      },
      type: "SF"
    },
    questionSet: [{}, {}, {}],
    unansweredQuestions: [
      { key: "test1", questionType: "questions" },
      { key: "test2", questionType: "fillInBlank" },
      { key: "test3", questionType: "titleCards" },
      { key: "test4", questionType: "sentenceFragments" }
    ]
  },
  questions: {
    data: {
      "test1": {
        questionType: "questions"
      },
    },
    hasreceiveddata: false
  },
  fillInBlank: {
    data: {
      "test2": {
        questionType: "fillInBlank"
      },
    },
    hasreceiveddata: false
  },
  titleCards: {
    data: {
      "test3": {
        questionType: "titleCards"
      }
    },
    hasreceiveddata: false
  },
  sentenceFragments: {
    data: {
      "test4": {
        questionType: "sentenceFragments"
      }
    },
    hasreceiveddata: false
  }
};

// needed for class functions that make request calls
jest.mock('request');

describe('Lesson Container prop-dependent component rendering', () => {
  const container = shallow(<Lesson {...mockProps} />);

  it("renders a Spinner component if this.state.sessionInitialized, hasreceiveddata, data & data[lessonID] are all falsy", () => {
    expect(container.find(Spinner).length).toEqual(1);
    expect(container.state().sessionInitialized).toEqual(false);
  });
  it("renders a PlaySentenceFragment component if currentQuestion.type is equal to SF", () => {
    container.setState({ sessionInitialized: true });
    expect(container.find(PlaySentenceFragment).length).toEqual(1);
    expect(container.instance().props.playLesson.currentQuestion.type).toEqual("SF");
  });
  it("renders a PlayFillInTheBlankQuestion component if currentQuestion.type is equal to FB", () => {
    let newProps = mockProps;
    newProps.playLesson.currentQuestion.type = "FB";
    container.setProps({ ...newProps });
    expect(container.find(PlayFillInTheBlankQuestion).length).toEqual(1);
    expect(container.instance().props.playLesson.currentQuestion.type).toEqual("FB");
  });
  it("renders a PlayTitleCard component if currentQuestion.type is equal to TL", () => {
    let newProps = mockProps;
    newProps.playLesson.currentQuestion.type = "TL";
    container.setProps({ ...newProps });
    expect(container.find(PlayTitleCard).length).toEqual(1);
    expect(container.instance().props.playLesson.currentQuestion.type).toEqual("TL");
  });
  it("renders a PlayLessonQuestion component if currentQuestion.type is any other value", () => {
    let newProps = mockProps;
    newProps.playLesson.currentQuestion.type = "EA";
    container.setProps({ ...newProps });
    expect(container.find(PlayLessonQuestion).length).toEqual(1);
    expect(container.instance().props.playLesson.currentQuestion.type).toEqual("EA");
  });
  it("renders a Finished component if student finishes all questions", () => {
    let newProps = mockProps;
    newProps.playLesson.answeredQuestions.push({});
    newProps.playLesson.unansweredQuestions = [];
    newProps.playLesson.currentQuestion = undefined;
    container.setProps({ ...newProps });
    expect(container.find(Finished).length).toEqual(1);
  });
  it("renders a Register component if student has not begin and there is no currentQuestion prop", () => {
    let newProps = mockProps;
    newProps.playLesson.unansweredQuestions.push({});
    newProps.playLesson.answeredQuestions = [];
    newProps.playLesson.currentQuestion = null;
    container.setProps({ ...newProps });
    expect(container.find(Register).length).toEqual(1);
  });
});

describe('Lesson Container functions', () => {
  let container = shallow(<Lesson {...mockProps} />);

  it("will call dispatch() props function on mount, passing clearData() action as a callback", () => {
    expect(mockProps.dispatch).toHaveBeenCalledWith(clearData());
  });
  it("doesNotHaveAndIsNotGettingResponses() returns opposite boolean value of hasOrIsGettingResponses piece of state", () => {
    expect(container.state().hasOrIsGettingResponses).toEqual(false);
    expect(container.instance().doesNotHaveAndIsNotGettingResponses()).toEqual(true);
  });
  it("getPreviousSessionData returns session piece of state", () => {
    expect(container.instance().getPreviousSessionData()).toEqual(container.state().session);
  });
  it("resumeSession calls dispatch() props function passing resumePreviousSession(data) action as a callback if data prop is present", () => {
    let data = null;
    expect(container.instance().resumeSession(data)).toEqual(undefined);
    data = {};
    container.instance().resumeSession(data);
    expect(mockProps.dispatch).toHaveBeenCalledWith(resumePreviousSession(data));
  });
  it("hasQuestionsInQuestionSet returns length of questionSet if playLesson, playLesson.questionSet and playLesson.questionSet.length props are all truthy", () => {
    let props = {
      playLesson: {
        questionSet: []
      }
    };
    expect(container.instance().hasQuestionsInQuestionSet(props)).toEqual(0);
    props.playLesson.questionSet = [{}, {}, {}];
    expect(container.instance().hasQuestionsInQuestionSet(props)).toEqual(3);
  });
  it("saveSessionIdToState sets sessionID piece of state and sessionInitialized to true", () => {
    container.instance().saveSessionIdToState();
    expect(container.state().sessionID).toEqual(null);
    expect(container.state().sessionInitialized).toEqual(true);
  });
  it("submitResponse calls dispatch() props function passing submitResponse(response) action as a callback", () => {
    const response = {};
    container.instance().submitResponse({});
    expect(mockProps.dispatch).toHaveBeenCalledWith(submitResponse(response));
  });
  it("saveToLMS calls createAnonActivitySession class function passing lessonID, results & score as props if sessionID is null", () => {
    const createAnonActivitySession = jest.spyOn(container.instance(), "createAnonActivitySession");
    container.instance().saveToLMS();
    expect(createAnonActivitySession).toHaveBeenCalled();
  });
  it("saveToLMS calls finishActivitySession class function passing sessionID, results & score as props if sessionID is not null", () => {
    const finishActivitySession = jest.spyOn(container.instance(), "finishActivitySession");
    container.setState({ sessionID: "2ku1y234" });
    container.instance().saveToLMS();
    expect(finishActivitySession).toHaveBeenCalled();
  });
  // it("finishActivitySession makes a get request and sets saved piece of date to true on success", () => {
  //   const callback = jest.fn();
  //   const request = jest.fn().mockImplementation(({}, callback) => {
  //     return Promise.resolve(callback({ data: {} }));
  //   });
  //   container.instance().finishActivitySession();
  //   expect(container.state().saved).toEqual(true);
  // });
  // it("finishActivitySession makes a get request and sets saved piece of date to true on success; otherwise, saved is set to false", async () => {
  //   await container.instance().finishActivitySession();
  //   container.update();
  //   expect(container.state().saved).toEqual(true);
  // });
  //   it("createAnonActivitySession", () => {
  //   });
  it("markIdentify calls dispatch() props method, passing updateCurrentQuestion(bool) action as a callback", () => {
    container.instance().markIdentify({});
    expect(mockProps.dispatch).toHaveBeenCalled();
  });
  it("questionsForLesson returns an array of filtered questions", () => {
    const filteredQuestions = [
      { question: { key: "test1", questionType: "questions" }, type: "SC" },
      { question: { key: "test2", questionType: "fillInBlank" }, type: "FB" },
      { question: { key: "test3", questionType: "titleCards" }, type: "TL" },
      { question: { key: "test4", questionType: "sentenceFragments" }, type: "SF" }];
    expect(container.instance().questionsForLesson()).toEqual(filteredQuestions);
  });
  it("startActivity calls saveStudentName() and dispatch() prop function twice, passing loadData(this.questionsForLesson()) & nextQuestion() as callbacks", () => {
    const saveStudentName = jest.spyOn(container.instance(), "saveStudentName");
    const questionsForLesson = jest.spyOn(container.instance(), "questionsForLesson");
    container.instance().startActivity("Eric Adams");
    expect(saveStudentName).toHaveBeenCalledWith("Eric Adams");
    expect(mockProps.dispatch).toHaveBeenCalledWith(loadData(questionsForLesson()));
    expect(mockProps.dispatch).toHaveBeenLastCalledWith(nextQuestion());
  });
  it("nextQuestion calls dispatch() prop function passing nextQuestion action as callback", () => {
    container.instance().nextQuestion();
    expect(mockProps.dispatch).toHaveBeenCalledWith(nextQuestion());
  });
  it("getLesson returns props.lessons.data[this.props.params.lessonID]", () => {
    expect(container.instance().getLesson()).toEqual(mockProps.lessons.data["-KTAQiTDo_9gAnk3aBG5"]);
  });
  it("getLessonName returns props.lessons.data[this.props.params.lessonID].name", () => {
    expect(container.instance().getLessonName()).toEqual("Como Fazer Um Rolê");
  });
  it("saveStudentName calls dispatch() prop function, passing updateName(name) as a callback", () => {
    container.instance().saveStudentName("Eric Adams");
    expect(mockProps.dispatch).toHaveBeenLastCalledWith(updateName("Eric Adams"));
  });
  it("getProgressPercent returns percent if playLesson, playLesson.answeredQuestions & playLesson.questionSet are present; otherwise, returns 0", () => {
    expect(container.instance().getProgressPercent()).toEqual(0);
  });
  it("saveSessionData calls SessionActions.update(this.state.sessionID, lessonData) if sessionID is present", () => {
    SessionActions.update = jest.fn();
    container.instance().saveSessionData({
      questionSet: [
        { question: { key: "-KSIktbarQVG4sSxfIx6", attempts: 1 } },
        { question: { key: "test1", attempts: 1 } },
        { question: { key: "-KSIktwooQVG4sSxfIx6", attempts: 1 } }
      ]
    });
    expect(SessionActions.update).toHaveBeenCalled()
  });
});
