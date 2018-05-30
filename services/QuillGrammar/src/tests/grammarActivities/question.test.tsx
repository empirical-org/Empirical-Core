import * as React from "react";
import {shallow} from "enzyme";
import { QuestionComponent } from "../../components/grammarActivities/question";
import { currentActivity, session, currentQuestion } from './data'

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
});
