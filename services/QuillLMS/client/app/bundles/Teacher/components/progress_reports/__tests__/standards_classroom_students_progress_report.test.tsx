import * as React from "react";
import { render, } from "@testing-library/react";

import StandardsClassroomStudentsProgressReport from '../standards_classroom_students_progress_report'

jest.mock('../../../../Teacher/components/modules/user_is_premium', () => jest.fn());

describe('StandardsClassroomStudentsProgressReport', () => {
  test('it should render', () => {
    const { asFragment } = render(<StandardsClassroomStudentsProgressReport />);
    expect(asFragment()).toMatchSnapshot();
  });
});
