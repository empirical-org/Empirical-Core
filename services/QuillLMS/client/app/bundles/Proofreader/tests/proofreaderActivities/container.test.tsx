import { mount } from "enzyme";
import * as React from "react";
import { PlayProofreaderContainer } from "../../components/proofreaderActivities/container";
import { ProofreaderActivityReducer } from './data';

process.env.DEFAULT_URL = 'https://staging.quill.org'
process.env.CMS_URL = 'https://cms.quill.org'

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
