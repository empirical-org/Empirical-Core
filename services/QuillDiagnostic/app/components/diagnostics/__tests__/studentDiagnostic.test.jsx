import React from 'react';
import { shallow } from 'enzyme';
import { StudentDiagnostic } from '../studentDiagnostic';
import {
    CarouselAnimation,
    hashToCollection,
    SmartSpinner,
    PlayTitleCard,
    DiagnosticProgressBar
} from 'quill-component-library/dist/componentLibrary';
import { clearData, loadData, nextQuestion, nextQuestionWithoutSaving, submitResponse, updateName, updateCurrentQuestion, resumePreviousDiagnosticSession } from '../../../actions/diagnostics.js';
import _ from 'underscore';
import SessionActions from '../../../actions/sessions.js';
import PlaySentenceFragment from '../sentenceFragment.jsx';
import PlayDiagnosticQuestion from '../sentenceCombining.jsx';
import PlayFillInTheBlankQuestion from '../../fillInBlank/playFillInTheBlankQuestion';
import LandingPage from '../landing.jsx';
import FinishedDiagnostic from '../finishedDiagnostic.jsx';
import { getConceptResultsForAllQuestions } from '../../../libs/conceptResults/diagnostic';
import { getParameterByName } from '../../../libs/getParameterByName';
const request = require('request');
jest.mock('request');

const mockProps = {
    dispatch: jest.fn(),
    lessons: {
        hasreceiveddata: false
    },
    playDiagnostic: {
        currentQuestion: null,
        questionSet: null,
        answeredQuestions: []
    },
    sentenceFragments: {
        hasreceiveddata: false
    },
    questions: {
        hasreceiveddata: false
    },
    params: {
        diagnosticID: 'testID'
    }
};

describe('StudentDiagnostic Container prop-dependent component rendering', () => {
    const container = shallow(<StudentDiagnostic {...mockProps} />);
    let mockPlayDiagnosticProp = {
        questionSet: [],
        answeredQuestions: [],
        currentQuestion: {
            type: 'SC',
            data: {
                key: 'test-key'
            }
        }
    };
    it("renders a DiagnosticProgressBar with 25% load message and SmartSpinner if no props have been received", () => {
        expect(container.find(DiagnosticProgressBar).length).toEqual(1);
        expect(container.find(SmartSpinner).length).toEqual(1);
        expect(container.find(SmartSpinner).props().message).toEqual('Loading Your Lesson 25%');
    });
    it("renders a DiagnosticProgressBar with 50% load message and SmartSpinner if playDiagnostic.questionSet props has not been received", () => {
        container.setProps({
            lessons: {
                hasreceiveddata: true,
                data: {
                    testID: {
                        landingPageHtml: 'test-html'
                    }
                }
            },
            questions: { hasreceiveddata: true },
            sentenceFragments: { hasreceiveddata: true }
        });
        expect(container.find(DiagnosticProgressBar).length).toEqual(1);
        expect(container.find(SmartSpinner).length).toEqual(1);
        expect(container.find(SmartSpinner).props().message).toEqual('Loading Your Lesson 50%');
    });
    it("renders a PlayDiagnosticQuestion component if currentQuestion.type is equal to SC", () => {
        container.setProps({ playDiagnostic: mockPlayDiagnosticProp });
        expect(container.find(PlayDiagnosticQuestion).length).toEqual(1);
    });
    it("renders a PlaySentenceFragment component if currentQuestion.type is equal to SF", () => {
        mockPlayDiagnosticProp.currentQuestion.type = 'SF';
        container.setProps({ playDiagnostic: mockPlayDiagnosticProp });
        expect(container.find(PlaySentenceFragment).length).toEqual(1);
    });
    it("renders a PlayFillInTheBlankQuestion component if currentQuestion.type is equal to FB", () => {
        mockPlayDiagnosticProp.currentQuestion.type = 'FB';
        container.setProps({ playDiagnostic: mockPlayDiagnosticProp });
        expect(container.find(PlayFillInTheBlankQuestion).length).toEqual(1);
    });
    it("renders a PlayTitleCard component if currentQuestion.type is equal to TL", () => {
        mockPlayDiagnosticProp.currentQuestion.type = 'TL';
        container.setProps({ playDiagnostic: mockPlayDiagnosticProp });
        expect(container.find(PlayTitleCard).length).toEqual(1);
    });
    it("renders a FinishedDiagnostic component if answeredQuestions is greater than 0 and unansweredQuestions is 0", () => {
        mockPlayDiagnosticProp.currentQuestion = null;
        mockPlayDiagnosticProp.answeredQuestions = [{}, {}, {}];
        mockPlayDiagnosticProp.unansweredQuestions = [];
        container.setProps({ playDiagnostic: mockPlayDiagnosticProp });
        expect(container.find(FinishedDiagnostic).length).toEqual(1);
    });
    it("renders a LandingPage component in all other cases", () => {
        mockPlayDiagnosticProp.answeredQuestions = [];
        container.setProps({ playDiagnostic: mockPlayDiagnosticProp });
        expect(container.find(LandingPage).length).toEqual(1);
    });
});