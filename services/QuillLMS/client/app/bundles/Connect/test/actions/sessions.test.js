import 'whatwg-fetch';
import SessionActions, {
    allQuestions, denormalizeSession,
    normalizeSession
} from '../../actions/sessions';
import { mockSentenceCompletionQuestions, v2mockSession, v4mockSession } from './sessions.data';

// Populate our question cache to use in denormalization
SessionActions.populateQuestions("SC", mockSentenceCompletionQuestions);

// Normalization and denormalization modify data in place,
// so we need to make copies of our target references before
// running tests
const targetV2mockSession = JSON.parse(JSON.stringify(v2mockSession));
const targetV4mockSession = JSON.parse(JSON.stringify(v4mockSession));

describe("dernormalize session", () => {
  const denormalizedSession = denormalizeSession(v4mockSession);

  it("should convert a v4 session to a v2 session", () => {
    expect(denormalizedSession).toEqual(targetV2mockSession);
  })

  it("should move any 'attempts' keys to the question object", () => {
    expect(denormalizedSession.answeredQuestions[0].question.attempts).toBeDefined();
  })
});

describe("normalize session", () => {
  const normalizedSession = normalizeSession(v2mockSession);

  it("should convert a v2 session to a v4 session", () => {
    expect(normalizedSession).toEqual(targetV4mockSession);
  })

  it("should move the 'attempts' key to the root object", () => {
    expect(normalizedSession.answeredQuestions[0].attempts).toBeDefined();
  })

  it("should leave the question object as the root object if there are no attempts", () => {
    expect(typeof normalizedSession.currentQuestion).toEqual("string");
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
    expect(allQuestions['scKey'].question).toEqual(mockSCQuestions['scKey']);
    expect(allQuestions['fbKey'].question).toEqual(mockFBQuestions['fbKey']);
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
