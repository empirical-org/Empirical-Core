import * as React from "react";
import { render } from "@testing-library/react";

import Lists from "../lists";

describe('Lists', () => {
  test('it should render', () => {
    const { asFragment } = render(<Lists />);
    expect(asFragment()).toMatchSnapshot();
  })
})
