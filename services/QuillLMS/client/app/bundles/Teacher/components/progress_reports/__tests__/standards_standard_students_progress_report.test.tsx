import * as React from "react";
import { render, } from "@testing-library/react";

import StandardsStandardStudentsProgressReport from '../standards_standard_students_progress_report'

jest.mock('../../../../Teacher/components/modules/user_is_premium', () => jest.fn());

describe('StandardsStandardStudentsProgressReport', () => {
  test('it should render', () => {
    const { asFragment } = render(<StandardsStandardStudentsProgressReport />);
    expect(asFragment()).toMatchSnapshot();
  });
});
