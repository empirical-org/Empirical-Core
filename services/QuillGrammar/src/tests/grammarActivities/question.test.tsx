import * as React from "react";
import {shallow} from "enzyme";
import { QuestionComponent } from "../../components/grammarActivities/question";
import { currentActivity, session, currentQuestion } from './data'

describe("<PlayGrammarContainer />", () => {
  const wrapper = shallow(<QuestionComponent
    activity={currentActivity}
    answeredQuestions={session.answeredQuestions}
    unansweredQuestions={session.unansweredQuestions}
    currentQuestion={currentQuestion}
    goToNextQuestion={() => {}}
    checkAnswer={() => {}}
   />)

    it("should render", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should render an h1 with the current activity's title", () => {
      const title = wrapper.find('h1')
      expect(title.text()).toEqual(currentActivity.title)
    })

    it("should render an example div with the html from the current question's rule description", () => {
      const example = wrapper.find('.example')
      const html = "<div class=\"example\">" + currentQuestion.rule_description.replace(/\n/g, '<br />') + "</div>"
      expect(example.html()).toEqual(html)
    })

    it("should render an instructions div with the text from the current question's instructions", () => {
      const instructions = wrapper.find('.instructions')
      const html = "<div class=\"instructions\">" + currentQuestion.instructions + "</div>"
      expect(instructions.html()).toEqual(html)
    })

    it("should render a prompt div with the text from the current question's prompt", () => {
      const prompt = wrapper.find('.prompt')
      const html = "<div class=\"prompt\">" + currentQuestion.prompt + "</div>"
      expect(prompt.html()).toEqual(html)
    })
});
