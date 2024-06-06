import * as React from "react";
import { render } from "@testing-library/react";

import Buttons from "../buttons";

describe('Buttons', () => {
  test('it should render', () => {
    const { asFragment } = render(<Buttons />);
    expect(asFragment()).toMatchSnapshot();
  })
})
