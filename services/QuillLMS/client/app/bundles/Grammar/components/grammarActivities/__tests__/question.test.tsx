import * as React from "react";
import {mount} from "enzyme";
import ContentEditable from 'react-contenteditable';
import { QuestionComponent } from "../question";
import {
  currentActivity,
  session,
  currentQuestion,
  currentQuestionWithOneIncorrectAttempt,
  currentQuestionWithFiveIncorrectAttempts,
  currentQuestionWithOneCorrectAttempt,
  conceptsFeedback,
  responses
} from './data'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

import.meta.env.VITE_DEFAULT_URL = 'https://staging.quill.org'
import.meta.env.QUILL_CMS = 'https://cms.quill.org'

const componentDidMount = QuestionComponent.prototype.componentDidMount = jest.fn();

describe("<QuestionComponent />", () => {
  const mountWrapper = mount(<QuestionComponent
    activity={currentActivity}
    answeredQuestions={session.answeredQuestions}
    checkAnswer={() => {}}
    concepts={{}}
    conceptsFeedback={conceptsFeedback}
    currentQuestion={currentQuestion}
    goToNextQuestion={() => {}}
    unansweredQuestions={session.unansweredQuestions}
  />)

  it("should render", () => {
    expect(mountWrapper).toMatchSnapshot();
  });

  it("should render an h1 with the current activity's title", () => {
    const title = mountWrapper.find('h1')
    expect(title.text()).toEqual(currentActivity.title)
  })

  it("should render an example div with the html from the current question's rule description", () => {
    const example = mountWrapper.find('.example')
    const html = "<div class=\"example\">" + currentQuestion.rule_description.replace(/\n/g, '<br>') + "</div>"
    expect(example.html()).toEqual(html)
  })

  it("should render an instructions div with the text from the current question's instructions", () => {
    const instructions = mountWrapper.find('.student-feedback-container')
    expect(instructions.text()).toEqual(currentQuestion.instructions)
  })

  it("should render a prompt div with the text from the current question's prompt", () => {
    const prompt = mountWrapper.find('.prompt')
    const html = "<div class=\"prompt\">" + currentQuestion.prompt + "</div>"
    expect(prompt.html()).toEqual(html)
  })

  describe('the textarea', () => {

    describe('before it is typed in', () => {
      const untypedInWrapper = mount(<QuestionComponent
        activity={currentActivity}
        answeredQuestions={session.answeredQuestions}
        checkAnswer={() => {}}
        concepts={{}}
        conceptsFeedback={conceptsFeedback}
        currentQuestion={currentQuestion}
        goToNextQuestion={() => {}}
        unansweredQuestions={session.unansweredQuestions}
      />)
      const textArea = untypedInWrapper.find(ContentEditable)
      it ('should not have any text', () => {
        expect(textArea.props().html).toEqual('')
      })

      it ('state.response is empty', () => {
        expect(untypedInWrapper.state('response')).toEqual('')
      })
    })

    describe('after it is typed in', () => {
      const typedInWrapper = mount(<QuestionComponent
        activity={currentActivity}
        answeredQuestions={session.answeredQuestions}
        checkAnswer={() => {}}
        concepts={{}}
        conceptsFeedback={conceptsFeedback}
        currentQuestion={currentQuestion}
        goToNextQuestion={() => {}}
        unansweredQuestions={session.unansweredQuestions}
      />)
      const typedText = 'Hello'
      typedInWrapper.setState({ response: typedText })
      const typedInTextArea = typedInWrapper.find(ContentEditable)

      it ('should have the typed text', () => {
        expect(typedInTextArea.props().html).toEqual(typedText)
      })
    })

  })

  describe('feedback and the check answer button', () => {

    describe("if state.questionStatus is 'unanswered'", () => {
      mountWrapper.setState({ responses })

      it("the check answer button says 'Get feedback'", () => {
        expect(mountWrapper.find('.quill-button').text()).toEqual('Get feedback')
      })
    })

    describe("if state.questionStatus is 'incorrectly answered'", () => {
      const wrapperWithOneIncorrectAttempt = mount(<QuestionComponent
        activity={currentActivity}
        answeredQuestions={session.answeredQuestions}
        checkAnswer={() => {}}
        concepts={{}}
        conceptsFeedback={conceptsFeedback}
        currentQuestion={currentQuestionWithOneIncorrectAttempt}
        goToNextQuestion={() => {}}
        unansweredQuestions={session.unansweredQuestions}
      />)

      wrapperWithOneIncorrectAttempt.setState({questionStatus: 'incorrectly answered', responses })

      it("the check answer button says 'Get feedback'", () => {
        expect(wrapperWithOneIncorrectAttempt.find('.quill-button').text()).toEqual('Get feedback')
      })

      it("there is feedback with a revise class", () => {
        expect(wrapperWithOneIncorrectAttempt.find('.student-feedback-container.revise')).toHaveLength(1)
      })
    })

    describe("if state.questionStatus is 'final attempt'", () => {
      const wrapperWithFiveIncorrectAttempts = mount(<QuestionComponent
        activity={currentActivity}
        answeredQuestions={session.answeredQuestions}
        checkAnswer={() => {}}
        concepts={{}}
        conceptsFeedback={conceptsFeedback}
        currentQuestion={currentQuestionWithFiveIncorrectAttempts}
        goToNextQuestion={() => {}}
        unansweredQuestions={session.unansweredQuestions}
      />)

      wrapperWithFiveIncorrectAttempts.setState({questionStatus: 'final attempt', responses })

      it("the check answer button says 'Next question'", () => {
        expect(wrapperWithFiveIncorrectAttempts.find('.quill-button').text()).toEqual('Next question')
      })

      it("there is feedback with a revise class", () => {
        expect(wrapperWithFiveIncorrectAttempts.find('.student-feedback-container.revise')).toHaveLength(1)
      })
    })

    describe("if state.questionStatus is 'correctly answered'", () => {
      const wrapperWithOneCorrectAttempt = mount(<QuestionComponent
        activity={currentActivity}
        answeredQuestions={session.answeredQuestions}
        checkAnswer={() => {}}
        concepts={{}}
        conceptsFeedback={conceptsFeedback}
        currentQuestion={currentQuestionWithOneCorrectAttempt}
        goToNextQuestion={() => {}}
        unansweredQuestions={session.unansweredQuestions}
      />)

      wrapperWithOneCorrectAttempt.setState({questionStatus: 'correctly answered', responses })

      it("the check answer button says 'Next question'", () => {
        expect(wrapperWithOneCorrectAttempt.find('.quill-button')).toHaveLength(1)
        expect(wrapperWithOneCorrectAttempt.find('.quill-button').text()).toEqual('Next question')
      })

      it("there is feedback with a success class", () => {
        expect(wrapperWithOneCorrectAttempt.find('.student-feedback-container.success')).toHaveLength(1)
      })
    })
  })
});
