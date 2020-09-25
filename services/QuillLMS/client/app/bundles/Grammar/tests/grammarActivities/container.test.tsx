import * as React from "react";
import {shallow} from "enzyme";

import { grammarActivities, session, conceptsFeedback } from './data'

import { PlayGrammarContainer } from "../../components/grammarActivities/container";

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
