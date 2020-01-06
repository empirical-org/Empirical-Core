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
        hasreceivedata: false
    },
    playDiagnostic: {
        currentQuestion: null
    },
    sentenceFragments: {
        hasreceivedata: false
    },
    questions: {
        hasreceivedata: false
    }
};

describe('StudentDiagnostic Container prop-dependent component rendering', () => {
    const container = shallow(<StudentDiagnostic {...mockProps} />);
    it("renders a DiagnosticProgressBar and SmartSpinner if no props have been received", () => {
        expect(container.find(DiagnosticProgressBar).length).toEqual(1);
        expect(container.find(SmartSpinner).length).toEqual(1);
    });
});