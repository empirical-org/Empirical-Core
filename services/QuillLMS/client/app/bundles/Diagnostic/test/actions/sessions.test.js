import 'whatwg-fetch';
import SessionActions, {
    allQuestions, denormalizeSession,
    normalizeSession
} from '../../actions/sessions';
import {
    denormalizedSession, mockFBQuestions,
    mockSCQuestions,
    mockTCQuestions, normalizedSession
} from './sessions.data';

// Populate our question cache to use in denormalization
SessionActions.populateQuestions("FB", mockFBQuestions);
SessionActions.populateQuestions("SC", mockSCQuestions);
SessionActions.populateQuestions("TC", mockTCQuestions);

// Normalization and denormalization modify data in place,
// so we need to make copies of our target references before
// running tests
const targetDenormalizedSession = JSON.parse(JSON.stringify(denormalizedSession));
const targetNormalizedSession = JSON.parse(JSON.stringify(normalizedSession));

describe("dernormalize session", () => {
  const denormalizedSession = denormalizeSession(normalizedSession);

  it("should convert a normalized session to a denormalized session", () => {
    expect(denormalizedSession).toEqual(targetDenormalizedSession);
  })

  it("should move any 'attempts' keys to the question object", () => {
    expect(denormalizedSession.answeredQuestions[0].data.attempts).toBeDefined();
  })

  it("should return the passed-in session when passed an already-denormalized session", () => {
    expect(denormalizeSession(denormalizedSession)).toEqual(denormalizedSession);
  })
});

describe("normalize session", () => {
  const normalizedSession = normalizeSession(denormalizedSession);

  it("should convert a denormalized session to a normalized session", () => {
    expect(normalizedSession).toEqual(targetNormalizedSession);
  })

  it("should move the 'attempts' key to the root object", () => {
    expect(normalizedSession.answeredQuestions[0].attempts).toBeDefined();
  })

  it("should move the question object to a 'question' key in root if there are attempts", () => {
    expect(typeof normalizedSession.answeredQuestions[0]).toEqual("object");
    expect(normalizedSession.answeredQuestions[0].question).toBeDefined();
    expect(typeof normalizedSession.answeredQuestions[0].question).toEqual("string");
  })
});

describe("populate questions", () => {
  const mockSCQuestions = {
    scKey: {
      data: 'foo'
    }
  }
  const mockFBQuestions = {
    fbKey: {
      data: 'foo'
    }
  }
  SessionActions.populateQuestions("SC", mockSCQuestions, true);
  SessionActions.populateQuestions("FB", mockFBQuestions, true);

  it("should attach the specified types to the questions", () => {
    expect(allQuestions['scKey'].type).toEqual('SC');
    expect(allQuestions['fbKey'].type).toEqual('FB');
  })

  it("should place the question data inside a question sub-key", () => {
    expect(allQuestions['scKey'].data).toEqual(mockSCQuestions['scKey']);
    expect(allQuestions['fbKey'].data).toEqual(mockFBQuestions['fbKey']);
  })

  it("should not populate multiple times without specifically forcing it", () => {
    const failData = {
      failKey: {
        data: 'foo'
      }
    }
    SessionActions.populateQuestions("SC", failData);
    expect(allQuestions['failKey']).toEqual(undefined);
  })
});
