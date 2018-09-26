import * as React from "react";
import {shallow} from "enzyme";
import { PlayGrammarContainer } from "../../components/grammarActivities/container";
import { grammarActivities, session } from './data'

describe("<PlayGrammarContainer />", () => {
  const wrapper = shallow(<PlayGrammarContainer
    dispatch={() => {}}
    grammarActivities={grammarActivities}
    session={session}
   />)

    it("should render", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should render an example with the text from the current question's rule description", () => {
      expect(wrapper)
    })
});
