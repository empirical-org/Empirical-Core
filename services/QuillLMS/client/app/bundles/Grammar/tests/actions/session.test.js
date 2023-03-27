import 'whatwg-fetch';
import {
    allQuestions,
    denormalizeSession,
    normalizeSession,
    populateQuestions
} from '../../actions/session';
import {
    denormalizedSession, mockQuestions, normalizedSession
} from './session.data';

// Populate our question cache to use in denormalization
populateQuestions(mockQuestions);

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
    expect(denormalizedSession.answeredQuestions[0].attempts).toBeDefined();
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
  const mockQuestions = {
    key: {
      data: 'foo'
    }
  }
  populateQuestions(mockQuestions, true);

  it("should place the question data inside a question sub-key", () => {
    expect(allQuestions['key']).toEqual(mockQuestions['key']);
  })

  it("should not populate multiple times without specifically forcing it", () => {
    const failData = {
      failKey: {
        data: 'foo'
      }
    }
    populateQuestions(failData);
    expect(allQuestions['failKey']).toEqual(undefined);
  })
});
