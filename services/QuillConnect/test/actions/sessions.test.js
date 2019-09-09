import SessionActions, { denormalizeSession, normalizeSession } from '../../app/actions/sessions';
import { v2mockSession, v4mockSession, mockQuestions } from './sessions.data';
import expect from 'expect';

// Populate our question cache to use in denormalization
SessionActions.populateQuestions("SC", mockQuestions);

// Normalization and denormalization modify data in place,
// so we need to make copies of our target references before
// running tests
const targetV2mockSession = JSON.parse(JSON.stringify(v2mockSession));
const targetV4mockSession = JSON.parse(JSON.stringify(v4mockSession));

describe("dernormalize session", () => {
  it("should convert a v4 session to a v2 session", () => {
    const denormalizedSession = denormalizeSession(v4mockSession);
    expect(denormalizedSession).toEqual(targetV2mockSession);
  })
});

describe("normalize session", () => {
  it("should convert a v2 session to a v4 session", () => {
    const normalizedSession = normalizeSession(v2mockSession);
    expect(normalizedSession).toEqual(targetV4mockSession);
  })
});
