import React from 'react';
import { shallow } from 'enzyme';
import { clearData } from '../../../actions.js';
import { Lesson } from '../lesson.jsx';
import Finished from '../finished.jsx';
import PlayLessonQuestion from '../question';
import PlaySentenceFragment from '../sentenceFragment.jsx';
import PlayFillInTheBlankQuestion from '../fillInBlank.tsx';
import { PlayTitleCard, Register, Spinner } from 'quill-component-library/dist/componentLibrary';

describe('Lesson container component rendering', () => {
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
                questions: [
                    { key: "-KSIktfuzQVG4sSxfIx6", questionType: "questions" },
                    { key: "-KRjGHDxjVR0OsVoKM_V", questionType: "questions" },
                    { key: "-KRjET-Yknj0orxiEO_w", questionType: "questions" }
                ]
            }
          },
          hasreceiveddata: true
      },
      params: {
        lessonID: "-KTAQiTDo_9gAnk3aBG5"
      },
      playLesson: {
        answeredQuestions: [],
        currentQuestion: {
            question: {
                key: "-KSIktfuzOUIS4sSxfIx6",
                attempts: []
            },
            type: "SF"
        },
        questionSet: [],
        unansweredQuestions: [
            { key: "-KSIktfuzQVG4sSxfIx6", questionType: "questions" },
            { key: "-KRjGHDxjVR0OsVoKM_V", questionType: "questions" },
            { key: "-KRjET-Yknj0orxiEO_w", questionType: "questions" }
        ]
      },
      questions: {
          data: {},
          hasreceiveddata: false
      },
      sentenceFragments: {
          data: {},
          hasreceiveddata: false
      },
      titleCards: {
          data: {},
          hasreceiveddata: false
      }
  };
  const container = shallow(<Lesson {...mockProps}/>);

  it("will call dispatch props method on mount, passing clearData action as argument", () => {
    expect(mockProps.dispatch).toHaveBeenCalledWith(clearData());
  });
  it("renders a Spinner component if this.state.sessionInitialized && hasreceiveddata && data && data[lessonID] are all false", () => {
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