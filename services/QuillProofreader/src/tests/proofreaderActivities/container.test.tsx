import * as React from "react";
import { shallow } from "enzyme";
import { PlayProofreaderContainer } from "../../components/proofreaderActivities/container";
import { ProofreaderActivityReducer } from './data'

process.env.EMPIRICAL_BASE_URL = 'https://staging.quill.org'
process.env.QUILL_CMS = 'https://cms.quill.org'

describe("<PlayProofreaderContainer />", () => {
  const wrapper = shallow(<PlayProofreaderContainer
    activityUID='KMyh3LulfVL0_KuPb8u'
    proofreaderActivities={ProofreaderActivityReducer}
    session={{ passage: [] }}
    session={{passage: 'string'}}
  />)

    it("should render", () => {
      expect(wrapper).toMatchSnapshot();
    });

});
