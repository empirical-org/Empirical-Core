import * as React from "react";
import { render } from "@testing-library/react";

import Menus from "../menus";

describe('Menus', () => {
  test('it should render', () => {
    const { asFragment } = render(<Menus />);
    expect(asFragment()).toMatchSnapshot();
  })
})
