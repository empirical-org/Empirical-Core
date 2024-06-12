import * as React from "react";
import { render } from "@testing-library/react";

import Typography from "../typography";

describe('Typography', () => {
  test('it should render', () => {
    const { asFragment } = render(<Typography />);
    expect(asFragment()).toMatchSnapshot();
  })
})
