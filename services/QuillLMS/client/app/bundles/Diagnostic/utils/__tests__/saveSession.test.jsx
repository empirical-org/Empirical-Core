import * as React from 'react';

import { requestPost, requestPut, } from '../../../../modules/request/index';
import { saveSession, initializeSubscription } from '../saveSession'

jest.mock('../../libs/conceptResults/diagnostic', () => ({
  getConceptResultsForAllQuestions: jest.fn().mockReturnValue([{ score: 90 }]),
}));
jest.mock('../../../Shared/index', () => ({
  roundValuesToSeconds: jest.fn().mockReturnValue({ seconds: 3600 }),
}));
jest.mock('../../../../modules/request/index', () => ({
  requestPost: jest.fn(),
  requestPut: jest.fn(),
}));

const updateState = jest.fn();

describe('saveSession', () => {
  it('should correctly handle creating an anonymous session when sessionID is absent', () => {
    const playDiagnostic = { answeredQuestions: [{ questionType: 'Q1' }] };
    const timeTracking = { start: 100, end: 200 };
    const match = { params: { diagnosticID: '1234' } };

    saveSession(null, timeTracking, playDiagnostic, match, false, updateState);

    expect(updateState).toHaveBeenCalledWith({ error: false });
    expect(requestPost).toHaveBeenCalled();
  });

  it('should finish a session when sessionID is present', () => {
    const playDiagnostic = { answeredQuestions: [{ questionType: 'Q1' }] };
    const timeTracking = { start: 100, end: 200 };
    const match = { params: { diagnosticID: '1234' } };

    saveSession('sessionId', timeTracking, playDiagnostic, match, false, updateState);

    expect(updateState).toHaveBeenCalledWith({ error: false });
    expect(requestPut).toHaveBeenCalled();
  });
});
