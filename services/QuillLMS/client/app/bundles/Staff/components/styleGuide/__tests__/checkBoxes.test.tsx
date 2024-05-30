import * as React from "react";
import { render } from "@testing-library/react";

import Checkboxes from "../checkBoxes";

describe('Checkboxes', () => {
  test('it should render', () => {
    const { asFragment } = render(<Checkboxes />);
    expect(asFragment()).toMatchSnapshot();
  })
})
