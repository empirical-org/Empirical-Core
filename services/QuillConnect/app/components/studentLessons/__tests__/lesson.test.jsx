import React from 'react';
import { shallow } from 'enzyme';
import { clearData } from '../../../actions.js';
import { Lesson } from '../lesson.jsx';
import PlayLessonQuestion from '../question';
import PlaySentenceFragment from '../sentenceFragment.jsx';
import PlayFillInTheBlankQuestion from '../fillInBlank.tsx';

describe('Lesson component', () => {
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
          }
      },
      params: {
        lessonID: "-KTAQiTDo_9gAnk3aBG5"
      },
      playLesson: {
        answeredQuestions: [],
        currentQuestions: {
            question: {
                key: "-KSIktfuzOUIS4sSxfIx6"
            },
            type: null
        },
        questionSet: [],
        unanswerQuestions: [
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
  }
  const component = shallow(<Lesson {...mockProps}/>);

  it("will call dispatch props method on mount, passing clearData action as argument", () => {
    expect(mockProps.dispatch).toHaveBeenCalledWith(clearData());
  });
});