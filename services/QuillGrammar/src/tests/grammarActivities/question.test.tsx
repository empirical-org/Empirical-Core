import * as React from "react";
import {shallow} from "enzyme";
import { QuestionComponent } from "../../components/grammarActivities/question";
import {
  currentActivity,
  session,
  currentQuestion,
  currentQuestionWithOneIncorrectAttempt,
  currentQuestionWithTwoIncorrectAttempts,
  currentQuestionWithOneCorrectAttempt
} from './data'

describe("<PlayGrammarContainer />", () => {
  const shallowWrapper = shallow(<QuestionComponent
    activity={currentActivity}
    answeredQuestions={session.answeredQuestions}
    unansweredQuestions={session.unansweredQuestions}
    currentQuestion={currentQuestion}
    goToNextQuestion={() => {}}
    checkAnswer={() => {}}
  />)

    it("should render", () => {
      expect(shallowWrapper).toMatchSnapshot();
    });

    it("should render an h1 with the current activity's title", () => {
      const title = shallowWrapper.find('h1')
      expect(title.text()).toEqual(currentActivity.title)
    })

    it("should render an example div with the html from the current question's rule description", () => {
      const example = shallowWrapper.find('.example')
      const html = "<div class=\"example\">" + currentQuestion.rule_description.replace(/\n/g, '<br />') + "</div>"
      expect(example.html()).toEqual(html)
    })

    it("should render an instructions div with the text from the current question's instructions", () => {
      const instructions = shallowWrapper.find('.instructions')
      const html = "<div class=\"instructions\">" + currentQuestion.instructions + "</div>"
      expect(instructions.html()).toEqual(html)
    })

    it("should render a prompt div with the text from the current question's prompt", () => {
      const prompt = shallowWrapper.find('.prompt')
      const html = "<div class=\"prompt\">" + currentQuestion.prompt + "</div>"
      expect(prompt.html()).toEqual(html)
    })

    describe("the Hide Example button", () => {

      describe("before it is clicked", () => {
        const unclickedWrapper = shallow(<QuestionComponent
          activity={currentActivity}
          answeredQuestions={session.answeredQuestions}
          unansweredQuestions={session.unansweredQuestions}
          currentQuestion={currentQuestion}
          goToNextQuestion={() => {}}
          checkAnswer={() => {}}
        />)

        it ("renders with the text 'Hide Example'", () => {
          expect(unclickedWrapper.update().find('.example-button').children().first().text()).toEqual('Hide Example')
        })

        it ("the example is showing", () => {
          expect(unclickedWrapper.update().find('.show')).toHaveLength(1)
        })

        it ("state.showExample is true", () => {
          expect(unclickedWrapper.update().state('showExample')).toBe(true)
        })
      })

      describe("after it is clicked", () => {
        const clickedWrapper = shallow(<QuestionComponent
          activity={currentActivity}
          answeredQuestions={session.answeredQuestions}
          unansweredQuestions={session.unansweredQuestions}
          currentQuestion={currentQuestion}
          goToNextQuestion={() => {}}
          checkAnswer={() => {}}
        />)

        clickedWrapper.find('.example-button').simulate('click')

        it ("renders with the text 'Show Example'", () => {
          expect(clickedWrapper.find('.example-button').children().first().text()).toEqual('Show Example')
        })

        it ("the example is showing", () => {
          expect(clickedWrapper.find('.show')).toHaveLength(0)
        })

        it ("state.showExample is false", () => {
          expect(clickedWrapper.state('showExample')).toBe(false)
        })
      })
    })

    describe('the textarea', () => {

      describe('before it is typed in', () => {
        const untypedInWrapper = shallow(<QuestionComponent
          activity={currentActivity}
          answeredQuestions={session.answeredQuestions}
          unansweredQuestions={session.unansweredQuestions}
          currentQuestion={currentQuestion}
          goToNextQuestion={() => {}}
          checkAnswer={() => {}}
        />)
        const textArea = untypedInWrapper.find('textarea')
        it ('should not have any text', () => {
          expect(textArea.props().value).toEqual('')
        })

        it ('state.response is empty', () => {
          expect(untypedInWrapper.state('response')).toEqual('')
        })
      })

      describe('after it is typed in', () => {
        const typedInWrapper = shallow(<QuestionComponent
          activity={currentActivity}
          answeredQuestions={session.answeredQuestions}
          unansweredQuestions={session.unansweredQuestions}
          currentQuestion={currentQuestion}
          goToNextQuestion={() => {}}
          checkAnswer={() => {}}
        />)
        const typedText = 'Hello'
        typedInWrapper.find('textarea').simulate('change', { target: { value: typedText } })

        it ('should have the typed text', () => {
          expect(typedInWrapper.find('textarea').props().value).toEqual(typedText)
        })

        it ('state.response has the typed string', () => {
          expect(typedInWrapper.state('response')).toEqual(typedText)
        })
      })

    })

    describe('feedback and the check answer button', () => {

      describe("if state.questionStatus is 'unanswered'", () => {

        it("the check answer button says 'Check Work'", () => {
          expect(shallowWrapper.find('.check-answer-button').children().first().text()).toEqual('Check Work')
        })

        it("there is no feedback", () => {
          expect(shallowWrapper.find('.feedback')).toHaveLength(0)
        })
      })

      describe("if state.questionStatus is 'incorrectly answered'", () => {
        const wrapperWithOneIncorrectAttempt = shallow(<QuestionComponent
          activity={currentActivity}
          answeredQuestions={session.answeredQuestions}
          unansweredQuestions={session.unansweredQuestions}
          currentQuestion={currentQuestionWithOneIncorrectAttempt}
          goToNextQuestion={() => {}}
          checkAnswer={() => {}}
        />)

        wrapperWithOneIncorrectAttempt.setState({questionStatus: 'incorrectly answered'})

        it("the check answer button says 'Recheck Work'", () => {
          expect(wrapperWithOneIncorrectAttempt.find('.check-answer-button').children().first().text()).toEqual('Recheck Work')
        })

        it("there is feedback with a try again class", () => {
          expect(wrapperWithOneIncorrectAttempt.find('.feedback.try-again')).toHaveLength(1)
        })
      })

      describe("if state.questionStatus is 'final attempt'", () => {
        const wrapperWithTwoIncorrectAttempts = shallow(<QuestionComponent
          activity={currentActivity}
          answeredQuestions={session.answeredQuestions}
          unansweredQuestions={session.unansweredQuestions}
          currentQuestion={currentQuestionWithTwoIncorrectAttempts}
          goToNextQuestion={() => {}}
          checkAnswer={() => {}}
        />)

        wrapperWithTwoIncorrectAttempts.setState({questionStatus: 'incorrectly answered'})

        it("the check answer button says 'Recheck Work'", () => {
          expect(wrapperWithTwoIncorrectAttempts.find('.check-answer-button').children().first().text()).toEqual('Recheck Work')
        })

        it("there is feedback with an incorrect class", () => {
          expect(wrapperWithTwoIncorrectAttempts.find('.feedback.incorrect')).toHaveLength(1)
        })
      })

      describe("if state.questionStatus is 'correct'", () => {
        const wrapperWithOneCorrectAttempt = shallow(<QuestionComponent
          activity={currentActivity}
          answeredQuestions={session.answeredQuestions}
          unansweredQuestions={session.unansweredQuestions}
          currentQuestion={currentQuestionWithOneCorrectAttempt}
          goToNextQuestion={() => {}}
          checkAnswer={() => {}}
        />)

        wrapperWithOneCorrectAttempt.setState({questionStatus: 'correct'})

        it("the check answer button says 'Next Problem'", () => {
          expect(wrapperWithOneCorrectAttempt.find('.check-answer-button').children().first().text()).toEqual('Next Problem')
        })

        it("there is feedback with a correct class", () => {
          expect(wrapperWithOneCorrectAttempt.find('.feedback.correct')).toHaveLength(1)
        })
      })
    })
});
