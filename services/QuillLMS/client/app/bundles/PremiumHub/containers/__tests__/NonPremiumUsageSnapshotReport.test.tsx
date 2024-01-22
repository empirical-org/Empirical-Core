import * as React from "react";
import { render } from "@testing-library/react";

import NonPremiumUsageSnapshotReport from "../NonPremiumUsageSnapshotReport";

describe('NonPremiumUsageSnapshotReport', () => {
  test('it should render', () => {
    const { asFragment } = render(<NonPremiumUsageSnapshotReport />);
    expect(asFragment()).toMatchSnapshot();
  })
})
