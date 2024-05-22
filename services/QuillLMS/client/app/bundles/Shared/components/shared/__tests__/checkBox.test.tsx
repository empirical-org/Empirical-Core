import * as React from "react";
import { render } from "@testing-library/react";

import Checkbox from "../checkBox";

const mockProps = {
  label: 'test label',
  selected: true
}

describe('Checkbox', () => {
  test('it should render', () => {
    const { asFragment } = render(<Checkbox {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  })
})
