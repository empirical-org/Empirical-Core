import { shallow } from "enzyme";
import * as React from "react";
import WelcomePage from "../../components/proofreaderActivities/welcomePage";

describe("<WelcomePage />", () => {
  const wrapper = shallow(<WelcomePage
    onNextClick={() => {}}
  />)

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

});
