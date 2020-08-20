import * as React from "react";
import { shallow } from "enzyme";
import { PageLayout } from "../../components/PageLayout";

describe("<PageLayout />", () => {
  beforeEach(() => {
    const url = "http://localhost:3000/grammar/#/play/sw?anonymous=true";
    location = window.location;
    const mockLocation = new URL(url);
    mockLocation.replace = jest.fn();
    delete window.location;
    window.location = mockLocation;
  });

  afterEach(() => {
    window.location = location;
  });

  const component = shallow(<PageLayout />);

    it("should render", () => {
      expect(component).toMatchSnapshot();
    });
    it("should render a Sider if previewMode is true", () => {
      component.setState({ previewShowing: true });
      component.update();
      expect(component.find('Sider').length).toEqual(1);
    });
    it("should render a TeacherPreviewMenu", () => {
      component.setState({ previewShowing: true });
      component.update();
      expect(component.find('Connect(TeacherPreviewMenu)').length).toEqual(1);
    });
});
