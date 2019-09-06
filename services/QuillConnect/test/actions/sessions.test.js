import SessionActions, { denormalizeSession, normalizeSession } from '../../app/actions/sessions';
import { v2mockSession, v4mockSession, mockQuestions } from './sessions.data';
import expect from 'expect';

// Populate our question cache to use in denormalization
SessionActions.populateQuestions(mockQuestions);

// Normalization and denormalization modify data in place,
// so we need to make copies of our target references before
// running tests
const targetV2mockSession = JSON.parse(JSON.stringify(v2mockSession));
const targetV4mockSession = JSON.parse(JSON.stringify(v4mockSession));

describe("dernormalize session", () => {
  it("should convert a v4 session to a v2 session", () => {
    const denormalizedSession = denormalizeSession(v4mockSession);

    // This block of tests is a WIP.  The last two fail because the
    // incorrectSequences attached to question objects in v2 sessions
    // for answeredQuestions and questionSet have a "key" value assigned
    // to them that looks like it comes from an array index somewhere.
    // I need to figure out if this matters, or if denormalization should
    // strip it off.
    expect(denormalizedSession.currentQuestion).toEqual(targetV2mockSession.currentQuestion);
    expect(denormalizedSession.unansweredQuestions).toEqual(targetV2mockSession.unansweredQuestions);
    expect(denormalizedSession.answeredQuestions).toEqual(targetV2mockSession.answeredQuestions);
    expect(denormalizedSession.questionSet).toEqual(targetV2mockSession.questionSet);

    expect(denormalizedSession).toEqual(targetV2mockSession);
  })
});

describe("normalize session", () => {
  it("should convert a v2 session to a v4 session", () => {
    const normalizedSession = normalizeSession(v2mockSession);
    expect(normalizedSession).toEqual(targetV4mockSession);
  })
});
