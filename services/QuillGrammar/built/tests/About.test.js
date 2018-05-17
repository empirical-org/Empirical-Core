import * as React from "react";
// Jest snapshot test
// import * as TestUtils from "react-dom/test-utils";
// import AboutPage from "../components/about/AboutPage";
// describe("<AboutPage />", () => {
//     it("render", () => {
//         expect(TestUtils.createRenderer().render(
//             <AboutPage />
//         )).toMatchSnapshot();
//     });
// });
import { shallow } from "enzyme";
import AboutPage from "../components/components/AboutPage";
describe("<AboutPage />", function () {
    it("should render without throwing an error", function () {
        expect(shallow(React.createElement(AboutPage, null)).contains(React.createElement("h1", null, "About"))).toBe(true);
    });
});
//# sourceMappingURL=About.test.js.map