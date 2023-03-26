import { shallow } from 'enzyme';
import * as React from 'react';

import {
    CarouselAnimation, PlayTitleCard,
    ProgressBar, SmartSpinner
} from '../../../../Shared/index';
import { clearData, loadData, nextQuestion, resumePreviousDiagnosticSession, setCurrentQuestion, submitResponse, updateCurrentQuestion } from '../../../actions/diagnostics.js';
import SessionActions from '../../../actions/sessions.js';
import * as progressHelpers from '../../../libs/calculateProgress';
import * as diagnosticHelper from '../../../libs/conceptResults/diagnostic';
import * as parameterHelper from '../../../libs/getParameterByName';
import PlayFillInTheBlankQuestion from '../../fillInBlank/playFillInTheBlankQuestion';
import FinishedDiagnostic from '../finishedDiagnostic.jsx';
import LandingPage from '../landing.jsx';
import PlayDiagnosticQuestion from '../sentenceCombining.jsx';
import PlaySentenceFragment from '../sentenceFragment.jsx';
import { StudentDiagnostic } from '../studentDiagnostic';

// required mocked functions
progressHelpers.questionCount = jest.fn();
progressHelpers.answeredQuestionCount = jest.fn();
progressHelpers.getProgressPercent = jest.fn(() => {return 0});
parameterHelper.getParameterByName = jest.fn();
diagnosticHelper.getConceptResultsForAllQuestions = jest.fn();
SessionActions.update = jest.fn();

let mockProps = {
  dispatch: jest.fn(),
  lessons: {
    hasreceiveddata: true,
    data: {
      testID: {
        landingPageHtml: 'test-html',
        questions: []
      },
    }
  },
  playDiagnostic: {
    currentQuestion: null,
    diagnosticID: 'testID',
    questionSet: null,
    answeredQuestions: [],
    unansweredQuestions: []
  },
  previewMode: false,
  questions: { hasreceiveddata: true },
  questionToPreview: {},
  sentenceFragments: { hasreceiveddata: true },
  skippedToQuestionFromIntro: false,
  match: {
    params: {
      diagnosticID: 'testID',
      lessonID: 'testID'
    }
  },
};

describe('StudentDiagnostic Container prop-dependent component rendering', () => {
  const container = shallow(<StudentDiagnostic {...mockProps} />);
  let mockPlayDiagnosticProp = {
    questionSet: [
      {
        type: 'SC',
        data: {
          key: 'test-key'
        }
      }
    ],
    answeredQuestions: [],
    unansweredQuestions: [],
    currentQuestion: {
      type: 'SC',
      data: {
        key: 'test-key'
      }
    }
  };
  it("renders a SmartSpinner with 50% load message if playDiagnostic.questionSet props has not been received", () => {
    expect(container.find(SmartSpinner).length).toEqual(1);
    expect(container.find(SmartSpinner).props().message).toEqual('Loading Your Lesson 50%');
  });
  it("renders a PlayDiagnosticQuestion component if currentQuestion.type is equal to SC, wrapped in a CarouselAnimation component", () => {
    container.setProps({ playDiagnostic: mockPlayDiagnosticProp });
    expect(container.find(PlayDiagnosticQuestion).length).toEqual(1);
    expect(container.find(CarouselAnimation).length).toEqual(1);
  });
  it("renders a PlaySentenceFragment component if currentQuestion.type is equal to SF, wrapped in a CarouselAnimation component", () => {
    mockPlayDiagnosticProp.currentQuestion.type = 'SF';
    container.setProps({ playDiagnostic: mockPlayDiagnosticProp });
    expect(container.find(PlaySentenceFragment).length).toEqual(1);
    expect(container.find(CarouselAnimation).length).toEqual(1);
  });
  it("renders a PlayFillInTheBlankQuestion component if currentQuestion.type is equal to FB, wrapped in a CarouselAnimation component", () => {
    mockPlayDiagnosticProp.currentQuestion.type = 'FB';
    container.setProps({ playDiagnostic: mockPlayDiagnosticProp });
    expect(container.find(PlayFillInTheBlankQuestion).length).toEqual(1);
    expect(container.find(CarouselAnimation).length).toEqual(1);
  });
  it("renders a PlayTitleCard component if currentQuestion.type is equal to TL, wrapped in a CarouselAnimation component", () => {
    mockPlayDiagnosticProp.currentQuestion.type = 'TL';
    container.setProps({ playDiagnostic: mockPlayDiagnosticProp });
    expect(container.find(PlayTitleCard).length).toEqual(1);
    expect(container.find(CarouselAnimation).length).toEqual(1);
  });
  it("renders a FinishedDiagnostic component if answeredQuestions is greater than 0 and unansweredQuestions is 0, wrapped in a CarouselAnimation component", () => {
    mockPlayDiagnosticProp.currentQuestion = null;
    mockPlayDiagnosticProp.answeredQuestions = [{}, {}, {}];
    mockPlayDiagnosticProp.unansweredQuestions = [];
    container.setProps({ playDiagnostic: mockPlayDiagnosticProp });
    expect(container.find(FinishedDiagnostic).length).toEqual(1);
    expect(container.find(CarouselAnimation).length).toEqual(1);
  });
  it("renders a LandingPage component in all other cases, wrapped in a CarouselAnimation component", () => {
    mockPlayDiagnosticProp.answeredQuestions = [];
    container.setProps({ playDiagnostic: mockPlayDiagnosticProp });
    expect(container.find(LandingPage).length).toEqual(1);
    expect(container.find(CarouselAnimation).length).toEqual(1);
  });
});

describe('StudentDiagnostic Container functions', () => {
  mockProps.lessons = {
    hasreceiveddata: true,
    data: {
      testID: {
        landingPageHtml: 'test-html',
        questions: [
          { key: "test1", questionType: "questions" },
          { key: "test2", questionType: "fillInBlank" },
          { key: "test3", questionType: "sentenceFragments" },
          { key: "test4", questionType: "titleCards" },
        ],
        name: 'Test Lesson'
      },
      researchDiagnostic: {
        questions: []
      }
    }
  };
  mockProps.playDiagnostic = {
    questionSet: [],
    answeredQuestions: [],
    unansweredQuestions: [{ data: {} }],
    currentQuestion: {
      type: 'SC',
      data: {
        key: 'test-key'
      }
    }
  };
  mockProps.questions = {
    data: {
      "test1": {
        questionType: "questions"
      }
    },
    hasreceiveddata: false
  };
  mockProps.fillInBlank = {
    data: {
      "test2": {
        questionType: "fillInBlank"
      },
    },
    hasreceiveddata: false
  };
  mockProps.sentenceFragments = {
    data: {
      "test3": {
        questionType: "sentenceFragments"
      }
    },
    hasreceiveddata: false
  };
  mockProps.titleCards = {
    data: {
      "test4": {
        questionType: "titleCards"
      }
    },
    hasreceiveddata: false
  };
  const filteredQuestions = [
    { data: { attempts: [], key: "test1", questionType: "questions" }, type: "SC" },
    { data: { attempts: [], key: "test2", questionType: "fillInBlank" }, type: "FB" },
    { data: { attempts: [], key: "test3", questionType: "sentenceFragments" }, type: "SF" },
    { data: { attempts: [], key: "test4", questionType: "titleCards" }, type: "TL" }];

  let container = shallow(<StudentDiagnostic {...mockProps} />);

  it("dispatch() prop function gets called on mount with clearData() passed as an argument", () => {
    const argument = clearData();
    expect(mockProps.dispatch).toHaveBeenCalledWith(argument);
  });
  it("getPreviousSessionData returns sessions piece of state", () => {
    const mockSession = 'test123';
    container.setState({ session: mockSession });
    expect(container.instance().getPreviousSessionData()).toEqual(mockSession);
  });
  it("resumeSessionData calls dispatch() prop function, with resumePreviousDiagnosticSession(data) if data is present", () => {
    const argument = resumePreviousDiagnosticSession({});
    container.instance().resumeSession({});
    expect(mockProps.dispatch).toHaveBeenCalledWith(argument);
  });
  it("getSessionId returns undefined if 'null', otherwise, returns sessionId", () => {
    parameterHelper.getParameterByName.mockImplementation(() => 'null');
    expect(container.instance().getSessionId()).toEqual(undefined);
    parameterHelper.getParameterByName.mockImplementation(() => 'test123');
    expect(container.instance().getSessionId()).toEqual('test123');
    expect(parameterHelper.getParameterByName).toHaveBeenCalledWith('student');
  });
  it("saveSessionData calls SessionActions.update, passing sessionId and lessonData if sessionId is present", () => {
    const mockSessionId = 'test-session-id';
    container.setState({ sessionID: mockSessionId })
    container.instance().saveSessionData({});
    expect(SessionActions.update).toHaveBeenCalledWith(mockSessionId, {});
  });
  it("doesNotHaveAndIsNotGettingResponses returns true if hasOrIsGettingResponses piece of state is false, otherwise false", () => {
    container.setState({ hasOrIsGettingResponses: false });
    expect(container.instance().doesNotHaveAndIsNotGettingResponses()).toEqual(true)
    container.setState({ hasOrIsGettingResponses: true });
    expect(container.instance().doesNotHaveAndIsNotGettingResponses()).toEqual(false)
  });
  it("hasQuestionsInQuestionSet returns length of questionSet of playDiagnostic.questionSet props", () => {
    expect(container.instance().hasQuestionsInQuestionSet(mockProps)).toEqual(0);
    mockProps.playDiagnostic.questionSet = [{}, {}, {}, {}];
    expect(container.instance().hasQuestionsInQuestionSet(mockProps)).toEqual(4);
  });
  it("saveToLMS calls createAnonActivitySession class function passing diagnosticID, results & 1 as arguments if sessionID is null", () => {
    const createAnonActivitySession = jest.spyOn(container.instance(), 'createAnonActivitySession');
    container.setState({ sessionID: null });
    container.instance().saveToLMS();
    expect(createAnonActivitySession).toHaveBeenCalled();
  });
  it("saveToLMS calls finishActivitySession class function passing sessionID, results & 1 as arguments if sessionID is not null", () => {
    const finishActivitySession = jest.spyOn(container.instance(), 'finishActivitySession');
    container.setState({ sessionID: 'test-session-id' });
    container.instance().saveToLMS();
    expect(finishActivitySession).toHaveBeenCalled();
    expect(diagnosticHelper.getConceptResultsForAllQuestions).toHaveBeenCalledWith([]);
  });

  // TODO: implement finishActivitySession and createAnonActivitySession tests with request module mocking

  // it("finishActivitySession makes a put request and sets saved piece of state to true on success", () => {
  // });
  // it("finishActivitySession makes a put request and sets saved piece of state to false on failure", () => {
  // });
  // it("createAnonActivitySession makes a post request and sets saved piece of state to true on success", () => {
  // });

  it("submitResponse calls dispatch() prop function, passing submitResponse(response) as an argument", () => {
    const response = {};
    container.instance().submitResponse({});
    expect(mockProps.dispatch).toHaveBeenCalledWith(submitResponse(response));
  });
  it("questionsForDiagnostic returns an array of question objects", () => {
    const response = container.instance().questionsForDiagnostic();
    expect(response.length).toEqual(mockProps.lessons.data.testID.questions.length);
  });
  it("startActivity calls dispatch() prop function passing nextQuestion as an argument if not in previewMode", () => {
    const questionsForLesson = jest.spyOn(container.instance(), 'questionsForLesson');
    const argument1 = loadData(questionsForLesson());
    const argument2 = nextQuestion();
    container.instance().startActivity();
    expect(mockProps.dispatch).toHaveBeenCalledWith(argument1);
    expect(mockProps.dispatch).toHaveBeenCalledWith(argument2);
  });
  it("startActivity calls dispatch() prop function passing setCurrentQuestion as an argument if in previewMode and intro skipped", () => {
    mockProps.previewMode = true;
    mockProps.questionToPreview = { key: "test1", questionType: "questions" };
    mockProps.skippedToQuestionFromIntro = true;
    container = shallow(<StudentDiagnostic {...mockProps} />);
    const argument = setCurrentQuestion(mockProps.questionToPreview);
    container.instance().startActivity();
    expect(mockProps.dispatch).toHaveBeenLastCalledWith(argument);
  });
  it("nextQuestion calls dispatch() prop function passing setCurrentQuestion as an argument while in previewMode", () => {
    const argument = setCurrentQuestion(mockProps.playDiagnostic.unansweredQuestions[0].data);
    container.instance().nextQuestion();
    expect(mockProps.dispatch).toHaveBeenLastCalledWith(argument);
  });
  it("nextQuestion calls dispatch() prop function passing nextQuestion as an argument while not in previewMode", () => {
    mockProps.previewMode = false;
    container = shallow(<StudentDiagnostic {...mockProps} />);
    const argument = nextQuestion();
    container.instance().nextQuestion();
    expect(mockProps.dispatch).toHaveBeenLastCalledWith(argument);
  });
  it("getLesson returns lesson at lessons.data prop at key of [params.diagnosticID] prop ", () => {
    const response = container.instance().getLesson();
    expect(response).toEqual(mockProps.lessons.data.testID);
  });
  it("questionsForLesson returns an array of filtered questions objects", () => {
    expect(container.instance().questionsForLesson()).toEqual(filteredQuestions);
  });
  it("getQuestionCount returns 15 if diagnosticID is 'researchDiagnostic', otherwise returns 22", () => {
    expect(container.instance().getQuestionCount()).toEqual('22');
    mockProps.match.params = {
      diagnosticID: 'researchDiagnostic',
      lessonID: 'testID'
    };
    container = shallow(<StudentDiagnostic {...mockProps} />);
    expect(container.instance().getQuestionCount()).toEqual('15');
  });
  it("markIdentify calls dispatch() prop function passing updateCurrentQuestion({ identified: true }) as an argument", () => {
    const argument = updateCurrentQuestion({ identified: true });
    container.instance().markIdentify(true);
    expect(mockProps.dispatch).toHaveBeenCalledWith(argument);
  });
  it("getQuestionType returns abbreviated question type", () => {
    expect(container.instance().getQuestionType('questions')).toEqual('SC')
    expect(container.instance().getQuestionType('fillInBlanks')).toEqual('FB')
    expect(container.instance().getQuestionType('sentenceFragments')).toEqual('SF')
    expect(container.instance().getQuestionType('titleCards')).toEqual('TL')
  });
  it("landingPageHtml returns html string", () => {
    mockProps.match.params = { diagnosticID: 'testID', lessonID: 'test' };
    container = shallow(<StudentDiagnostic {...mockProps} />);
    expect(container.instance().landingPageHtml()).toEqual('test-html')
  });
  it("renderProgressBar render progress dependent on props", () => {
    mockProps.lessons.hasreceiveddata = true;
    mockProps.questions.hasreceiveddata = true;
    mockProps.sentenceFragments.hasreceiveddata = true;
    mockProps.playDiagnostic = {
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
    container = shallow(<StudentDiagnostic {...mockProps} />);
    container.instance().renderProgressBar();
    expect(container.find(ProgressBar).length).toEqual(1);
    expect(container.find(ProgressBar).props().percent).toEqual(0)
  });
});
