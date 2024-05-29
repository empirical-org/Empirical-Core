import * as React from "react";
import { render } from "@testing-library/react";

import RadioButtons from "../radioButtons";

describe('RadioButtons', () => {
  test('it should render', () => {
    const { asFragment } = render(<RadioButtons />);
    expect(asFragment()).toMatchSnapshot();
  })
})
