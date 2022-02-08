import * as React from "react";
import { shallow } from "enzyme";
import WelcomePage from "../../components/proofreaderActivities/welcomePage";

describe("<WelcomePage />", () => {
  const wrapper = shallow(<WelcomePage
    onNextClick={() => {}}
  />)

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

});
