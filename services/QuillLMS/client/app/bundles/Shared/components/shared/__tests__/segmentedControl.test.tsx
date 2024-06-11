import * as React from "react";
import { render } from "@testing-library/react";

import SegmentedControl from "../segmentedControl";

const mockProps = {
  activeTab: "Option One",
  size: "small",
  buttons:
    [
      {
        label: "Option One",
        onClick: jest.fn()
      },
      {
        label: "Option Two",
        onClick: jest.fn()
      },
      {
        label: "Option Three",
        onClick: jest.fn()
      },
    ]
}

describe('SegmentedControl', () => {
  test('it should render', () => {
    const { asFragment } = render(<SegmentedControl {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  })
})
