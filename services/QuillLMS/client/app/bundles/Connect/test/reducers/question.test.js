import expect from 'expect';
import { nextQuestion } from '../../actions';
import questionReducer from '../../reducers/questionReducer';
import testQuestions from '../../utils/testQuestions.js';

describe("the question reducer", () => {
  const initialState = {
    answeredQuestions: [],
    currentQuestion: {
      prompt: "Combine the following sentences into one sentence.",
      sentences: [
        "Bill swept the floor.",
        "Andy painted the walls."
      ],
      responses: [
        {
          text: "The woman in the next room is the teacher.",
          feedback: "Excellent, that's correct!",
          status: "optimal",
        },
        {
          text: "The woman in the next room is a teacher.",
          feedback: "How do you refer to one specific teacher?",
          status: "sub-optimal",
        },
        {
          text: "The woman teacher is in the next room.",
          feedback: "We write female teacher instead of woman teacher.",
          status: "sub-optimal",
        },
        {
          text: "The woman is the teacher in the next room.",
          feedback: "It is stronger to write \"In the next room\" before \"is the teacher.\"",
          status: "sub-optimal",
        },
        {
          text: "The female teacher is in the next room.",
          feedback: "Excellent, that's correct!",
          status: "optimal",
        },
        {
          text: "The teacher is in the next room.",
          feedback: "What gender is the teacher?",
          status: "sub-optimal",
        }
      ]
    },
    unansweredQuestions: testQuestions
  }

})

describe("going to the next question", () => {
  const initialState = {
    answeredQuestions: [],
    currentQuestion: {
      prompt: "Combine the following sentences into one sentence.",
      sentences: [
        "Bill swept the floor.",
        "Andy painted the walls."
      ],
      responses: [
        {
          text: "The woman in the next room is the teacher.",
          feedback: "Excellent, that's correct!",
          status: "optimal",
        },
        {
          text: "The woman in the next room is a teacher.",
          feedback: "How do you refer to one specific teacher?",
          status: "sub-optimal",
        },
        {
          text: "The woman teacher is in the next room.",
          feedback: "We write female teacher instead of woman teacher.",
          status: "sub-optimal",
        },
        {
          text: "The woman is the teacher in the next room.",
          feedback: "It is stronger to write \"In the next room\" before \"is the teacher.\"",
          status: "sub-optimal",
        },
        {
          text: "The female teacher is in the next room.",
          feedback: "Excellent, that's correct!",
          status: "optimal",
        },
        {
          text: "The teacher is in the next room.",
          feedback: "What gender is the teacher?",
          status: "sub-optimal",
        }
      ]
    },
    unansweredQuestions: testQuestions
  }

  it("should respond to the NEXT_QUESTION action", () => {
    const action = nextQuestion();
    const newState = questionReducer(initialState, action);
    expect(newState).toNotEqual(initialState);
  })

  it("should have the previous current question as the last item in the answeredQuestions array", () => {
    const action = nextQuestion();
    const newState = questionReducer(initialState, action);
    const lastAnsweredQuestion = newState.answeredQuestions[newState.answeredQuestions.length - 1];
    expect(initialState.answeredQuestions).toEqual([]);
    expect(lastAnsweredQuestion).toEqual(initialState.currentQuestion);
  })

  it("should have the new current question as the first item in the unansweredQuestions array", () => {
    const action = nextQuestion();
    const newState = questionReducer(initialState, action);
    const firstUnansweredQuestion = initialState.unansweredQuestions[0];
    expect(newState.currentQuestion).toEqual(firstUnansweredQuestion);
  })

  it("should not have the new current question in the unansweredQuestions array", () => {
    const action = nextQuestion();
    const newState = questionReducer(initialState, action);
    const oldfirstUnansweredQuestion = initialState.unansweredQuestions[0];
    const newfirstUnansweredQuestion = newState.unansweredQuestions[0];
    expect(newState.currentQuestion).toEqual(oldfirstUnansweredQuestion);
    expect(newState.currentQuestion).toNotEqual(newfirstUnansweredQuestion);
  })

  it("should set the current question to undefined if there are no more unanswered questions", () => {
    initialState.unansweredQuestions = [];
    const action = nextQuestion();
    const newState = questionReducer(initialState, action);
    expect(newState.currentQuestion).toNotExist();
  })

  it("should not push undefined into the answeredQuestions array if there is no current question", () => {
    initialState.currentQuestion = undefined;
    const action = nextQuestion();
    const newState = questionReducer(initialState, action);
    expect(newState.answeredQuestions.length).toEqual(0);
  })
})
