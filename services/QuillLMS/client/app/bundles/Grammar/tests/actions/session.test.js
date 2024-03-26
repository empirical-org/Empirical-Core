import 'whatwg-fetch';

import {
  denormalizedSession,
  mockQuestions,
  normalizedSession,
  mockProofreaderSession1,
  mockProofreaderSession2,
  mockProofreaderSession3,
} from './session.data';

import {
  allQuestions,
  denormalizeSession,
  normalizeSession,
  populateQuestions,
  handleProofreaderSession,
  getQuestionsForConcepts
} from '../../actions/session';
import * as sessionActions from '../../actions/session'
import { mockDispatch } from '../__mocks__/dispatch'

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

describe("handleProofreaderSession", () => {
  describe("no data", () => {
    it("should not have been dispatched", () => {
      handleProofreaderSession(null, { session: { proofreaderSession: null }})(mockDispatch)
      expect(mockDispatch).not.toHaveBeenCalled()
    })
  })
  describe("with data", () => {
    jest.spyOn(sessionActions, 'getQuestionsForConcepts').mockImplementation(() => {
      return {}
    });
    describe("4 or less incorrect concepts", () => {
      it("should return hash with concept uids and quantity of 3", () => {

        const mockState = { session: { proofreaderSession: null } }
        const concepts = {
          "R3sBcYAvoXP2_oNVXiA98g": { "quantity": 3 },
          "hJKqVOkQQQgfEsmzOWC1xw": { "quantity": 3 },
          "tSSLMHqX0q-9mKTJHSyung": { "quantity": 3 }
        }
        handleProofreaderSession(mockProofreaderSession1, mockState)(mockDispatch)
        expect(getQuestionsForConcepts).toHaveBeenCalledWith(concepts, 'production')
      })
    })
    describe("between 5 and 9 incorrect concepts", () => {
      it("should return hash with concept uids and quantity of 2", () => {
        const mockState = { session: { proofreaderSession: null } }
        const concepts = {
          "R3sBcYAvoXP2_oNVXiA98g": { "quantity": 2 },
          "asdh783hjadkjasku3jhas": { "quantity": 2 },
          "hJKqVOkQQQgfEsmzOWC1xw": { "quantity": 2 },
          "i8s7u34nksjhdninsdlkji": { "quantity": 2 },
          "tSSLMHqX0q-9mKTJHSyung": { "quantity": 2 }
        }
        handleProofreaderSession(mockProofreaderSession2, mockState)(mockDispatch)
        expect(getQuestionsForConcepts).toHaveBeenCalledWith(concepts, 'production')
      })
    })
    describe("10 or more incorrect concepts", () => {
      it("should return hash with concept uids and quantity of 2", () => {
        const mockState = { session: { proofreaderSession: null } }
        const concepts = {
          "87iyhbnsdii4nskdh8ikhn": { "quantity": 1 },
          "9823haksjdaksjd983jkha": { "quantity": 1 },
          "R3sBcYAvoXP2_oNVXiA98g": { "quantity": 1 },
          "ais87h43kjasdkhj8hkass": { "quantity": 1 },
          "asdh783hjadkjasku3jhas": { "quantity": 1 },
          "ash983hjashnbasdh934hn": { "quantity": 1 },
          "hJKqVOkQQQgfEsmzOWC1xw": { "quantity": 1 },
          "tSSLMHqX0q-9mKTJHSyasd": { "quantity": 1 },
          "tSSLMHqX0q-9mKTJHSyung": { "quantity": 1 },
          "znbxi7erhbsj7n3unsdujn": { "quantity": 1 }
        }
        handleProofreaderSession(mockProofreaderSession3, mockState)(mockDispatch)
        expect(getQuestionsForConcepts).toHaveBeenCalledWith(concepts, 'production')
      })
    })
  })
})
