import * as React from "react";
import { render } from "@testing-library/react";

import SegmentedControls from "../segmentedControls";

describe('SegmentedControls', () => {
  test('it should render', () => {
    const { asFragment } = render(<SegmentedControls />);
    expect(asFragment()).toMatchSnapshot();
  })
})
