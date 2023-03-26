import { shallow } from 'enzyme';
import * as React from 'react';
import 'whatwg-fetch';
import { PlayTitleCard, ProgressBar, Register, Spinner } from '../../../../Shared/index';
import { loadData, nextQuestion, resumePreviousSession, submitResponse, updateCurrentQuestion } from '../../../actions.js';
import SessionActions from '../../../actions/sessions.js';
import * as progressHelpers from '../../../libs/calculateProgress';
import PlayFillInTheBlankQuestion from '../fillInBlank.tsx';
import Finished from '../finished.jsx';
import { Lesson } from '../lesson.jsx';
import PlayLessonQuestion from '../question';
import PlaySentenceFragment from '../sentenceFragment.jsx';

// required function mocks
SessionActions.update = jest.fn();
progressHelpers.questionCount = jest.fn();
progressHelpers.answeredQuestionCount = jest.fn();
progressHelpers.getProgressPercent = jest.fn(() => {return 0});

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
  match: {
    params: {
      lessonID: "-KTAQiTDo_9gAnk3aBG5"
    }
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
  const filteredQuestions = [
    { question: { key: "test1", questionType: "questions" }, type: "SC" },
    { question: { key: "test2", questionType: "fillInBlank" }, type: "FB" },
    { question: { key: "test3", questionType: "titleCards" }, type: "TL" },
    { question: { key: "test4", questionType: "sentenceFragments" }, type: "SF" }
  ];
  let container = shallow(<Lesson {...mockProps} />);

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

  // TODO: implement finishActivitySession and createAnonActivitySession tests with request module mocking

  // it("finishActivitySession makes a put request and sets saved piece of state to true on success", () => {
  // });
  // it("finishActivitySession makes a put request and sets saved piece of state to false on failure", () => {
  // });
  // it("createAnonActivitySession makes a post request and sets saved piece of state to true on success", () => {
  // });

  it("markIdentify calls dispatch() props method, passing updateCurrentQuestion(bool) action as a callback", () => {
    const argument = updateCurrentQuestion({ identified: true });
    container.instance().markIdentify(true);
    expect(mockProps.dispatch).toHaveBeenCalledWith(argument);
  });
  it("questionsForLesson returns an array of filtered questions", () => {
    expect(container.instance().questionsForLesson()).toEqual(filteredQuestions);
  });
  it("startActivity calls saveStudentName() and dispatch() prop function twice, passing loadData(this.questionsForLesson()) & nextQuestion() as callbacks", () => {
    const questionsForLesson = jest.spyOn(container.instance(), "questionsForLesson");
    const argument = loadData(questionsForLesson());
    container.instance().startActivity();
    expect(mockProps.dispatch).toHaveBeenCalledWith(argument);
    expect(mockProps.dispatch).toHaveBeenLastCalledWith(nextQuestion());
  });
  it("nextQuestion calls dispatch() prop function passing nextQuestion action as callback", () => {
    container.instance().nextQuestion();
    expect(mockProps.dispatch).toHaveBeenCalledWith(nextQuestion());
  });
  it("getLesson returns props.lessons.data[this.props.params.lessonID]", () => {
    expect(container.instance().getLesson()).toEqual(mockProps.lessons.data["-KTAQiTDo_9gAnk3aBG5"]);
  });
  it("saveSessionData calls SessionActions.update(this.state.sessionID, lessonData) if sessionID is present", () => {
    container.instance().saveSessionData({
      questionSet: [
        { question: { key: "test1", attempts: 1 } },
        { question: { key: "test2", attempts: 1 } },
        { question: { key: "test3", attempts: 1 } }
      ]
    });
    expect(SessionActions.update).toHaveBeenCalled()
  });
  it("renderProgressBar render progress dependent on props", () => {
    mockProps.lessons = {
      hasreceiveddata: true,
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
      }
    };
    mockProps.playLesson = {
      questionSet: filteredQuestions,
      answeredQuestions: [],
      unansweredQuestions: filteredQuestions.slice(3),
      currentQuestion: {
        type: 'TL',
        data: {
          key: 'test-key'
        }
      }
    };
    container = shallow(<Lesson {...mockProps} />);
    container.setState({ sessionInitialized: true });
    container.instance().renderProgressBar();
    expect(container.find(ProgressBar).length).toEqual(1);
    expect(container.find(ProgressBar).props().percent).toEqual(0)
  });
});
