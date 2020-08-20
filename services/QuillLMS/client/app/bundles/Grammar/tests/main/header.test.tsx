import * as React from "react";
import { shallow } from "enzyme";
import { Header } from "../../components/Header";

describe("<Header />", () => {

  const component = shallow(<Header onTogglePreview={jest.fn()} previewShowing={true} />);

    it("should render", () => {
      expect(component).toMatchSnapshot();
    });
    it("should not render a Show menu button if previewShowing is true", () => {
      expect(component.find('button').length).toEqual(0);
    });
    it("should render a Show menu button if previewShowing is false", () => {
      component.setProps({ previewShowing: false });
      expect(component.find('button').length).toEqual(1);
    });
});
