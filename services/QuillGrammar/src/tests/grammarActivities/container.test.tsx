import * as React from "react";
import {shallow} from "enzyme";
import { PlayGrammarContainer } from "../../components/grammarActivities/container";
import { grammarActivities, session } from './containerData'

describe("<PlayGrammarContainer />", () => {
  const wrapper = shallow(<PlayGrammarContainer
    dispatch={() => {}}
    grammarActivities={grammarActivities}
    session={session}
   />)

    it("should render", () => {
        expect(wrapper).toMatchSnapshot();
    });
});
