import * as React from "react";
import {shallow} from "enzyme";
import { PlayGrammarContainer } from "../../components/grammarActivities/container";
import { grammarActivities, session, conceptsFeedback } from './data'

process.env.DEFAULT_URL = 'https://staging.quill.org'
process.env.QUILL_CMS = 'https://cms.quill.org'

describe("<PlayGrammarContainer />", () => {
  const wrapper = shallow(<PlayGrammarContainer
    conceptsFeedback={conceptsFeedback}
    dispatch={() => {}}
    grammarActivities={grammarActivities}
    session={session}
  />)

    it("should render", () => {
      expect(wrapper).toMatchSnapshot();
    });

});
