import * as React from "react";
import { mount } from "enzyme";
import { PlayProofreaderContainer } from "../../components/proofreaderActivities/container";
import { ProofreaderActivityReducer } from './data'

process.env.DEFAULT_URL = 'https://staging.quill.org'
process.env.QUILL_CMS = 'https://cms.quill.org'

describe("<PlayProofreaderContainer />", () => {
  const wrapper = mount(<PlayProofreaderContainer
    activityUID='KMyh3LulfVL0_KuPb8u'
    dispatch={() => {}}
    proofreaderActivities={ProofreaderActivityReducer}
    session={{ passage: [] }}
  />)

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

});
