import * as React from "react";
import { shallow } from "enzyme";

import { Header } from "../Header";

describe("<Header />", () => {

  const component = shallow(<Header isOnMobile={true} isTeacher={true} onTogglePreview={jest.fn()} previewShowing={true} />);

  it("should render", () => {
    expect(component).toMatchSnapshot();
  });
  it("should not render a Show menu button if previewShowing is true", () => {
    expect(component.find('button').length).toEqual(0);
  });
});
