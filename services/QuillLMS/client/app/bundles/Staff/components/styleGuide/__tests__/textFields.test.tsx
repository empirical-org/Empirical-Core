import * as React from "react";
import { render } from "@testing-library/react";

import TextFields from "../textFields";

describe('TextFields', () => {
  test('it should render', () => {
    const { asFragment } = render(<TextFields />);
    expect(asFragment()).toMatchSnapshot();
  })
})
