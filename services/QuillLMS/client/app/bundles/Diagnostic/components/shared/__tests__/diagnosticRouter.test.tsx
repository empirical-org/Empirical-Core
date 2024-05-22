import { shallow } from 'enzyme';
import * as React from 'react';

import { SmartSpinner } from '../../../../Shared/index';
import { DiagnosticRouter } from '../diagnosticRouter';

let mockProps = {
  children: null,
  dispatch: jest.fn(),
  fillInBlank: {
    hasreceiveddata: false
  },
  lessons: {
    hasreceiveddata: false,
    data: {
      'test-id': {
        isELL: false
      }
    }
  },
  location: {},
  match: {
    params: {
      diagnosticID: 'test-id'
    }
  },
  playDiagnostic: {},
  questions: {
    hasreceiveddata: false
  },
  route: {},
  routeParams: {
    diagnosticID: ''
  },
  router: {},
  routes: [],
  sessions: {
    data: {}
  },
  sentenceFragments: {
    hasreceiveddata: false
  },
  titleCards: {
    hasreceiveddata: false
  }
};

describe('Diagnostic Router', () => {
  it("renders a SmartSpinner when all data hasn't been received", () => {
    const container = shallow(<DiagnosticRouter {...mockProps} />);
    expect(container.find(SmartSpinner).length).toEqual(1);
  });
  it("renders a StudentDiagnostic if isELL is false, passing all props", () => {
    mockProps.fillInBlank.hasreceiveddata = true;
    mockProps.lessons.hasreceiveddata = true;
    mockProps.questions.hasreceiveddata = true;
    mockProps.sentenceFragments.hasreceiveddata = true;
    const container = shallow(<DiagnosticRouter {...mockProps} />);
    expect(container.find('Connect(StudentDiagnostic)').length).toEqual(1);
    expect(container.find('Connect(StudentDiagnostic)').props()).toEqual(mockProps);
  });
  it("renders an ELLStudentDiagnostic if isELL is true, passing all props", () => {
    mockProps.lessons.data['test-id'].isELL = true;
    const container = shallow(<DiagnosticRouter {...mockProps} />);
    expect(container.find('withI18nextTranslation(Connect(ELLStudentDiagnostic))').length).toEqual(1);
    expect(container.find('withI18nextTranslation(Connect(ELLStudentDiagnostic))').props()).toEqual(mockProps);
  });
});
