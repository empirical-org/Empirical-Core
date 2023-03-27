import expect from 'expect';
import { nextQuestion } from '../../actions';

describe("submit actions", () => {
  it("should be able to generate a next question action", () => {
    const action = nextQuestion();
    expect(action).toEqual({type: "NEXT_QUESTION"})
  })
})
