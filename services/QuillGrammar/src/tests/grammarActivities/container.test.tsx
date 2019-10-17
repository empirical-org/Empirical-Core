import * as React from "react";
import {shallow} from "enzyme";
import { PlayGrammarContainer } from "../../components/grammarActivities/container";
import { grammarActivities, session, conceptsFeedback } from './data'

process.env.EMPIRICAL_BASE_URL = 'https://staging.quill.org'
process.env.QUILL_CMS = 'https://cms.quill.org'

describe("<PlayGrammarContainer />", () => {
  const wrapper = shallow(<PlayGrammarContainer
    dispatch={() => {}}
    grammarActivities={grammarActivities}
    session={session}
    conceptsFeedback={conceptsFeedback}
  />)

    it("should render", () => {
      expect(wrapper).toMatchSnapshot();
    });

});
