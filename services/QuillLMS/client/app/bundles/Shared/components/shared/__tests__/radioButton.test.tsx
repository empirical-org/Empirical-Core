import * as React from "react";
import { render } from "@testing-library/react";

import RadioButton from "../radioButton";

const mockProps = {
  label: 'test label',
  selected: true
}

describe('RadioButton', () => {
  test('it should render', () => {
    const { asFragment } = render(<RadioButton {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  })
})
