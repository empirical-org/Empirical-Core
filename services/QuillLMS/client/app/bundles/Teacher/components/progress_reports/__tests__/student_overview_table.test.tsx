import * as React from "react";
import { render, } from "@testing-library/react";

import StudentOverviewTable from '../student_overview_table'

jest.mock('../../../../Teacher/components/modules/user_is_premium', () => jest.fn());

describe('StudentOverviewTable', () => {
  test('it should render', () => {
    const { asFragment } = render(<StudentOverviewTable />);
    expect(asFragment()).toMatchSnapshot();
  });
});
