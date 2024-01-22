import * as React from "react";
import { render, } from "@testing-library/react";

import StandardsStandardsProgressReport from '../standards_standards_progress_report'

jest.mock('../../../../Teacher/components/modules/user_is_premium', () => jest.fn());

describe('StandardsStandardsProgressReport', () => {
  test('it should render', () => {
    const { asFragment } = render(<StandardsStandardsProgressReport />);
    expect(asFragment()).toMatchSnapshot();
  });
});
